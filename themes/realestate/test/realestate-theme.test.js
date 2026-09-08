import { createRenderer, parseContentTree } from "@openforge/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  exampleSite,
  realestateTheme,
  realestateThemeBlockRegistry,
} from "../src/index.js";

const renderer = createRenderer({
  theme: realestateTheme,
  blockRegistry: realestateThemeBlockRegistry,
});

/** Every content tree the example site ships: the six pages plus the footer. */
const exampleTrees = [
  ...exampleSite.pages.map((page) => ({
    label: `page ${page.slug}`,
    nodes: page.blocks,
  })),
  { label: "footer", nodes: exampleSite.footer },
];

describe("realestate theme", () => {
  it("registers all three declared templates", () => {
    expect(() => realestateTheme.getTemplate("page")).not.toThrow();
    expect(() => realestateTheme.getTemplate("post")).not.toThrow();
    expect(() => realestateTheme.getTemplate("notFound")).not.toThrow();
  });

  it("resolves every block referenced by a region", () => {
    for (const region of realestateTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => realestateTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("declares an upscale navy-and-brass token identity", () => {
    const overrides = realestateTheme.manifest.defaultTokenOverrides;

    expect(overrides["color.ink"]).toBe("#12233f");
    expect(overrides["color.orange-500"]).toBe("#c9a24b");
    expect(overrides["color.action"]).toBe("#8a6a24");
    expect(overrides["radius.card"]).toBe("0.5rem");
    expect(overrides["font.body"]).toContain("serif");
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = realestateTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "Homes for sale" } },
        createElement("p", null, "Body content"),
      ),
    );

    expect(html).toContain("of-theme-realestate-page");
    expect(html).toContain("Homes for sale");
    expect(html).toContain("Body content");
  });

  it("renders the post template with a formatted published date", () => {
    const PostTemplate = realestateTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: {
          title: "Spring market report",
          publishedAt: "2026-08-28T00:00:00.000Z",
        },
      }),
    );

    expect(html).toContain("Spring market report");
    expect(html).toContain("2026");
  });

  it("renders the not-found template", () => {
    const NotFoundTemplate = realestateTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("Page not found");
  });
});

describe("realestate example site", () => {
  it("ships six pages and a footer, all bound to this theme", () => {
    expect(exampleSite.themeId).toBe("openforge-theme.realestate");
    expect(exampleSite.pages).toHaveLength(6);
    expect(exampleSite.footer.length).toBeGreaterThan(0);

    const slugs = exampleSite.pages.map((page) => page.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const page of exampleSite.pages) {
      expect(page.title).toBeTruthy();
      expect(page.blocks.length).toBeGreaterThan(0);
      expect(realestateTheme.manifest.templateNames).toContain(page.template);
    }
  });

  it.each(exampleTrees)("parses the content tree for $label", ({ nodes }) => {
    expect(() => parseContentTree(nodes)).not.toThrow();
  });

  it.each(exampleTrees)(
    "renders every top-level block of $label",
    ({ nodes }) => {
      for (const [index, node] of parseContentTree(nodes).entries()) {
        expect(() =>
          renderToStaticMarkup(renderer.renderNode(node, [index])),
        ).not.toThrow();
      }
    },
  );

  it("only uses blocks this theme actually registers", () => {
    const seen = new Set();
    const walk = (nodes) => {
      for (const node of nodes) {
        seen.add(node.blockId);
        for (const children of Object.values(node.slots ?? {})) walk(children);
      }
    };

    for (const { nodes } of exampleTrees) walk(parseContentTree(nodes));

    expect(seen.size).toBeGreaterThan(10);
    for (const blockId of seen) {
      expect(() => realestateTheme.getBlockComponent(blockId)).not.toThrow();
    }
  });

  it("renders real property copy, not placeholder text", () => {
    const home = exampleSite.pages.find((page) => page.slug === "/");
    const html = renderToStaticMarkup(renderer.renderTree(home.blocks));

    expect(html).toContain("Coastal homes, handled properly.");
    expect(html).toContain("The Ridge House at Kestrel Bluff");
    expect(html).toContain("Median time to an accepted offer");
    expect(html.toLowerCase()).not.toContain("lorem ipsum");
  });

  it("renders the property detail page with its specs and tour CTA", () => {
    const property = exampleSite.pages.find((page) =>
      page.slug.startsWith("/listings/"),
    );
    const html = renderToStaticMarkup(renderer.renderTree(property.blocks));

    expect(html).toContain("Square feet, measured");
    expect(html).toContain("Schedule a private tour");
    expect(html).toContain("Nadia Okonkwo");
  });
});
