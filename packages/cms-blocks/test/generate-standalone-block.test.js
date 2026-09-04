import { readdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { generateStandaloneBlock } from "../src/generate-standalone-block.js";
import { OFFICIAL_CMS_BLOCKS } from "../src/official-blocks.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const blocksDir = path.resolve(here, "../src/blocks");
const standaloneDir = path.resolve(here, "../dist/standalone");

function dummyValueFor(field) {
  if (field.control === "boolean") return true;
  if (field.control === "url") return "https://example.test";
  if (field.control === "image") return "https://example.test/image.png";
  if (field.control === "select") return field.options[0].value;
  return "Test value";
}

function minimalProps(definition) {
  const props = { ...definition.defaultProps };
  for (const field of definition.editableFields) {
    if (field.required && !(field.path in props)) {
      props[field.path] = dummyValueFor(field);
    }
  }
  return props;
}

describe("generateStandaloneBlock", () => {
  it("strips the createCmsBlock registration and adds a plain default export", () => {
    const source = [
      'import { createCmsBlock } from "../block.js";',
      "",
      "function Hero({ heading }) {",
      "  return <h1>{heading}</h1>;",
      "}",
      "",
      "export const heroBlock = createCmsBlock({",
      '  definition: { id: "openforge-cms.hero" },',
      "  component: Hero,",
      "});",
      "",
    ].join("\n");

    const output = generateStandaloneBlock(source);

    expect(output).not.toContain("createCmsBlock");
    expect(output).not.toContain('from "../block.js"');
    expect(output).toContain("function Hero({ heading })");
    expect(output).toContain("export default Hero;");
  });

  it("rewrites a slots-consuming block to read plain children instead", () => {
    const source = [
      'import { createCmsBlock } from "../block.js";',
      "",
      "function Columns({ heading, slots }) {",
      "  const items = slots?.items ?? [];",
      "  return <div>{items}</div>;",
      "}",
      "",
      "export const columnsBlock = createCmsBlock({",
      '  definition: { id: "openforge-cms.columns" },',
      "  component: Columns,",
      "});",
      "",
    ].join("\n");

    const output = generateStandaloneBlock(source);

    expect(output).not.toContain("slots");
    expect(output).toContain("function Columns({ heading, children })");
    expect(output).toContain(
      "const items = Array.isArray(children) ? children : children ? [children] : [];",
    );
  });

  it("throws a clear error when the createCmsBlock line is missing", () => {
    expect(() =>
      generateStandaloneBlock("export default function X() {}"),
    ).toThrow(/createCmsBlock/u);
  });
});

describe("generated standalone block files", () => {
  it("exist for every real block source file", async () => {
    const sourceFiles = (await readdir(blocksDir)).filter((f) =>
      f.endsWith(".jsx"),
    );
    const generatedFiles = (await readdir(standaloneDir)).filter((f) =>
      f.endsWith(".jsx"),
    );
    expect(generatedFiles.sort()).toEqual(sourceFiles.sort());
  });

  it.each(OFFICIAL_CMS_BLOCKS)(
    "renders the generated standalone file for $definition.id without throwing",
    async (block) => {
      const fileName = `${block.definition.id.split(".")[1]}.jsx`;
      const filePath = path.join(standaloneDir, fileName);
      const module = await import(`${filePath}?t=${Date.now()}`);
      const Component = module.default;
      expect(typeof Component).toBe("function");

      const props = minimalProps(block.definition);
      const hasSlot = block.definition.slots.length > 0;
      const children = hasSlot
        ? [
            createElement("span", { key: "a" }, "child A"),
            createElement("span", { key: "b" }, "child B"),
          ]
        : undefined;

      expect(() =>
        renderToStaticMarkup(createElement(Component, props, children)),
      ).not.toThrow();
    },
  );
});
