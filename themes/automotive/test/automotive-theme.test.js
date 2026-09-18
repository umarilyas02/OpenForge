import { createRenderer, parseContentTree } from "@openforge/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  automotiveTheme,
  automotiveThemeBlockRegistry,
  exampleSite,
} from "../src/index.js";

const renderer = createRenderer({
  theme: automotiveTheme,
  blockRegistry: automotiveThemeBlockRegistry,
});

describe("automotive theme", () => {
  it("registers all three declared templates", () => {
    expect(() => automotiveTheme.getTemplate("page")).not.toThrow();
    expect(() => automotiveTheme.getTemplate("post")).not.toThrow();
    expect(() => automotiveTheme.getTemplate("notFound")).not.toThrow();
  });

  it("resolves every block referenced by a region", () => {
    for (const region of automotiveTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => automotiveTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("sets a deep-red-on-graphite brand palette using well-formed token names", () => {
    const overrides = automotiveTheme.manifest.defaultTokenOverrides;

    for (const [tokenName, value] of Object.entries(overrides)) {
      // Same shape design-tokens' own token-name schema enforces, so an
      // invented name can never be silently dropped by the style merge.
      expect(tokenName).toMatch(/^[a-z][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)+$/u);
      expect(typeof value).toBe("string");
      expect(value.trim().length).toBeGreaterThan(0);
    }

    expect(overrides["color.orange-500"]).toBe("#b3141f");
    expect(overrides["radius.card"]).toBe("0.25rem");
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = automotiveTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "Inventory" } },
        createElement("p", null, "Flat-rate labor, quoted before we touch a bolt"),
      ),
    );

    expect(html).toContain("of-theme-automotive-page");
    expect(html).toContain("Inventory");
    expect(html).toContain("Flat-rate labor, quoted before we touch a bolt");
  });

  it("renders the post template with a formatted published date", () => {
    const PostTemplate = automotiveTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: {
          title: "Why we print the inspection report",
          publishedAt: "2026-05-14T00:00:00.000Z",
        },
      }),
    );

    expect(html).toContain("Why we print the inspection report");
    expect(html).toContain("2026");
  });

  it("renders the not-found template", () => {
    const NotFoundTemplate = automotiveTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("Wrong turn");
  });
});

describe("automotive theme example site", () => {
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
          automotiveTheme.isBlockAllowedInRegion("page-body", node.blockId),
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

  it("renders real dealership copy on the home page", () => {
    const home = exampleSite.find((page) => page.path === "/");
    const html = renderToStaticMarkup(
      renderer.renderTree(parseContentTree(home.blocks)),
    );

    expect(html).toContain("Straight answers");
    expect(html).toContain("Redline Auto Group");
    expect(html).not.toMatch(/lorem ipsum/iu);
  });

  it("gives the inventory page a vehicle data table and a service feature list", () => {
    const inventoryPage = exampleSite.find((page) => page.path === "/inventory");
    const blockIds = inventoryPage.blocks.map((node) => node.blockId);

    expect(blockIds).toContain("openforge-cms.data-table");
    expect(blockIds).toContain("openforge-cms.feature-list");
  });
});
