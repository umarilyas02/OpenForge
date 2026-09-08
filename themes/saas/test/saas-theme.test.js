import { createRenderer, parseContentTree } from "@openforge/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  exampleSite,
  saasTheme,
  saasThemeBlockRegistry,
} from "../src/index.js";

const renderer = createRenderer({
  theme: saasTheme,
  blockRegistry: saasThemeBlockRegistry,
});

describe("saas theme", () => {
  it("registers all three declared templates", () => {
    expect(() => saasTheme.getTemplate("page")).not.toThrow();
    expect(() => saasTheme.getTemplate("post")).not.toThrow();
    expect(() => saasTheme.getTemplate("notFound")).not.toThrow();
  });

  it("resolves every block referenced by a region", () => {
    for (const region of saasTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => saasTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("sets an indigo brand palette using well-formed token names", () => {
    const overrides = saasTheme.manifest.defaultTokenOverrides;

    for (const [tokenName, value] of Object.entries(overrides)) {
      // Same shape design-tokens' own token-name schema enforces, so an
      // invented name can never be silently dropped by the style merge.
      expect(tokenName).toMatch(/^[a-z][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)+$/u);
      expect(typeof value).toBe("string");
      expect(value.trim().length).toBeGreaterThan(0);
    }

    expect(overrides["color.orange-500"]).toBe("#6d5efc");
    expect(overrides["radius.card"]).toBe("1rem");
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = saasTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "Pricing" } },
        createElement("p", null, "Priced per seat, not per signal"),
      ),
    );

    expect(html).toContain("of-theme-saas-page");
    expect(html).toContain("Pricing");
    expect(html).toContain("Priced per seat, not per signal");
  });

  it("renders the post template with a formatted published date", () => {
    const PostTemplate = saasTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: {
          title: "The handoff is the product",
          publishedAt: "2026-05-14T00:00:00.000Z",
        },
      }),
    );

    expect(html).toContain("The handoff is the product");
    expect(html).toContain("2026");
  });

  it("renders the not-found template", () => {
    const NotFoundTemplate = saasTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("Page not found");
  });
});

describe("saas theme example site", () => {
  it("ships six pages with unique root-relative paths", () => {
    expect(exampleSite).toHaveLength(6);

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
          saasTheme.isBlockAllowedInRegion("page-body", node.blockId),
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

  it("renders real marketing copy on the home page", () => {
    const home = exampleSite.find((page) => page.path === "/");
    const html = renderToStaticMarkup(
      renderer.renderTree(parseContentTree(home.blocks)),
    );

    expect(html).toContain("Every customer handoff");
    expect(html).toContain("Klarion");
    expect(html).not.toMatch(/lorem ipsum/iu);
  });
});
