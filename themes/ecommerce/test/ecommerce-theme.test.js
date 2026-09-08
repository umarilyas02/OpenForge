import { createRenderer, parseContentTree } from "@openforge/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { exampleSite } from "../src/example-site.js";
import { ecommerceTheme, ecommerceThemeBlockRegistry } from "../src/index.js";

const renderer = createRenderer({
  theme: ecommerceTheme,
  blockRegistry: ecommerceThemeBlockRegistry,
});

describe("ecommerce theme", () => {
  it("registers all three declared templates", () => {
    expect(() => ecommerceTheme.getTemplate("page")).not.toThrow();
    expect(() => ecommerceTheme.getTemplate("post")).not.toThrow();
    expect(() => ecommerceTheme.getTemplate("notFound")).not.toThrow();
  });

  it("resolves every block referenced by a region", () => {
    for (const region of ecommerceTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => ecommerceTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("declares the regions a storefront needs", () => {
    const keys = ecommerceTheme.manifest.regions.map((region) => region.key);

    expect(keys).toContain("page-body");
    expect(keys).toContain("post-body");
    expect(keys).toContain("footer");
    expect(
      ecommerceTheme.isBlockAllowedInRegion("page-body", "openforge-cms.card"),
    ).toBe(true);
    expect(
      ecommerceTheme.isBlockAllowedInRegion(
        "page-body",
        "openforge-cms.rating",
      ),
    ).toBe(true);
  });

  it("overrides the tokens that carry the retail identity", () => {
    const overrides = ecommerceTheme.manifest.defaultTokenOverrides;

    expect(overrides["color.orange-500"]).toBe("#e8552f");
    expect(overrides["color.action"]).toBe("#c8431f");
    expect(overrides["radius.card"]).toBe("0.75rem");
    expect(overrides["font.body"]).toContain("Inter");
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = ecommerceTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "Shop cast iron" } },
        createElement("p", null, "Body content"),
      ),
    );

    expect(html).toContain("of-theme-ecommerce-page");
    expect(html).toContain("Shop cast iron");
    expect(html).toContain("Body content");
  });

  it("renders the post template with a formatted published date", () => {
    const PostTemplate = ecommerceTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: {
          title: "How we mill a cooking face",
          publishedAt: "2026-08-28T00:00:00.000Z",
        },
      }),
    );

    expect(html).toContain("How we mill a cooking face");
    expect(html).toContain("2026");
  });

  it("renders the not-found template", () => {
    const NotFoundTemplate = ecommerceTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("Page not found");
    expect(html).toContain("/shop");
  });
});

describe("ecommerce theme example site", () => {
  it("ships six pages with unique slugs", () => {
    expect(exampleSite.pages).toHaveLength(6);

    const slugs = exampleSite.pages.map((page) => page.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const page of exampleSite.pages) {
      expect(page.title.length).toBeGreaterThan(0);
      expect(page.blocks.length).toBeGreaterThan(0);
    }
  });

  it("parses every page as a valid content tree", () => {
    for (const page of exampleSite.pages) {
      expect(() => parseContentTree(page.blocks), page.slug).not.toThrow();
    }

    expect(() => parseContentTree(exampleSite.footer)).not.toThrow();
  });

  it("only uses page-body blocks at the top level of every page", () => {
    for (const page of exampleSite.pages) {
      for (const node of page.blocks) {
        expect(
          ecommerceTheme.isBlockAllowedInRegion("page-body", node.blockId),
          `${page.slug} uses ${node.blockId}`,
        ).toBe(true);
      }
    }

    for (const node of exampleSite.footer) {
      expect(
        ecommerceTheme.isBlockAllowedInRegion("footer", node.blockId),
      ).toBe(true);
    }
  });

  it("renders every block of every page without throwing", () => {
    for (const page of exampleSite.pages) {
      const nodes = parseContentTree(page.blocks);

      nodes.forEach((node, index) => {
        expect(
          () => renderToStaticMarkup(renderer.renderNode(node, [index])),
          `${page.slug} block ${index} (${node.blockId})`,
        ).not.toThrow();
      });
    }
  });

  it("renders the footer content tree", () => {
    const html = renderToStaticMarkup(
      renderer.renderTree(parseContentTree(exampleSite.footer)),
    );

    expect(html).toContain("Hearthline");
    expect(html).toContain("Shipping and returns");
  });

  it("renders real storefront copy on the home page", () => {
    const [home] = exampleSite.pages;
    const html = renderToStaticMarkup(
      renderer.renderTree(parseContentTree(home.blocks)),
    );

    expect(html).toContain("Pans you will hand down.");
    expect(html).toContain("The No. 8 Everyday Skillet");
    expect(html).toContain("Free shipping over $75");
  });

  it("builds product tiles from card, rating, and badge blocks", () => {
    const shop = exampleSite.pages.find((page) => page.slug === "/shop");
    const grid = shop.blocks.find(
      (node) => node.props.heading === "Skillets and griddles",
    );
    const tile = grid.slots.items[0];
    const tileBlockIds = tile.slots.items.map((node) => node.blockId);

    expect(grid.blockId).toBe("openforge-cms.columns");
    expect(tile.blockId).toBe("openforge-cms.columns");
    expect(tileBlockIds).toEqual([
      "openforge-cms.card",
      "openforge-cms.rating",
      "openforge-cms.badge",
    ]);
  });
});
