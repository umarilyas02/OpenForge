import { describe, expect, it } from "vitest";

import {
  applyVisualOperation,
  buildProjectIndex,
  parseVisualOperation,
} from "../src/index.js";

const PAGE_PATH = "app/page.jsx";
const PAGE_SOURCE = `export default function Page() {
  return <main><section><h1>Title</h1><p>Body</p></section><aside>Aside</aside></main>;
}
`;

describe("visual operation schema", () => {
  it("validates structural and page operations strictly", () => {
    const operation = {
      schemaVersion: 1,
      baseRevision: 0,
      filePath: PAGE_PATH,
      type: "insert-jsx",
      target: { nodeId: "node_0123456789abcdef" },
      payload: { jsx: "<p>New</p>", position: "inside-end" },
    };
    expect(parseVisualOperation(operation)).toEqual(operation);
    expect(() =>
      parseVisualOperation({ ...operation, unsafe: true }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_VISUAL_OPERATION_INVALID" }),
    );
  });

  it("rejects unsafe routes before source changes", () => {
    expect(() =>
      parseVisualOperation({
        schemaVersion: 1,
        baseRevision: 0,
        type: "add-page",
        payload: {
          route: "/../secrets",
          title: "Unsafe",
          description: "",
        },
      }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_VISUAL_OPERATION_INVALID" }),
    );
  });
});

describe("structural visual operations", () => {
  it("inserts, removes, and duplicates exact JSX ranges with readable diffs", async () => {
    const files = fixtureFiles();
    const section = findNode(files, "section");
    const inserted = await applyVisualOperation({
      files,
      currentRevision: 0,
      operation: nodeOperation("insert-jsx", section.id, {
        jsx: "<button>Go</button>",
        position: "inside-end",
      }),
    });
    expect(inserted.files[0].source).toContain(
      "<p>Body</p><button>Go</button></section>",
    );
    expect(inserted.fileDiffs[0].patch).toContain("+");
    expect(inserted.summary).toBe("Inserted JSX inside end.");

    const insertedButton = findNode(inserted.files, "button");
    const duplicated = await applyVisualOperation({
      files: inserted.files,
      currentRevision: 1,
      operation: nodeOperation(
        "duplicate-jsx",
        insertedButton.id,
        undefined,
        1,
      ),
    });
    expect(
      duplicated.files[0].source.match(/<button>Go<\/button>/gu),
    ).toHaveLength(2);

    const duplicateButton = findNodes(duplicated.files, "button")[1];
    const removed = await applyVisualOperation({
      files: duplicated.files,
      currentRevision: 2,
      operation: nodeOperation("remove-jsx", duplicateButton.id, undefined, 2),
    });
    expect(
      removed.files[0].source.match(/<button>Go<\/button>/gu),
    ).toHaveLength(1);
  });

  it("moves, wraps, and unwraps JSX while denying recursive moves", async () => {
    const files = fixtureFiles();
    const paragraph = findNode(files, "p");
    const aside = findNode(files, "aside");
    const moved = await applyVisualOperation({
      files,
      currentRevision: 0,
      operation: nodeOperation("move-jsx", paragraph.id, {
        destinationNodeId: aside.id,
        position: "after",
      }),
    });
    expect(moved.files[0].source).toContain(
      "</section><aside>Aside</aside><p>Body</p>",
    );

    const movedParagraph = findNode(moved.files, "p");
    const wrapped = await applyVisualOperation({
      files: moved.files,
      currentRevision: 1,
      operation: nodeOperation(
        "wrap-jsx",
        movedParagraph.id,
        {
          element: "div",
          attributes: { className: "prose", hidden: false },
        },
        1,
      ),
    });
    expect(wrapped.files[0].source).toContain(
      '<div className="prose" hidden={false}><p>Body</p></div>',
    );

    const wrapper = findNodes(wrapped.files, "div").at(-1);
    const unwrapped = await applyVisualOperation({
      files: wrapped.files,
      currentRevision: 2,
      operation: nodeOperation("unwrap-jsx", wrapper.id, undefined, 2),
    });
    expect(unwrapped.files[0].source).not.toContain("<div");
    expect(unwrapped.files[0].source).toContain("<p>Body</p>");

    const main = findNode(files, "main");
    await expect(
      applyVisualOperation({
        files,
        currentRevision: 0,
        operation: nodeOperation("move-jsx", main.id, {
          destinationNodeId: paragraph.id,
          position: "inside-end",
        }),
      }),
    ).rejects.toMatchObject({ code: "OF_OPERATION_INVALID_DESTINATION" });
  });

  it("replaces assets and link content through explicit semantic operations", async () => {
    const source = `export function Card() {
  return <article><img src="/old.png" alt="Old" /><a href="/old">Read more</a></article>;
}
`;
    const files = [{ path: "components/Card.jsx", source }];
    const image = findNode(files, "img");
    const asset = await applyVisualOperation({
      files,
      currentRevision: 0,
      operation: nodeOperation(
        "replace-asset",
        image.id,
        { src: "/new.png", alt: "New product" },
        0,
        "components/Card.jsx",
      ),
    });
    expect(asset.files[0].source).toContain(
      '<img src="/new.png" alt="New product" />',
    );

    const link = findNode(asset.files, "a");
    const changedLink = await applyVisualOperation({
      files: asset.files,
      currentRevision: 1,
      operation: nodeOperation(
        "change-link",
        link.id,
        { href: "/work", label: "View work" },
        1,
        "components/Card.jsx",
      ),
    });
    expect(changedLink.files[0].source).toContain(
      '<a href="/work">View work</a>',
    );
  });

  it("rejects malformed insertion fragments and stale revisions", async () => {
    const files = fixtureFiles();
    const main = findNode(files, "main");
    const operation = nodeOperation("insert-jsx", main.id, {
      jsx: "<p>One</p><p>Two</p>",
      position: "inside-end",
    });

    await expect(
      applyVisualOperation({ files, operation, currentRevision: 0 }),
    ).rejects.toMatchObject({ code: "OF_OPERATION_INVALID_JSX" });
    await expect(
      applyVisualOperation({
        files,
        operation: {
          ...operation,
          payload: { ...operation.payload, jsx: "<p>One</p>" },
        },
        currentRevision: 3,
      }),
    ).rejects.toMatchObject({ code: "OF_OPERATION_STALE_REVISION" });
  });
});

describe("page visual operations", () => {
  it("adds, updates, renames, and deletes App Router pages", async () => {
    const files = fixtureFiles();
    const added = await applyVisualOperation({
      files,
      currentRevision: 0,
      operation: {
        schemaVersion: 1,
        baseRevision: 0,
        type: "add-page",
        payload: {
          route: "/about-us",
          title: "About us",
          description: "Meet the team.",
        },
      },
    });
    expect(added.changedFiles).toEqual(["app/about-us/page.jsx"]);
    expect(
      added.files.find(({ path }) => path === "app/about-us/page.jsx").source,
    ).toContain("export default function AboutUsPage()");
    expect(added.inverseOperation).toMatchObject({
      type: "delete-page",
      filePath: "app/about-us/page.jsx",
      baseRevision: 1,
    });

    const updated = await applyVisualOperation({
      files: added.files,
      currentRevision: 1,
      operation: {
        schemaVersion: 1,
        baseRevision: 1,
        filePath: "app/about-us/page.jsx",
        type: "update-page-metadata",
        payload: { title: "Our studio", description: "How we work." },
      },
    });
    expect(
      updated.files.find(({ path }) => path === "app/about-us/page.jsx").source,
    ).toContain('title: "Our studio"');

    const renamed = await applyVisualOperation({
      files: updated.files,
      currentRevision: 2,
      operation: {
        schemaVersion: 1,
        baseRevision: 2,
        filePath: "app/about-us/page.jsx",
        type: "rename-page",
        payload: { route: "/studio" },
      },
    });
    expect(renamed.changedFiles).toEqual([
      "app/about-us/page.jsx",
      "app/studio/page.jsx",
    ]);
    expect(renamed.inverseOperation).toMatchObject({
      type: "rename-page",
      filePath: "app/studio/page.jsx",
      payload: { route: "/about-us" },
    });

    const deleted = await applyVisualOperation({
      files: renamed.files,
      currentRevision: 3,
      operation: {
        schemaVersion: 1,
        baseRevision: 3,
        filePath: "app/studio/page.jsx",
        type: "delete-page",
      },
    });
    expect(
      deleted.files.some(({ path }) => path === "app/studio/page.jsx"),
    ).toBe(false);
    expect(deleted.fileDiffs[0].patch).toContain("/dev/null");
  });

  it("rejects page collisions and non-page deletion targets", async () => {
    const files = fixtureFiles();
    await expect(
      applyVisualOperation({
        files,
        currentRevision: 0,
        operation: {
          schemaVersion: 1,
          baseRevision: 0,
          type: "add-page",
          payload: { route: "/", title: "Duplicate", description: "" },
        },
      }),
    ).rejects.toMatchObject({ code: "OF_OPERATION_FILE_EXISTS" });

    await expect(
      applyVisualOperation({
        files,
        currentRevision: 0,
        operation: {
          schemaVersion: 1,
          baseRevision: 0,
          filePath: "components/Thing.jsx",
          type: "delete-page",
        },
      }),
    ).rejects.toMatchObject({ code: "OF_OPERATION_NOT_PAGE" });
  });

  it("updates literal metadata minimally and preserves unrelated fields", async () => {
    const source = `export const metadata = {
  title: "Old title",
  robots: { index: false },
};

export default function Page() {
  return <main>Private</main>;
}
`;
    const result = await applyVisualOperation({
      files: [{ path: PAGE_PATH, source }],
      currentRevision: 0,
      operation: {
        schemaVersion: 1,
        baseRevision: 0,
        filePath: PAGE_PATH,
        type: "update-page-metadata",
        payload: { title: "New title", description: "Page summary." },
      },
    });

    expect(result.files[0].source).toContain('title: "New title"');
    expect(result.files[0].source).toContain("robots: { index: false }");
    expect(result.files[0].source).toContain('description: "Page summary."');
    expect(result.fileDiffs[0].patch).not.toContain("-  robots:");
  });
});

function fixtureFiles() {
  return [
    { path: PAGE_PATH, source: PAGE_SOURCE },
    {
      path: "components/Thing.jsx",
      source: "export function Thing() { return <div>Thing</div>; }\n",
    },
  ];
}

function findNodes(files, element) {
  return buildProjectIndex({ files }).nodes.filter(
    (candidate) => candidate.element === element,
  );
}

function findNode(files, element) {
  const node = findNodes(files, element)[0];
  if (!node) throw new Error(`Missing fixture node: ${element}`);
  return node;
}

function nodeOperation(
  type,
  nodeId,
  payload,
  baseRevision = 0,
  filePath = PAGE_PATH,
) {
  return {
    schemaVersion: 1,
    baseRevision,
    filePath,
    type,
    target: { nodeId },
    ...(payload === undefined ? {} : { payload }),
  };
}
