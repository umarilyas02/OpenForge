import { createRenderer, parseContentTree } from "@openforge/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  exampleSite,
  nonprofitTheme,
  nonprofitThemeBlockRegistry,
} from "../src/index.js";

const renderer = createRenderer({
  theme: nonprofitTheme,
  blockRegistry: nonprofitThemeBlockRegistry,
});

/** Render one top-level content node exactly the way a real page would. */
function renderTopLevelNode(node, index) {
  return renderToStaticMarkup(renderer.renderNode(node, [index]));
}

const exampleDocuments = [
  ...exampleSite.pages.map((page) => ({ ...page, region: "page-body" })),
  ...exampleSite.posts.map((post) => ({ ...post, region: "post-body" })),
];

describe("nonprofit theme", () => {
  it("registers all three declared templates", () => {
    expect(() => nonprofitTheme.getTemplate("page")).not.toThrow();
    expect(() => nonprofitTheme.getTemplate("post")).not.toThrow();
    expect(() => nonprofitTheme.getTemplate("notFound")).not.toThrow();
  });

  it("resolves every block referenced by a region", () => {
    for (const region of nonprofitTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => nonprofitTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("declares a nonprofit identity through token overrides", () => {
    const overrides = nonprofitTheme.manifest.defaultTokenOverrides;

    expect(overrides["color.action"]).toBe("#2f7a4a");
    expect(overrides["color.orange-500"]).toBe("#f2a71b");
    expect(overrides["radius.card"]).toBe("1rem");
    for (const value of Object.values(overrides)) {
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
    }
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = nonprofitTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "Our mission", summary: "Why we exist." } },
        createElement("p", null, "Body content"),
      ),
    );

    expect(html).toContain("of-theme-nonprofit-page");
    expect(html).toContain("Our mission");
    expect(html).toContain("Why we exist.");
    expect(html).toContain("Body content");
  });

  it("renders the post template with a formatted published date", () => {
    const PostTemplate = nonprofitTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: {
          title: "Field notes from the Bell Creek plots",
          publishedAt: "2026-08-14T00:00:00.000Z",
          author: "Marcus Delgado",
        },
      }),
    );

    expect(html).toContain("of-theme-nonprofit-post");
    expect(html).toContain("Field notes from the Bell Creek plots");
    expect(html).toContain("Marcus Delgado");
    expect(html).toContain("2026");
  });

  it("renders the not-found template with a way back into the site", () => {
    const NotFoundTemplate = nonprofitTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("Page not found");
    expect(html).toContain("/get-involved");
  });
});

describe("nonprofit theme example site", () => {
  it("ships six pages and at least one post", () => {
    expect(exampleSite.pages).toHaveLength(6);
    expect(exampleSite.posts.length).toBeGreaterThanOrEqual(1);

    const slugs = exampleDocuments.map((document) => document.slug);
    expect(new Set(slugs).size).toBe(slugs.length);

    for (const document of exampleDocuments) {
      expect(document.title.length).toBeGreaterThan(0);
      expect(document.blocks.length).toBeGreaterThan(0);
    }
  });

  it.each(exampleDocuments.map((document) => [document.slug, document]))(
    "parses %s as a valid content tree",
    (_slug, document) => {
      expect(() => parseContentTree(document.blocks)).not.toThrow();
    },
  );

  it.each(exampleDocuments.map((document) => [document.slug, document]))(
    "renders every top-level block of %s",
    (_slug, document) => {
      document.blocks.forEach((node, index) => {
        expect(() => renderTopLevelNode(node, index)).not.toThrow();
      });
    },
  );

  it("only uses blocks its own region actually allows", () => {
    for (const document of exampleDocuments) {
      for (const node of document.blocks) {
        const allowed = nonprofitTheme.isBlockAllowedInRegion(
          document.region,
          node.blockId,
        );
        expect(allowed).toBe(true);
      }
    }
  });

  it("parses and renders the footer content tree", () => {
    expect(() => parseContentTree(exampleSite.footer)).not.toThrow();

    exampleSite.footer.forEach((node, index) => {
      const allowed = nonprofitTheme.isBlockAllowedInRegion(
        "footer",
        node.blockId,
      );
      expect(allowed).toBe(true);
      expect(() => renderTopLevelNode(node, index)).not.toThrow();
    });
  });

  it("renders real nonprofit copy, not placeholder text", () => {
    const html = exampleSite.pages[0].blocks
      .map((node, index) => renderTopLevelNode(node, index))
      .join("");

    expect(html).toContain("Harvest Row");
    expect(html).toContain("Produce shares packed");
    expect(html).toContain("Give monthly");
    expect(html.toLowerCase()).not.toContain("lorem ipsum");
  });
});
