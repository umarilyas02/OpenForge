import { createRenderer, parseContentTree } from "@openforge/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  exampleSite,
  musicTheme,
  musicThemeBlockRegistry,
} from "../src/index.js";

const renderer = createRenderer({
  theme: musicTheme,
  blockRegistry: musicThemeBlockRegistry,
});

describe("music theme", () => {
  it("registers all three declared templates", () => {
    expect(() => musicTheme.getTemplate("page")).not.toThrow();
    expect(() => musicTheme.getTemplate("post")).not.toThrow();
    expect(() => musicTheme.getTemplate("notFound")).not.toThrow();
  });

  it("resolves every block referenced by a region", () => {
    for (const region of musicTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => musicTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("sets a dark neon purple-magenta palette using well-formed token names", () => {
    const overrides = musicTheme.manifest.defaultTokenOverrides;

    for (const [tokenName, value] of Object.entries(overrides)) {
      // Same shape design-tokens' own token-name schema enforces, so an
      // invented name can never be silently dropped by the style merge.
      expect(tokenName).toMatch(/^[a-z][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)+$/u);
      expect(typeof value).toBe("string");
      expect(value.trim().length).toBeGreaterThan(0);
    }

    expect(overrides["color.orange-500"]).toBe("#c026d3");
    expect(overrides["color.background"]).toBe("#0a0710");
    expect(overrides["radius.card"]).toBe("0.75rem");
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = musicTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "Tour Dates" } },
        createElement("p", null, "The Static Bloom Tour — 2027"),
      ),
    );

    expect(html).toContain("of-theme-music-page");
    expect(html).toContain("Tour Dates");
    expect(html).toContain("The Static Bloom Tour — 2027");
  });

  it("renders the post template with a formatted published date", () => {
    const PostTemplate = musicTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: {
          title: "Static Bloom is out now",
          publishedAt: "2026-05-14T00:00:00.000Z",
        },
      }),
    );

    expect(html).toContain("Static Bloom is out now");
    expect(html).toContain("2026");
  });

  it("renders the not-found template", () => {
    const NotFoundTemplate = musicTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("This track skipped");
  });
});

describe("music theme example site", () => {
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
          musicTheme.isBlockAllowedInRegion("page-body", node.blockId),
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

  it("renders real band copy on the home page", () => {
    const home = exampleSite.find((page) => page.path === "/");
    const html = renderToStaticMarkup(
      renderer.renderTree(parseContentTree(home.blocks)),
    );

    expect(html).toContain("Neon Requiem");
    expect(html).toContain("Static Bloom");
    expect(html).not.toMatch(/lorem ipsum/iu);
  });
});
