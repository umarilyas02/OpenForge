import { createRenderer, parseContentTree } from "@openforge/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  exampleSite,
  healthcareTheme,
  healthcareThemeBlockRegistry,
} from "../src/index.js";

const renderer = createRenderer({
  theme: healthcareTheme,
  blockRegistry: healthcareThemeBlockRegistry,
});

function renderTopLevelNodes(nodes) {
  return nodes
    .map((node, index) =>
      renderToStaticMarkup(renderer.renderNode(node, [index])),
    )
    .join("");
}

describe("healthcare theme", () => {
  it("registers all three declared templates", () => {
    expect(() => healthcareTheme.getTemplate("page")).not.toThrow();
    expect(() => healthcareTheme.getTemplate("post")).not.toThrow();
    expect(() => healthcareTheme.getTemplate("notFound")).not.toThrow();
  });

  it("declares the healthcare theme identity", () => {
    expect(healthcareTheme.manifest.id).toBe("openforge-theme.healthcare");
    expect(healthcareTheme.manifest.version).toBe("1.0.0");
  });

  it("resolves every block referenced by a region", () => {
    for (const region of healthcareTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => healthcareTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("curates the clinic-specific blocks into the page body region", () => {
    for (const blockId of [
      "openforge-cms.hero",
      "openforge-cms.icon-box",
      "openforge-cms.team-member",
      "openforge-cms.testimonial",
      "openforge-cms.accordion",
      "openforge-cms.stats-row",
      "openforge-cms.alert",
      "openforge-cms.cta",
    ]) {
      expect(healthcareTheme.isBlockAllowedInRegion("page-body", blockId)).toBe(
        true,
      );
    }
  });

  it("overrides only real design token names", () => {
    const overrides = healthcareTheme.manifest.defaultTokenOverrides;
    expect(overrides["color.action"]).toBe("#0b7a69");
    expect(overrides["radius.card"]).toBe("1rem");
    for (const value of Object.values(overrides)) {
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
    }
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = healthcareTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "Patient information" } },
        createElement("p", null, "Body content"),
      ),
    );

    expect(html).toContain("of-theme-healthcare-page");
    expect(html).toContain("Patient information");
    expect(html).toContain("Body content");
  });

  it("renders the post template with a formatted published date", () => {
    const PostTemplate = healthcareTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: {
          title: "Saturday vaccination clinics",
          publishedAt: "2026-08-28T00:00:00.000Z",
        },
      }),
    );

    expect(html).toContain("Saturday vaccination clinics");
    expect(html).toContain("2026");
  });

  it("renders the not-found template", () => {
    const NotFoundTemplate = healthcareTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("Page not found");
    expect(html).toContain("emergency");
  });
});

describe("healthcare example site", () => {
  it("ships six pages with unique slugs", () => {
    expect(exampleSite.pages).toHaveLength(6);
    const slugs = exampleSite.pages.map((page) => page.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("targets this theme and gives every page a title and blocks", () => {
    expect(exampleSite.themeId).toBe(healthcareTheme.manifest.id);
    for (const page of exampleSite.pages) {
      expect(page.title.length).toBeGreaterThan(0);
      expect(Array.isArray(page.blocks)).toBe(true);
      expect(page.blocks.length).toBeGreaterThan(0);
    }
  });

  it("parses every page's content tree", () => {
    for (const page of exampleSite.pages) {
      expect(() => parseContentTree(page.blocks), page.slug).not.toThrow();
    }
  });

  it("only uses blocks the page-body region allows at the top level", () => {
    for (const page of exampleSite.pages) {
      for (const node of page.blocks) {
        expect(
          healthcareTheme.isBlockAllowedInRegion("page-body", node.blockId),
          `${page.slug} -> ${node.blockId}`,
        ).toBe(true);
      }
    }
  });

  it("renders every page's blocks without throwing", () => {
    for (const page of exampleSite.pages) {
      const nodes = parseContentTree(page.blocks);
      expect(() => renderTopLevelNodes(nodes), page.slug).not.toThrow();
    }
  });

  it("renders real clinic copy into the home page markup", () => {
    const nodes = parseContentTree(exampleSite.pages[0].blocks);
    const html = renderTopLevelNodes(nodes);

    expect(html).toContain("Everyday family care, close to home");
    expect(html).toContain("Request an appointment");
    expect(html).toContain("emergency department");
  });

  it("renders the footer region content tree", () => {
    const nodes = parseContentTree(exampleSite.footer);
    for (const node of nodes) {
      expect(
        healthcareTheme.isBlockAllowedInRegion("footer", node.blockId),
      ).toBe(true);
    }

    const html = renderTopLevelNodes(nodes);
    expect(html).toContain("Northbridge Family Health");
  });

  it("has no lorem ipsum placeholder copy anywhere", () => {
    const serialized = JSON.stringify(exampleSite).toLowerCase();
    expect(serialized).not.toContain("lorem ipsum");
    expect(serialized).not.toContain("your company");
  });
});
