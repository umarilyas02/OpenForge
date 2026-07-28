import { describe, expect, it } from "vitest";

import {
  COMPATIBILITY_LEVELS,
  DuplicateProjectPathError,
  ProjectPathError,
  buildProjectIndex,
  normalizeProjectPath,
} from "../src/index.js";

describe("normalizeProjectPath", () => {
  it.each([
    ["app\\blog\\page.jsx", "app/blog/page.jsx"],
    ["./app//page.jsx", "app/page.jsx"],
    ["components/Hero.jsx", "components/Hero.jsx"],
  ])("normalizes %s", (input, expected) => {
    expect(normalizeProjectPath(input)).toBe(expected);
  });

  it.each([
    "/etc/passwd",
    "C:\\Windows\\system.ini",
    "\\\\server\\share\\file.jsx",
    "../outside.jsx",
    "app/../../outside.jsx",
    ".",
    "app/\0page.jsx",
  ])("rejects unsafe path %s", (input) => {
    expect(() => normalizeProjectPath(input)).toThrow(ProjectPathError);
  });
});

describe("buildProjectIndex", () => {
  const project = [
    {
      path: "components/Button.jsx",
      source: `
        export function Button({ children }) {
          return <button type="button"><span>{children}</span></button>;
        }
      `,
    },
    {
      path: "app/page.jsx",
      source: `
        import { Button } from "../components/Button";
        export { metadata } from "./metadata.js";

        export default function Page() {
          return <main><Button>OpenForge</Button></main>;
        }

        export async function loadPanel() {
          return import("../components/Button.jsx");
        }
      `,
    },
    {
      path: "app/metadata.js",
      source: `export const metadata = { title: "OpenForge" };`,
    },
  ];

  it("maps components and JSX nodes with resolved dependencies", () => {
    const index = buildProjectIndex({ files: project });
    const page = index.files.find(({ path }) => path === "app/page.jsx");
    const relativeDependencies = index.dependencies.filter(
      ({ external }) => !external,
    );

    expect(index.schemaVersion).toBe(1);
    expect(index.components.map(({ name }) => name).sort()).toEqual([
      "Button",
      "Page",
    ]);
    expect(index.nodes.map(({ element }) => element).sort()).toEqual([
      "Button",
      "button",
      "main",
      "span",
    ]);
    expect(page.compatibility).toBe(COMPATIBILITY_LEVELS.SUPPORTED);
    expect(relativeDependencies).toHaveLength(3);
    expect(relativeDependencies.every(({ resolved }) => resolved)).toBe(true);
    expect(relativeDependencies.map(({ target }) => target).sort()).toEqual([
      "app/metadata.js",
      "components/Button.jsx",
      "components/Button.jsx",
    ]);
  });

  it("rebuilds identical indexes without hidden state", () => {
    expect(buildProjectIndex({ files: project })).toEqual(
      buildProjectIndex({ files: [...project].reverse() }),
    );
  });

  it("keeps mapping identifiers stable across formatting-only changes", () => {
    const compact = buildProjectIndex({
      files: [
        {
          path: "app/page.jsx",
          source:
            "export default function Page(){return <main><h1>Hello</h1></main>}",
        },
      ],
    });
    const formatted = buildProjectIndex({
      files: [
        {
          path: "app/page.jsx",
          source: `
            export default function Page() {
              return (
                <main>
                  <h1>Hello</h1>
                </main>
              );
            }
          `,
        },
      ],
    });

    expect(compact.components.map(({ id }) => id)).toEqual(
      formatted.components.map(({ id }) => id),
    );
    expect(compact.nodes.map(({ id }) => id)).toEqual(
      formatted.nodes.map(({ id }) => id),
    );
  });

  it("aggregates parser failures without creating AST records", () => {
    const index = buildProjectIndex({
      files: [
        {
          path: "app/broken.jsx",
          source: "export default function Broken( {",
        },
      ],
    });

    expect(index.files[0].compatibility).toBe(COMPATIBILITY_LEVELS.CODE_ONLY);
    expect(index.components).toEqual([]);
    expect(index.nodes).toEqual([]);
    expect(index.diagnostics[0]).toMatchObject({
      code: "OF_COMPAT_PARSE_ERROR",
      filePath: "app/broken.jsx",
    });
  });

  it("does not expose visual targets from code-only files", () => {
    const index = buildProjectIndex({
      files: [
        {
          path: "components/createCard.jsx",
          source: `
            export function createCard(variant) {
              return function GeneratedCard({ children }) {
                return <article data-variant={variant}>{children}</article>;
              };
            }
          `,
        },
      ],
    });

    expect(index.files[0].compatibility).toBe(COMPATIBILITY_LEVELS.CODE_ONLY);
    expect(index.files[0].componentIds).toEqual([]);
    expect(index.files[0].nodeIds).toEqual([]);
    expect(index.components).toEqual([]);
    expect(index.nodes).toEqual([]);
  });

  it("records unresolved relative and external package dependencies", () => {
    const index = buildProjectIndex({
      files: [
        {
          path: "app/page.jsx",
          source: `
            import React from "react";
            import { Missing } from "../components/Missing";
            export default function Page() { return <Missing />; }
          `,
        },
      ],
    });

    expect(index.dependencies).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          specifier: "react",
          external: true,
          resolved: true,
          target: null,
        }),
        expect.objectContaining({
          specifier: "../components/Missing",
          external: false,
          resolved: false,
          target: null,
        }),
      ]),
    );
  });

  it("rejects duplicate normalized paths", () => {
    expect(() =>
      buildProjectIndex({
        files: [
          { path: "app/page.jsx", source: "" },
          { path: "app//page.jsx", source: "" },
        ],
      }),
    ).toThrow(DuplicateProjectPathError);
  });

  it("rejects case-insensitive path collisions", () => {
    expect(() =>
      buildProjectIndex({
        files: [
          { path: "components/Hero.jsx", source: "" },
          { path: "components/hero.jsx", source: "" },
        ],
      }),
    ).toThrow("collide on case-insensitive filesystems");
  });
});
