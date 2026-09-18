import { createRenderer, parseContentTree } from "@openforge/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  exampleSite,
  financeTheme,
  financeThemeBlockRegistry,
} from "../src/index.js";

const renderer = createRenderer({
  theme: financeTheme,
  blockRegistry: financeThemeBlockRegistry,
});

describe("finance theme", () => {
  it("registers all three declared templates", () => {
    expect(() => financeTheme.getTemplate("page")).not.toThrow();
    expect(() => financeTheme.getTemplate("post")).not.toThrow();
    expect(() => financeTheme.getTemplate("notFound")).not.toThrow();
  });

  it("resolves every block referenced by a region", () => {
    for (const region of financeTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => financeTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("sets a deep blue-teal brand palette using well-formed token names", () => {
    const overrides = financeTheme.manifest.defaultTokenOverrides;

    for (const [tokenName, value] of Object.entries(overrides)) {
      // Same shape design-tokens' own token-name schema enforces, so an
      // invented name can never be silently dropped by the style merge.
      expect(tokenName).toMatch(/^[a-z][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)+$/u);
      expect(typeof value).toBe("string");
      expect(value.trim().length).toBeGreaterThan(0);
    }

    expect(overrides["color.orange-500"]).toBe("#0e7490");
    expect(overrides["radius.card"]).toBe("0.5rem");
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = financeTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "Services" } },
        createElement("p", null, "Advisory built around your numbers"),
      ),
    );

    expect(html).toContain("of-theme-finance-page");
    expect(html).toContain("Services");
    expect(html).toContain("Advisory built around your numbers");
  });

  it("renders the post template with a formatted published date", () => {
    const PostTemplate = financeTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: {
          title: "Reading the yield curve without the jargon",
          publishedAt: "2026-05-14T00:00:00.000Z",
        },
      }),
    );

    expect(html).toContain("Reading the yield curve without the jargon");
    expect(html).toContain("2026");
  });

  it("renders the not-found template", () => {
    const NotFoundTemplate = financeTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("Page not found");
  });
});

describe("finance theme example site", () => {
  it("ships five pages with unique root-relative paths", () => {
    expect(exampleSite).toHaveLength(5);

    const paths = exampleSite.map((page) => page.path);
    expect(new Set(paths).size).toBe(paths.length);

    for (const page of exampleSite) {
      expect(page.path.startsWith("/")).toBe(true);
      expect(page.title.length).toBeGreaterThan(0);
      expect(page.blocks.length).toBeGreaterThan(0);
    }
  });

  it("parses every page as a valid content tree", () => {
    for (const page of exampleSite) {
      expect(() => parseContentTree(page.blocks)).not.toThrow();
    }
  });

  it("only uses blocks the page-body region allows at the top level", () => {
    for (const page of exampleSite) {
      for (const node of page.blocks) {
        expect(
          financeTheme.isBlockAllowedInRegion("page-body", node.blockId),
        ).toBe(true);
      }
    }
  });

  it("renders every block of every page without throwing", () => {
    for (const page of exampleSite) {
      const nodes = parseContentTree(page.blocks);

      nodes.forEach((node, index) => {
        expect(() =>
          renderToStaticMarkup(renderer.renderNode(node, [index])),
        ).not.toThrow();
      });
    }
  });

  it("renders real advisory copy on the home page", () => {
    const home = exampleSite.find((page) => page.path === "/");
    const html = renderToStaticMarkup(
      renderer.renderTree(parseContentTree(home.blocks)),
    );

    expect(html).toContain("Financial clarity for decisions that can't wait");
    expect(html).toContain("Northgate Capital Partners");
    expect(html).not.toMatch(/lorem ipsum/iu);
  });
});
