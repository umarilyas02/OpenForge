import { createRenderer, parseContentTree } from "@openforge/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  exampleSite,
  fitnessTheme,
  fitnessThemeBlockRegistry,
} from "../src/index.js";

const renderer = createRenderer({
  theme: fitnessTheme,
  blockRegistry: fitnessThemeBlockRegistry,
});

describe("fitness theme", () => {
  it("registers all three declared templates", () => {
    expect(() => fitnessTheme.getTemplate("page")).not.toThrow();
    expect(() => fitnessTheme.getTemplate("post")).not.toThrow();
    expect(() => fitnessTheme.getTemplate("notFound")).not.toThrow();
  });

  it("resolves every block referenced by a region", () => {
    for (const region of fitnessTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => fitnessTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("sets a charcoal-and-crimson brand palette using well-formed token names", () => {
    const overrides = fitnessTheme.manifest.defaultTokenOverrides;

    for (const [tokenName, value] of Object.entries(overrides)) {
      // Same shape design-tokens' own token-name schema enforces, so an
      // invented name can never be silently dropped by the style merge.
      expect(tokenName).toMatch(/^[a-z][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)+$/u);
      expect(typeof value).toBe("string");
      expect(value.trim().length).toBeGreaterThan(0);
    }

    expect(overrides["color.orange-500"]).toBe("#ff2140");
    expect(overrides["color.background"]).toBe("#0e0d0f");
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = fitnessTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "Membership" } },
        createElement("p", null, "Priced for people who actually show up"),
      ),
    );

    expect(html).toContain("of-theme-fitness-page");
    expect(html).toContain("Membership");
    expect(html).toContain("Priced for people who actually show up");
  });

  it("renders the post template with a formatted published date", () => {
    const PostTemplate = fitnessTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: {
          title: "How to warm up before a heavy squat day",
          publishedAt: "2026-05-14T00:00:00.000Z",
        },
      }),
    );

    expect(html).toContain("How to warm up before a heavy squat day");
    expect(html).toContain("2026");
  });

  it("renders the not-found template", () => {
    const NotFoundTemplate = fitnessTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("Page not found");
  });
});

describe("fitness theme example site", () => {
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
          fitnessTheme.isBlockAllowedInRegion("page-body", node.blockId),
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

  it("renders real gym copy on the home page", () => {
    const home = exampleSite.find((page) => page.path === "/");
    const html = renderToStaticMarkup(
      renderer.renderTree(parseContentTree(home.blocks)),
    );

    expect(html).toContain("Train like the work actually matters");
    expect(html).toContain("Ironclad");
    expect(html).not.toMatch(/lorem ipsum/iu);
  });
});
