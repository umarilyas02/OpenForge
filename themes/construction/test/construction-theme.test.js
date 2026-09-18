import { createRenderer, parseContentTree } from "@openforge/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  constructionTheme,
  constructionThemeBlockRegistry,
  exampleSite,
} from "../src/index.js";

const renderer = createRenderer({
  theme: constructionTheme,
  blockRegistry: constructionThemeBlockRegistry,
});

describe("construction theme", () => {
  it("registers all three declared templates", () => {
    expect(() => constructionTheme.getTemplate("page")).not.toThrow();
    expect(() => constructionTheme.getTemplate("post")).not.toThrow();
    expect(() => constructionTheme.getTemplate("notFound")).not.toThrow();
  });

  it("resolves every block referenced by a region", () => {
    for (const region of constructionTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => constructionTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("sets a safety-orange-on-charcoal palette using well-formed token names", () => {
    const overrides = constructionTheme.manifest.defaultTokenOverrides;

    for (const [tokenName, value] of Object.entries(overrides)) {
      // Same shape design-tokens' own token-name schema enforces, so an
      // invented name can never be silently dropped by the style merge.
      expect(tokenName).toMatch(/^[a-z][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)+$/u);
      expect(typeof value).toBe("string");
      expect(value.trim().length).toBeGreaterThan(0);
    }

    expect(overrides["color.orange-500"]).toBe("#ff6a00");
    expect(overrides["radius.card"]).toBe("0.5rem");
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = constructionTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "Services" } },
        createElement("p", null, "Every trade under one roof"),
      ),
    );

    expect(html).toContain("of-theme-construction-page");
    expect(html).toContain("Services");
    expect(html).toContain("Every trade under one roof");
  });

  it("renders the post template with a formatted published date", () => {
    const PostTemplate = constructionTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: {
          title: "How to read a roofing estimate",
          publishedAt: "2026-05-14T00:00:00.000Z",
        },
      }),
    );

    expect(html).toContain("How to read a roofing estimate");
    expect(html).toContain("2026");
  });

  it("renders the not-found template", () => {
    const NotFoundTemplate = constructionTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("Page not found");
  });
});

describe("construction theme example site", () => {
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
          constructionTheme.isBlockAllowedInRegion("page-body", node.blockId),
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

  it("renders real contractor copy on the home page", () => {
    const home = exampleSite.find((page) => page.path === "/");
    const html = renderToStaticMarkup(
      renderer.renderTree(parseContentTree(home.blocks)),
    );

    expect(html).toContain("Ironclad");
    expect(html).toContain("contractor that shows up");
    expect(html).not.toMatch(/lorem ipsum/iu);
  });
});
