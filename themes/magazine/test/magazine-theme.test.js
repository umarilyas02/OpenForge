import { createRenderer, parseContentTree } from "@openforge/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  exampleSite,
  magazineTheme,
  magazineThemeBlockRegistry,
} from "../src/index.js";

const renderer = createRenderer({
  theme: magazineTheme,
  blockRegistry: magazineThemeBlockRegistry,
});

const REGION_BY_TEMPLATE = {
  page: "page-body",
  post: "post-body",
};

function renderPage(page) {
  return page.blocks
    .map((node, index) =>
      renderToStaticMarkup(renderer.renderNode(node, [index])),
    )
    .join("");
}

describe("magazine theme", () => {
  it("registers all three declared templates", () => {
    expect(() => magazineTheme.getTemplate("page")).not.toThrow();
    expect(() => magazineTheme.getTemplate("post")).not.toThrow();
    expect(() => magazineTheme.getTemplate("notFound")).not.toThrow();
  });

  it("resolves every block referenced by a region", () => {
    for (const region of magazineTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => magazineTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("declares the editorial token identity", () => {
    const overrides = magazineTheme.manifest.defaultTokenOverrides;

    expect(magazineTheme.manifest.id).toBe("openforge-theme.magazine");
    expect(overrides["color.orange-500"]).toBe("#d6002a");
    expect(overrides["color.ink"]).toBe("#0b0b0c");
    expect(overrides["color.paper"]).toBe("#ffffff");
    expect(overrides["radius.card"]).toBe("0");
    expect(overrides["radius.control"]).toBe("0");
    expect(overrides["line-height.body"]).toBe("1.45");
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = magazineTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "About Us" } },
        createElement("p", null, "Body content"),
      ),
    );

    expect(html).toContain("About Us");
    expect(html).toContain("Body content");
    expect(html).toContain("of-theme-magazine-page");
  });

  it("renders the post template with a section kicker, byline, and date", () => {
    const PostTemplate = magazineTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: {
          title: "Launch Day",
          section: "Culture",
          author: "Marisol Trent",
          publishedAt: "2026-08-28T00:00:00.000Z",
        },
      }),
    );

    expect(html).toContain("Launch Day");
    expect(html).toContain("Culture");
    expect(html).toContain("By Marisol Trent");
    expect(html).toContain("2026");
    expect(html).toContain("<time");
  });

  it("renders the not-found template", () => {
    const NotFoundTemplate = magazineTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("Page not found");
  });
});

describe("magazine theme example site", () => {
  it("ships six pages with unique slugs and known templates", () => {
    expect(exampleSite.pages).toHaveLength(6);

    const slugs = exampleSite.pages.map((page) => page.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const page of exampleSite.pages) {
      expect(page.title.length).toBeGreaterThan(0);
      expect(magazineTheme.manifest.templateNames).toContain(page.template);
    }
  });

  it("parses every page's blocks as a valid content tree", () => {
    for (const page of exampleSite.pages) {
      expect(() => parseContentTree(page.blocks)).not.toThrow();
      expect(page.blocks.length).toBeGreaterThan(0);
    }
  });

  it("only uses blocks this theme allows in the matching region", () => {
    for (const page of exampleSite.pages) {
      const bodyRegion = REGION_BY_TEMPLATE[page.template];

      for (const node of page.blocks) {
        const allowed =
          magazineTheme.isBlockAllowedInRegion(bodyRegion, node.blockId) ||
          magazineTheme.isBlockAllowedInRegion("footer", node.blockId);

        expect(
          allowed,
          `${node.blockId} is not allowed in "${bodyRegion}" or "footer"`,
        ).toBe(true);
      }
    }
  });

  it("renders every top-level node of every page without throwing", () => {
    for (const page of exampleSite.pages) {
      page.blocks.forEach((node, index) => {
        expect(() =>
          renderToStaticMarkup(renderer.renderNode(node, [index])),
        ).not.toThrow();
      });
    }
  });

  it("renders real editorial copy on the home and article pages", () => {
    const home = exampleSite.pages.find((page) => page.slug === "/");
    const article = exampleSite.pages.find((page) => page.template === "post");

    expect(renderPage(home)).toContain("Slow reporting about fast machines.");
    expect(renderPage(article)).toContain("The storage unit is climate");
  });

  it("ends every page with the site footer", () => {
    for (const page of exampleSite.pages) {
      expect(page.blocks.at(-1).blockId).toBe("openforge-cms.footer");
    }
  });
});
