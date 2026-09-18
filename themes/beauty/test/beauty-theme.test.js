import { createRenderer, parseContentTree } from "@openforge/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  beautyTheme,
  beautyThemeBlockRegistry,
  exampleSite,
} from "../src/index.js";

const renderer = createRenderer({
  theme: beautyTheme,
  blockRegistry: beautyThemeBlockRegistry,
});

describe("beauty theme", () => {
  it("registers all three declared templates", () => {
    expect(() => beautyTheme.getTemplate("page")).not.toThrow();
    expect(() => beautyTheme.getTemplate("post")).not.toThrow();
    expect(() => beautyTheme.getTemplate("notFound")).not.toThrow();
  });

  it("resolves every block referenced by a region", () => {
    for (const region of beautyTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => beautyTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("sets a blush-pink brand palette using well-formed token names", () => {
    const overrides = beautyTheme.manifest.defaultTokenOverrides;

    for (const [tokenName, value] of Object.entries(overrides)) {
      // Same shape design-tokens' own token-name schema enforces, so an
      // invented name can never be silently dropped by the style merge.
      expect(tokenName).toMatch(/^[a-z][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)+$/u);
      expect(typeof value).toBe("string");
      expect(value.trim().length).toBeGreaterThan(0);
    }

    expect(overrides["color.orange-500"]).toBe("#d98fa2");
    expect(overrides["radius.control"]).toBe("999px");
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = beautyTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "Services & pricing" } },
        createElement("p", null, "Every treatment, plainly priced"),
      ),
    );

    expect(html).toContain("of-theme-beauty-page");
    expect(html).toContain("Services & pricing");
    expect(html).toContain("Every treatment, plainly priced");
  });

  it("renders the post template with a formatted published date", () => {
    const PostTemplate = beautyTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: {
          title: "Caring for color-treated hair through winter",
          publishedAt: "2026-05-14T00:00:00.000Z",
        },
      }),
    );

    expect(html).toContain("Caring for color-treated hair through winter");
    expect(html).toContain("2026");
  });

  it("renders the not-found template", () => {
    const NotFoundTemplate = beautyTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("Page not found");
  });
});

describe("beauty theme example site", () => {
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
          beautyTheme.isBlockAllowedInRegion("page-body", node.blockId),
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

  it("renders real salon copy on the home page", () => {
    const home = exampleSite.find((page) => page.path === "/");
    const html = renderToStaticMarkup(
      renderer.renderTree(parseContentTree(home.blocks)),
    );

    expect(html).toContain("An hour to yourself");
    expect(html).toContain("Petalwood");
    expect(html).not.toMatch(/lorem ipsum/iu);
  });
});
