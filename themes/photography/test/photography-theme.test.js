import { createRenderer, parseContentTree } from "@openforge/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  photographyTheme,
  photographyThemeBlockRegistry,
  exampleSite,
} from "../src/index.js";
import { exampleFooter } from "../src/example-site.js";

const renderer = createRenderer({
  theme: photographyTheme,
  blockRegistry: photographyThemeBlockRegistry,
});

describe("photography theme", () => {
  it("registers all three declared templates", () => {
    expect(() => photographyTheme.getTemplate("page")).not.toThrow();
    expect(() => photographyTheme.getTemplate("post")).not.toThrow();
    expect(() => photographyTheme.getTemplate("notFound")).not.toThrow();
  });

  it("resolves every block referenced by a region", () => {
    for (const region of photographyTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => photographyTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("sets a near-black, image-forward palette using well-formed token names", () => {
    const overrides = photographyTheme.manifest.defaultTokenOverrides;

    for (const [tokenName, value] of Object.entries(overrides)) {
      // Same shape design-tokens' own token-name schema enforces, so an
      // invented name can never be silently dropped by the style merge.
      expect(tokenName).toMatch(/^[a-z][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)+$/u);
      expect(typeof value).toBe("string");
      expect(value.trim().length).toBeGreaterThan(0);
    }

    expect(overrides["color.paper"]).toBe("#101010");
    expect(overrides["color.background"]).toBe("#050505");
    expect(overrides["radius.card"]).toBe("0");
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = photographyTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "Services & Pricing" } },
        createElement("p", null, "Three ways to book the studio"),
      ),
    );

    expect(html).toContain("of-theme-photography-page");
    expect(html).toContain("Services &amp; Pricing");
    expect(html).toContain("Three ways to book the studio");
  });

  it("renders the post template with a formatted published date", () => {
    const PostTemplate = photographyTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: {
          title: "Behind the Bornholm elopement",
          publishedAt: "2026-05-14T00:00:00.000Z",
        },
      }),
    );

    expect(html).toContain("Behind the Bornholm elopement");
    expect(html).toContain("2026");
  });

  it("renders the not-found template", () => {
    const NotFoundTemplate = photographyTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("Page not found");
  });
});

describe("photography theme example site", () => {
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
          photographyTheme.isBlockAllowedInRegion("page-body", node.blockId),
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

  it("renders real studio copy on the home page", () => {
    const home = exampleSite.find((page) => page.path === "/");
    const html = renderToStaticMarkup(
      renderer.renderTree(parseContentTree(home.blocks)),
    );

    expect(html).toContain("Portraits that hold still");
    expect(html).toContain("Halden Studio");
    expect(html).not.toMatch(/lorem ipsum/iu);
  });

  it("uses the image-gallery and carousel blocks on the portfolio page", () => {
    const portfolio = exampleSite.find((page) => page.path === "/portfolio");
    const blockIds = portfolio.blocks.map((node) => node.blockId);

    expect(blockIds).toContain("openforge-cms.image-gallery");
    expect(blockIds).toContain("openforge-cms.carousel");
  });
});

describe("photography theme footer", () => {
  it("only uses blocks the footer region allows", () => {
    for (const node of exampleFooter) {
      expect(
        photographyTheme.isBlockAllowedInRegion("footer", node.blockId),
      ).toBe(true);
    }
  });

  it("parses and renders without throwing", () => {
    expect(() => parseContentTree(exampleFooter)).not.toThrow();

    const nodes = parseContentTree(exampleFooter);
    nodes.forEach((node, index) => {
      expect(() =>
        renderToStaticMarkup(renderer.renderNode(node, [index])),
      ).not.toThrow();
    });
  });
});
