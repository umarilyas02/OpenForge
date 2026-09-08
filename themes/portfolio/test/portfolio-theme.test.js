import { createRenderer, parseContentTree } from "@openforge/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { exampleFooter, exampleSite } from "../src/example-site.js";
import { portfolioTheme, portfolioThemeBlockRegistry } from "../src/index.js";

const renderer = createRenderer({
  theme: portfolioTheme,
  blockRegistry: portfolioThemeBlockRegistry,
});

/** Render every top-level node of a content tree, exactly as a page would. */
function renderTopLevelNodes(nodes) {
  return nodes
    .map((node, index) =>
      renderToStaticMarkup(renderer.renderNode(node, [index])),
    )
    .join("");
}

function regionFor(key) {
  return portfolioTheme.manifest.regions.find((region) => region.key === key);
}

describe("portfolio theme", () => {
  it("registers all three declared templates", () => {
    expect(() => portfolioTheme.getTemplate("page")).not.toThrow();
    expect(() => portfolioTheme.getTemplate("post")).not.toThrow();
    expect(() => portfolioTheme.getTemplate("notFound")).not.toThrow();
  });

  it("resolves every block referenced by a region", () => {
    for (const region of portfolioTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => portfolioTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = portfolioTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "Selected Work" } },
        createElement("p", null, "Body content"),
      ),
    );

    expect(html).toContain("of-theme-portfolio-page");
    expect(html).toContain("Selected Work");
    expect(html).toContain("Body content");
  });

  it("renders the post template with a formatted published date", () => {
    const PostTemplate = portfolioTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: {
          title: "The logo is the last thing",
          publishedAt: "2026-04-17T09:00:00.000Z",
        },
      }),
    );

    expect(html).toContain("of-theme-portfolio-post");
    expect(html).toContain("The logo is the last thing");
    expect(html).toContain("2026");
  });

  it("renders the not-found template", () => {
    const NotFoundTemplate = portfolioTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("Page not found");
    expect(html).toContain("Back to selected work");
  });

  it("declares a stark editorial token identity", () => {
    const overrides = portfolioTheme.manifest.defaultTokenOverrides;

    expect(overrides["color.ink"]).toBe("#0b0b0c");
    expect(overrides["color.paper"]).toBe("#f4f2ed");
    expect(overrides["color.action"]).toBe("#d7ff3c");
    // Sharp corners are the whole point: nothing above a hairline radius.
    expect(Number.parseFloat(overrides["radius.card"])).toBeLessThanOrEqual(
      0.25,
    );
    expect(Number.parseFloat(overrides["radius.control"])).toBe(0);
  });
});

describe("portfolio theme example site", () => {
  const contentItems = [...exampleSite.pages, ...exampleSite.posts];

  it("ships six pages and at least one post", () => {
    expect(exampleSite.pages).toHaveLength(6);
    expect(exampleSite.posts.length).toBeGreaterThanOrEqual(1);
  });

  it("targets this theme", () => {
    expect(exampleSite.themeId).toBe(portfolioTheme.manifest.id);
  });

  for (const item of contentItems) {
    describe(`"${item.slug}"`, () => {
      it("parses as a valid content tree", () => {
        expect(() => parseContentTree(item.blocks)).not.toThrow();
        expect(item.blocks.length).toBeGreaterThan(0);
      });

      it("renders every top-level block to static markup", () => {
        expect(() => renderTopLevelNodes(item.blocks)).not.toThrow();
      });

      it("only uses blocks its region allows", () => {
        const region = regionFor(
          item.type === "post" ? "post-body" : "page-body",
        );
        for (const node of item.blocks) {
          expect(region.allowedBlockIds).toContain(node.blockId);
        }
      });
    });
  }

  it("renders the home page with its real copy", () => {
    const home = exampleSite.pages.find((page) => page.slug === "/");
    const html = renderTopLevelNodes(home.blocks);

    expect(html).toContain("Brand systems with a spine.");
    expect(html).toContain("Verdigris Roasters");
    expect(html).toContain("Rui Bettencourt");
    expect(html).toContain("Start a project");
  });

  it("renders nested slot children, not just top-level blocks", () => {
    const work = exampleSite.pages.find((page) => page.slug === "/work");
    const html = renderTopLevelNodes(work.blocks);

    // Carousel slides and stats live in slots, so their text only appears
    // if the renderer walked into `slots.items`.
    expect(html).toContain("Identity systems shipped");
    expect(html).toContain("independent type foundry of two");
  });

  it("renders the footer region content tree", () => {
    expect(() => parseContentTree(exampleFooter)).not.toThrow();
    const html = renderTopLevelNodes(exampleFooter);

    expect(html).toContain("Marlowe Ashgrove");
    expect(html).toContain("Contact");
  });

  it("uses only blocks this theme actually registers", () => {
    const seen = new Set();
    const visit = (nodes) => {
      for (const node of nodes) {
        seen.add(node.blockId);
        for (const children of Object.values(node.slots ?? {})) {
          visit(children);
        }
      }
    };
    visit([...contentItems.flatMap((item) => item.blocks), ...exampleFooter]);

    expect(seen.size).toBeGreaterThan(15);
    for (const blockId of seen) {
      expect(() => portfolioTheme.getBlockComponent(blockId)).not.toThrow();
    }
  });
});
