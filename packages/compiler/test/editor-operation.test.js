import { access, readFile } from "node:fs/promises";
import path from "node:path";

import { describe, expect, it } from "vitest";

import {
  applyEditorOperation,
  buildProjectIndex,
  parseEditorOperation,
} from "../src/index.js";

const PAGE_PATH = "app/page.jsx";
const PAGE_SOURCE =
  'export default function Page() {\n  return <main><h1 className="title">Hello</h1></main>;\n}\n';

describe("editor operation schema", () => {
  it("accepts a version 1 operation and strips no declared data", () => {
    const operation = createNodeOperation({
      type: "replace-jsx-text",
      target: { nodeId: "node_0123456789abcdef" },
      payload: { text: "Portable" },
    });

    expect(parseEditorOperation(operation)).toEqual(operation);
  });

  it("rejects unsupported versions and unknown fields", () => {
    expect(() =>
      parseEditorOperation({
        ...createNodeOperation({
          type: "replace-jsx-text",
          target: { nodeId: "node_0123456789abcdef" },
          payload: { text: "Portable" },
        }),
        schemaVersion: 2,
      }),
    ).toThrowError(expect.objectContaining({ code: "OF_OPERATION_INVALID" }));

    expect(() =>
      parseEditorOperation({
        ...createNodeOperation({
          type: "remove-jsx-attribute",
          target: { nodeId: "node_0123456789abcdef" },
          payload: { name: "className" },
        }),
        unsafe: true,
      }),
    ).toThrowError(expect.objectContaining({ code: "OF_OPERATION_INVALID" }));
  });

  it("requires import bindings appropriate to the import kind", () => {
    expect(() =>
      parseEditorOperation({
        schemaVersion: 1,
        baseRevision: 0,
        filePath: PAGE_PATH,
        type: "add-import",
        payload: {
          source: "react",
          importKind: "named",
        },
      }),
    ).toThrowError(expect.objectContaining({ code: "OF_OPERATION_INVALID" }));
  });
});

describe("applyEditorOperation", () => {
  it("sets an attribute with a minimal patch and safe inverse", async () => {
    const files = [{ path: PAGE_PATH, source: PAGE_SOURCE }];
    const heading = findNode(files, "h1");
    const operation = createNodeOperation({
      type: "set-jsx-attribute",
      target: { nodeId: heading.id },
      payload: { name: "className", value: "headline" },
    });

    const result = await applyEditorOperation({
      files,
      operation,
      currentRevision: 0,
    });

    expect(result.files[0].source).toBe(
      PAGE_SOURCE.replace('className="title"', 'className="headline"'),
    );
    expect(result.changedFiles).toEqual([PAGE_PATH]);
    expect(result.nextRevision).toBe(1);
    expect(result.summary).toBe('Set JSX attribute "className".');
    expect(result.fileDiffs[0].patch).toContain(
      '-  return <main><h1 className="title">',
    );
    expect(result.fileDiffs[0].patch).toContain(
      '+  return <main><h1 className="headline">',
    );
    expect(files[0].source).toBe(PAGE_SOURCE);

    const restored = await applyEditorOperation({
      files: result.files,
      operation: result.inverseOperation,
      currentRevision: result.nextRevision,
    });
    expect(restored.files[0].source).toBe(PAGE_SOURCE);
  });

  it("adds and inversely removes a new literal attribute", async () => {
    const source =
      "export function Button() {\n  return <button>Save</button>;\n}\n";
    const files = [{ path: "components/Button.jsx", source }];
    const button = findNode(files, "button");

    const added = await applyEditorOperation({
      files,
      currentRevision: 4,
      operation: {
        schemaVersion: 1,
        baseRevision: 4,
        filePath: "components/Button.jsx",
        type: "set-jsx-attribute",
        target: { nodeId: button.id },
        payload: { name: "disabled", value: true },
      },
    });
    expect(added.files[0].source).toContain("<button disabled>");

    const restored = await applyEditorOperation({
      files: added.files,
      currentRevision: 5,
      operation: added.inverseOperation,
    });
    expect(restored.files[0].source).toBe(source);
  });

  it("replaces direct JSX text and escapes structural characters", async () => {
    const files = [{ path: PAGE_PATH, source: PAGE_SOURCE }];
    const heading = findNode(files, "h1");
    const result = await applyEditorOperation({
      files,
      currentRevision: 0,
      operation: createNodeOperation({
        type: "replace-jsx-text",
        target: { nodeId: heading.id },
        payload: { text: "Build < safely & {portably}" },
      }),
    });

    expect(result.files[0].source).toContain(
      "Build &lt; safely &amp; &#123;portably&#125;",
    );
  });

  it("restores canonical JSX entities through a safe inverse", async () => {
    const source =
      "export default function Page() { return <h1>Open &amp; portable</h1>; }";
    const files = [{ path: PAGE_PATH, source }];
    const heading = findNode(files, "h1");
    const result = await applyEditorOperation({
      files,
      currentRevision: 0,
      operation: createNodeOperation({
        type: "replace-jsx-text",
        target: { nodeId: heading.id },
        payload: { text: "Changed" },
      }),
    });

    const restored = await applyEditorOperation({
      files: result.files,
      currentRevision: result.nextRevision,
      operation: result.inverseOperation,
    });
    expect(restored.files[0].source).toBe(source);
  });

  it("rejects ambiguous text and stale revisions", async () => {
    const source =
      "export default function Page() { return <h1>Hello <em>world</em></h1>; }";
    const files = [{ path: PAGE_PATH, source }];
    const heading = findNode(files, "h1");
    const operation = createNodeOperation({
      type: "replace-jsx-text",
      target: { nodeId: heading.id },
      payload: { text: "Changed" },
    });

    await expect(
      applyEditorOperation({ files, operation, currentRevision: 0 }),
    ).rejects.toMatchObject({ code: "OF_OPERATION_AMBIGUOUS" });
    await expect(
      applyEditorOperation({ files, operation, currentRevision: 2 }),
    ).rejects.toMatchObject({ code: "OF_OPERATION_STALE_REVISION" });
  });

  it("does not expose code-only source as a write target", async () => {
    const files = [
      {
        path: "components/createCard.jsx",
        source: `
          export function createCard() {
            return function Card() { return <article>Unsafe target</article>; };
          }
        `,
      },
    ];

    await expect(
      applyEditorOperation({
        files,
        currentRevision: 0,
        operation: createNodeOperation({
          filePath: "components/createCard.jsx",
          type: "replace-jsx-text",
          target: { nodeId: "node_0123456789abcdef" },
          payload: { text: "Blocked" },
        }),
      }),
    ).rejects.toMatchObject({ code: "OF_OPERATION_TARGET_NOT_FOUND" });
  });

  it("adds and merges imports deterministically", async () => {
    const source =
      '"use client";\n\nimport { useState } from "react";\n\nexport default function Page() { return <main />; }\n';
    const first = await applyEditorOperation({
      files: [{ path: PAGE_PATH, source }],
      currentRevision: 0,
      operation: createImportOperation({
        importKind: "named",
        imported: "useEffect",
      }),
    });

    expect(first.files[0].source).toContain(
      'import { useState, useEffect } from "react";',
    );

    const second = await applyEditorOperation({
      files: first.files,
      currentRevision: 1,
      operation: createImportOperation({
        baseRevision: 1,
        source: "next/image",
        importKind: "default",
        local: "Image",
      }),
    });

    expect(second.files[0].source).toContain('import Image from "next/image";');
    expect(second.summary).toBe('Added default import from "next/image".');
    expect(second.inverseOperation).toBeNull();
  });

  it("rejects duplicate and unsafe import merges", async () => {
    const source =
      'import { useState } from "react";\nexport default function Page() { return <main />; }\n';
    const files = [{ path: PAGE_PATH, source }];

    await expect(
      applyEditorOperation({
        files,
        currentRevision: 0,
        operation: createImportOperation({
          importKind: "named",
          imported: "useState",
        }),
      }),
    ).rejects.toMatchObject({ code: "OF_OPERATION_NO_CHANGE" });

    await expect(
      applyEditorOperation({
        files,
        currentRevision: 0,
        operation: createImportOperation({
          importKind: "namespace",
          local: "React",
        }),
      }),
    ).rejects.toMatchObject({ code: "OF_OPERATION_AMBIGUOUS" });
  });

  it("preserves imports with inline comments by rejecting their rewrite", async () => {
    const source =
      'import { useState, /* keep this rationale */ useMemo } from "react";\nexport default function Page() { return <main />; }\n';

    await expect(
      applyEditorOperation({
        files: [{ path: PAGE_PATH, source }],
        currentRevision: 0,
        operation: createImportOperation({
          importKind: "named",
          imported: "useEffect",
        }),
      }),
    ).rejects.toMatchObject({ code: "OF_OPERATION_AMBIGUOUS" });
  });

  it("runs validators in a temporary workspace and removes it", async () => {
    const files = [{ path: PAGE_PATH, source: PAGE_SOURCE }];
    const heading = findNode(files, "h1");
    let temporaryPath;

    const result = await applyEditorOperation({
      files,
      currentRevision: 0,
      operation: createNodeOperation({
        type: "replace-jsx-text",
        target: { nodeId: heading.id },
        payload: { text: "Validated" },
      }),
      validators: [
        async ({ workspacePath }) => {
          temporaryPath = workspacePath;
          const materialized = await readFile(
            path.join(workspacePath, "app", "page.jsx"),
            "utf8",
          );
          expect(materialized).toContain("Validated");
        },
      ],
    });

    expect(result.files[0].source).toContain("Validated");
    await expect(access(temporaryPath)).rejects.toThrow();
  });

  it("rejects failed workspace validation without mutating input", async () => {
    const files = [{ path: PAGE_PATH, source: PAGE_SOURCE }];
    const heading = findNode(files, "h1");

    await expect(
      applyEditorOperation({
        files,
        currentRevision: 0,
        operation: createNodeOperation({
          type: "replace-jsx-text",
          target: { nodeId: heading.id },
          payload: { text: "Rejected" },
        }),
        validators: [
          () => {
            throw new Error("lint failed");
          },
        ],
      }),
    ).rejects.toMatchObject({
      code: "OF_OPERATION_VALIDATION_FAILED",
      details: { cause: "lint failed" },
    });
    expect(files[0].source).toBe(PAGE_SOURCE);
  });

  it("validates formatter output before materializing a workspace", async () => {
    const files = [{ path: PAGE_PATH, source: PAGE_SOURCE }];
    const heading = findNode(files, "h1");

    await expect(
      applyEditorOperation({
        files,
        currentRevision: 0,
        operation: createNodeOperation({
          type: "replace-jsx-text",
          target: { nodeId: heading.id },
          payload: { text: "Formatted" },
        }),
        format: () => "export default function Broken( {",
      }),
    ).rejects.toMatchObject({ code: "OF_OPERATION_VALIDATION_FAILED" });
  });

  it("returns no unsafe inverse for expression-valued attributes", async () => {
    const source =
      "export function Hero({ tone }) { return <section data-tone={tone}>Hero</section>; }";
    const files = [{ path: "components/Hero.jsx", source }];
    const section = findNode(files, "section");

    const result = await applyEditorOperation({
      files,
      currentRevision: 0,
      operation: createNodeOperation({
        filePath: "components/Hero.jsx",
        type: "remove-jsx-attribute",
        target: { nodeId: section.id },
        payload: { name: "data-tone" },
      }),
    });

    expect(result.inverseOperation).toBeNull();
  });
});

function findNode(files, element) {
  const node = buildProjectIndex({ files }).nodes.find(
    (candidate) => candidate.element === element,
  );
  if (!node) {
    throw new Error(`Fixture node "${element}" was not indexed.`);
  }
  return node;
}

function createNodeOperation(overrides) {
  return {
    schemaVersion: 1,
    baseRevision: 0,
    filePath: PAGE_PATH,
    ...overrides,
  };
}

function createImportOperation(payload) {
  const { baseRevision = 0, source = "react", ...importPayload } = payload;
  return {
    schemaVersion: 1,
    baseRevision,
    filePath: PAGE_PATH,
    type: "add-import",
    payload: {
      source,
      ...importPayload,
    },
  };
}
