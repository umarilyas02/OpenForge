import { createRenderer, parseContentTree } from "@openforge/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  agencyTheme,
  agencyThemeBlockRegistry,
  exampleSite,
} from "../src/index.js";

/**
 * Mirrors the token `name`s declared in
 * `packages/design-tokens/src/default-tokens.js`. `renderSiteStyles`
 * silently ignores unknown override keys, so a typo in the manifest would
 * otherwise produce a theme that just quietly looks like the default one.
 */
const KNOWN_TOKEN_NAMES = new Set([
  "color.ink",
  "color.paper",
  "color.orange-500",
  "color.action",
  "color.background",
  "space.2",
  "space.4",
  "space.8",
  "space.16",
  "space.section",
  "radius.control",
  "radius.card",
  "font.body",
  "font.size-body",
  "font.weight-strong",
  "line-height.body",
  "shadow.card",
]);

const renderer = createRenderer({
  theme: agencyTheme,
  blockRegistry: agencyThemeBlockRegistry,
});

const exampleDocuments = [
  ...exampleSite.pages,
  ...exampleSite.posts,
  { ...exampleSite.footer, title: "Footer", slug: "footer" },
];

describe("agency theme", () => {
  it("registers all three declared templates", () => {
    expect(() => agencyTheme.getTemplate("page")).not.toThrow();
    expect(() => agencyTheme.getTemplate("post")).not.toThrow();
    expect(() => agencyTheme.getTemplate("notFound")).not.toThrow();
  });

  it("uses the agency theme id", () => {
    expect(agencyTheme.manifest.id).toBe("openforge-theme.agency");
  });

  it("resolves every block referenced by a region", () => {
    for (const region of agencyTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => agencyTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("declares the regions the templates render into", () => {
    const keys = agencyTheme.manifest.regions.map((region) => region.key);
    expect(keys).toContain("page-body");
    expect(keys).toContain("post-body");
    expect(keys).toContain("footer");
  });

  it("overrides only real design tokens", () => {
    const overrides = agencyTheme.manifest.defaultTokenOverrides;
    expect(Object.keys(overrides).length).toBeGreaterThan(0);
    for (const [name, value] of Object.entries(overrides)) {
      expect(KNOWN_TOKEN_NAMES.has(name), `unknown token "${name}"`).toBe(true);
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
    }
  });

  it("commits to the theme's sharp-cornered, high-contrast identity", () => {
    const overrides = agencyTheme.manifest.defaultTokenOverrides;
    expect(overrides["radius.card"]).toBe("0");
    expect(overrides["radius.control"]).toBe("0");
    expect(overrides["color.ink"]).toMatch(/^#[\da-f]{6}$/iu);
    expect(overrides["color.orange-500"]).toMatch(/^#[\da-f]{6}$/iu);
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = agencyTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "Studio" } },
        createElement("p", null, "Twelve people in a converted machine shop."),
      ),
    );

    expect(html).toContain("of-theme-agency-page");
    expect(html).toContain("Studio");
    expect(html).toContain("Twelve people in a converted machine shop.");
  });

  it("renders the post template with a formatted published date", () => {
    const PostTemplate = agencyTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: {
          title: "Kestrel Freight",
          publishedAt: "2026-03-17T00:00:00.000Z",
        },
      }),
    );

    expect(html).toContain("of-theme-agency-post");
    expect(html).toContain("Kestrel Freight");
    expect(html).toContain("2026");
  });

  it("renders the not-found template", () => {
    const NotFoundTemplate = agencyTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("of-theme-agency-not-found");
    expect(html).toContain("Page not found");
  });
});

describe("agency theme example site", () => {
  it("ships six pages, a case-study post, and a footer", () => {
    expect(exampleSite.themeId).toBe("openforge-theme.agency");
    expect(exampleSite.pages).toHaveLength(6);
    expect(exampleSite.posts).toHaveLength(1);
    expect(exampleSite.footer.blocks.length).toBeGreaterThan(0);

    const slugs = exampleSite.pages.map((page) => page.slug);
    expect(slugs).toEqual([
      "/",
      "/work",
      "/services",
      "/process",
      "/studio",
      "/contact",
    ]);
  });

  it.each(exampleDocuments.map((doc) => [doc.slug, doc]))(
    "parses %s as a valid content tree",
    (_slug, doc) => {
      expect(() => parseContentTree(doc.blocks)).not.toThrow();
      expect(doc.blocks.length).toBeGreaterThan(0);
    },
  );

  it.each(exampleDocuments.map((doc) => [doc.slug, doc]))(
    "only places region-approved blocks at the top level of %s",
    (_slug, doc) => {
      for (const node of doc.blocks) {
        expect(
          agencyTheme.isBlockAllowedInRegion(doc.region, node.blockId),
          `${node.blockId} is not allowed in region "${doc.region}"`,
        ).toBe(true);
      }
    },
  );

  it.each(exampleDocuments.map((doc) => [doc.slug, doc]))(
    "renders every block of %s to static markup",
    (_slug, doc) => {
      for (const [index, node] of doc.blocks.entries()) {
        expect(() =>
          renderToStaticMarkup(renderer.renderNode(node, [index])),
        ).not.toThrow();
      }
    },
  );

  it("renders the home page with the studio's real copy, not placeholders", () => {
    const home = exampleSite.pages[0];
    const html = renderDocument(home);

    expect(html).toContain("Brands that hold up under pressure.");
    expect(html).toContain("Kestrel Freight");
    expect(html).toContain("Rivetwork");
    expect(html).not.toMatch(/lorem ipsum/iu);
    expect(html).not.toMatch(/click to edit/iu);
  });

  it("renders the case-study post through the post-body region", () => {
    const [post] = exampleSite.posts;
    const html = renderDocument(post);

    expect(post.publishedAt).toBe("2026-03-17T00:00:00.000Z");
    expect(html).toContain("From regional carrier to logistics platform");
    expect(html).toContain("Qualified enterprise inbound");
  });

  it("keeps every image and avatar in the example site alt-labelled", () => {
    for (const doc of exampleDocuments) {
      for (const node of doc.blocks) {
        if (node.blockId === "openforge-cms.image") {
          expect(node.props.alt.length).toBeGreaterThan(0);
        }
        for (const children of Object.values(node.slots ?? {})) {
          for (const child of children) {
            if (
              child.blockId === "openforge-cms.logo-item" ||
              child.blockId === "openforge-cms.avatar-item"
            ) {
              expect(child.props.name.length).toBeGreaterThan(0);
            }
          }
        }
      }
    }
  });
});

/**
 * @param {{ blocks: object[] }} doc
 */
function renderDocument(doc) {
  return doc.blocks
    .map((node, index) =>
      renderToStaticMarkup(renderer.renderNode(node, [index])),
    )
    .join("");
}
