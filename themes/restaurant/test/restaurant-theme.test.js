import { createRenderer, parseContentTree } from "@openforge/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { exampleSite } from "../src/example-site.js";
import { restaurantTheme, restaurantThemeBlockRegistry } from "../src/index.js";

const renderer = createRenderer({
  theme: restaurantTheme,
  blockRegistry: restaurantThemeBlockRegistry,
});

/** Every block id in a tree, including the ones nested inside slots. */
function collectBlockIds(nodes, into = []) {
  for (const node of nodes) {
    into.push(node.blockId);
    for (const children of Object.values(node.slots ?? {})) {
      collectBlockIds(children, into);
    }
  }
  return into;
}

describe("restaurant theme", () => {
  it("registers all three declared templates", () => {
    expect(() => restaurantTheme.getTemplate("page")).not.toThrow();
    expect(() => restaurantTheme.getTemplate("post")).not.toThrow();
    expect(() => restaurantTheme.getTemplate("notFound")).not.toThrow();
  });

  it("resolves every block referenced by a region", () => {
    for (const region of restaurantTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => restaurantTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("declares a warm hearth identity through token overrides", () => {
    const overrides = restaurantTheme.manifest.defaultTokenOverrides;

    expect(overrides["color.orange-500"]).toBe("#8a3324");
    expect(overrides["color.background"]).toBe("#faf3ea");
    expect(overrides["radius.card"]).toBe("1.75rem");
    expect(overrides["font.body"]).toContain("serif");
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = restaurantTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "The autumn hearth menu", eyebrow: "Since 2019" } },
        createElement("p", null, "Ember-cooked celeriac"),
      ),
    );

    expect(html).toContain("The autumn hearth menu");
    expect(html).toContain("Since 2019");
    expect(html).toContain("Ember-cooked celeriac");
    expect(html).toContain("of-theme-restaurant-page");
  });

  it("renders the post template with a formatted published date", () => {
    const PostTemplate = restaurantTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: {
          title: "Why we relined the chimney",
          publishedAt: "2026-08-28T00:00:00.000Z",
        },
      }),
    );

    expect(html).toContain("Why we relined the chimney");
    expect(html).toContain("2026");
  });

  it("renders the not-found template", () => {
    const NotFoundTemplate = restaurantTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("on the menu");
    expect(html).toContain("/reservations");
  });
});

describe("restaurant theme example site", () => {
  it("ships six pages targeting this theme", () => {
    expect(exampleSite.themeId).toBe(restaurantTheme.manifest.id);
    expect(exampleSite.pages).toHaveLength(6);
    expect(exampleSite.pages.map((page) => page.slug)).toEqual([
      "/",
      "/menu",
      "/gallery",
      "/our-story",
      "/reservations",
      "/private-events",
    ]);
  });

  it.each(exampleSite.pages.map((page) => [page.slug, page]))(
    "parses %s as a valid content tree",
    (_slug, page) => {
      expect(() => parseContentTree(page.blocks)).not.toThrow();
      expect(parseContentTree(page.blocks).length).toBeGreaterThan(0);
    },
  );

  it.each(exampleSite.pages.map((page) => [page.slug, page]))(
    "renders every top-level block on %s",
    (_slug, page) => {
      const nodes = parseContentTree(page.blocks);

      nodes.forEach((node, index) => {
        expect(() =>
          renderToStaticMarkup(renderer.renderNode(node, [index])),
        ).not.toThrow();
      });
    },
  );

  it.each(exampleSite.pages.map((page) => [page.slug, page]))(
    "only uses blocks the page-body region allows on %s",
    (_slug, page) => {
      const allowed = restaurantTheme.getRegion("page-body").allowedBlockIds;

      for (const blockId of collectBlockIds(parseContentTree(page.blocks))) {
        expect(allowed).toContain(blockId);
      }
    },
  );

  it("parses and renders the site footer", () => {
    const nodes = parseContentTree(exampleSite.footer);
    const allowed = restaurantTheme.getRegion("footer").allowedBlockIds;

    for (const blockId of collectBlockIds(nodes)) {
      expect(allowed).toContain(blockId);
    }

    const html = renderToStaticMarkup(renderer.renderNode(nodes[0], [0]));
    expect(html).toContain("Millrace Lane");
    expect(html).toContain("Reservations");
  });

  it("renders real restaurant copy, not placeholder text", () => {
    const html = exampleSite.pages
      .map((page) =>
        parseContentTree(page.blocks)
          .map((node, index) =>
            renderToStaticMarkup(renderer.renderNode(node, [index])),
          )
          .join(""),
      )
      .join("");

    expect(html).toContain("Ember-cooked celeriac");
    expect(html).toContain("Whole hearth-roasted duck");
    expect(html).toContain("Millrace Lane");
    expect(html).not.toMatch(/lorem ipsum/iu);
    expect(html).not.toContain("Click to edit this text");
  });
});
