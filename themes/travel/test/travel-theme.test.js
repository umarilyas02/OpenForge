import { createRenderer, parseContentTree } from "@openforge/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  exampleSite,
  travelTheme,
  travelThemeBlockRegistry,
} from "../src/index.js";

const renderer = createRenderer({
  theme: travelTheme,
  blockRegistry: travelThemeBlockRegistry,
});

describe("travel theme", () => {
  it("registers all three declared templates", () => {
    expect(() => travelTheme.getTemplate("page")).not.toThrow();
    expect(() => travelTheme.getTemplate("post")).not.toThrow();
    expect(() => travelTheme.getTemplate("notFound")).not.toThrow();
  });

  it("resolves every block referenced by a region", () => {
    for (const region of travelTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => travelTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("sets a sunset-coral brand palette using well-formed token names", () => {
    const overrides = travelTheme.manifest.defaultTokenOverrides;

    for (const [tokenName, value] of Object.entries(overrides)) {
      // Same shape design-tokens' own token-name schema enforces, so an
      // invented name can never be silently dropped by the style merge.
      expect(tokenName).toMatch(/^[a-z][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)+$/u);
      expect(typeof value).toBe("string");
      expect(value.trim().length).toBeGreaterThan(0);
    }

    expect(overrides["color.orange-500"]).toBe("#ff6b45");
    expect(overrides["radius.card"]).toBe("1.5rem");
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = travelTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "Packages & Pricing" } },
        createElement("p", null, "Three ways to travel with us"),
      ),
    );

    expect(html).toContain("of-theme-travel-page");
    expect(html).toContain("Packages & Pricing");
    expect(html).toContain("Three ways to travel with us");
  });

  it("renders the post template with a formatted published date", () => {
    const PostTemplate = travelTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: {
          title: "Six places our travelers keep coming back to",
          publishedAt: "2026-05-14T00:00:00.000Z",
        },
      }),
    );

    expect(html).toContain("Six places our travelers keep coming back to");
    expect(html).toContain("2026");
  });

  it("renders the not-found template", () => {
    const NotFoundTemplate = travelTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("This trail goes cold here");
  });
});

describe("travel theme example site", () => {
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
          travelTheme.isBlockAllowedInRegion("page-body", node.blockId),
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

    expect(html).toContain("Go further than you planned to");
    expect(html).toContain("Sundrift");
    expect(html).not.toMatch(/lorem ipsum/iu);
  });

  it("renders the destinations page's gallery and carousel blocks", () => {
    const destinationsPage = exampleSite.find(
      (page) => page.path === "/destinations",
    );
    const blockIds = destinationsPage.blocks.map((node) => node.blockId);

    expect(blockIds).toContain("openforge-cms.image-gallery");
    expect(blockIds).toContain("openforge-cms.carousel");

    const html = renderToStaticMarkup(
      renderer.renderTree(parseContentTree(destinationsPage.blocks)),
    );

    expect(html).toContain("Santorini, Greece");
  });
});
