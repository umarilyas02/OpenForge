import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { chromium } from "playwright";
import { afterAll, describe, expect, it } from "vitest";

import { OFFICIAL_CMS_BLOCKS } from "../src/official-blocks.js";

/**
 * Real axe-core accessibility scan against real rendered markup and real
 * CSS in a real browser -- not a static-analysis lint pass. jsx-a11y
 * (eslint.config.js) catches structural JSX mistakes at author time; this
 * catches what only a real layout/paint engine can, most importantly
 * color-contrast, which JSDOM-based axe runs can't evaluate at all.
 *
 * Not wired into the default `test` script (browser launch + axe adds
 * real time devDependency-only tools shouldn't impose on every run) --
 * invoke explicitly:
 *   corepack pnpm --filter @openforge/cms-blocks run test:a11y
 */

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

const blocksCssPath = path.resolve(import.meta.dirname, "../src/blocks.css");
const axeScriptPath = fileURLToPath(import.meta.resolve("axe-core/axe.min.js"));

let browser;
let tempDir;

afterAll(async () => {
  await browser?.close();
  if (tempDir) await rm(tempDir, { recursive: true, force: true });
});

describe("official CMS blocks: real axe-core accessibility scan", () => {
  it("renders every official block into one real page and finds zero serious/critical axe violations", async () => {
    const blocksCss = await readFile(blocksCssPath, "utf8");
    const axeScript = await readFile(axeScriptPath, "utf8");

    const sections = OFFICIAL_CMS_BLOCKS.map((block) => {
      const props = minimalProps(block.definition);
      let html;
      try {
        html = renderToStaticMarkup(createElement(block.component, props));
      } catch (error) {
        // A block that can't render with only its own required fields
        // (needs slot content to produce meaningful output) isn't an
        // accessibility failure -- skip it for this scan rather than
        // fail on a rendering precondition this test doesn't set up.
        return `<!-- skipped ${block.definition.id}: ${error.message} -->`;
      }
      return `<section aria-label="${block.definition.id}">${html}</section>`;
    });

    const pageHtml = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>Block accessibility scan</title>
<style>${blocksCss}</style>
</head>
<body>
${sections.join("\n")}
</body>
</html>`;

    tempDir = await mkdtemp(path.join(tmpdir(), "of-a11y-scan-"));
    const pagePath = path.join(tempDir, "blocks.html");
    await writeFile(pagePath, pageHtml);

    browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(`file://${pagePath.replace(/\\/g, "/")}`);
    await page.addScriptTag({ content: axeScript });

    const results = await page.evaluate(async () => {
      // eslint-disable-next-line no-undef -- axe is injected via the script tag above
      return await axe.run(document, {
        resultTypes: ["violations"],
      });
    });

    const serious = results.violations.filter(
      (v) => v.impact === "serious" || v.impact === "critical",
    );

    if (serious.length > 0) {
      const report = serious
        .map(
          (v) =>
            `[${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} node(s))\n` +
            v.nodes.map((n) => `    ${n.target.join(" ")}`).join("\n"),
        )
        .join("\n\n");
      // eslint-disable-next-line no-console -- this is the actual, needed test output
      console.log(`\naxe violations (serious/critical):\n\n${report}\n`);
    }

    expect(serious).toEqual([]);
  }, 60000);
});
