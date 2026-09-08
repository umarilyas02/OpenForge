import { createRenderer, parseContentTree } from "@openforge/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  educationTheme,
  educationThemeBlockRegistry,
  exampleSite,
} from "../src/index.js";
import { exampleFooter } from "../src/example-site.js";

const renderer = createRenderer({
  theme: educationTheme,
  blockRegistry: educationThemeBlockRegistry,
});

function renderTopLevelNodes(nodes) {
  return nodes
    .map((node, index) =>
      renderToStaticMarkup(renderer.renderNode(node, [index])),
    )
    .join("");
}

describe("education theme", () => {
  it("registers all three declared templates", () => {
    expect(() => educationTheme.getTemplate("page")).not.toThrow();
    expect(() => educationTheme.getTemplate("post")).not.toThrow();
    expect(() => educationTheme.getTemplate("notFound")).not.toThrow();
  });

  it("resolves every block referenced by a region", () => {
    for (const region of educationTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => educationTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("declares the course-site regions the theme is built around", () => {
    const regionKeys = educationTheme.manifest.regions.map(
      (region) => region.key,
    );

    expect(regionKeys).toEqual(["page-body", "post-body", "footer"]);
    expect(
      educationTheme.isBlockAllowedInRegion(
        "page-body",
        "openforge-cms.pricing",
      ),
    ).toBe(true);
    expect(
      educationTheme.isBlockAllowedInRegion("footer", "openforge-cms.hero"),
    ).toBe(false);
  });

  it("overrides only real design tokens", () => {
    const overrides = educationTheme.manifest.defaultTokenOverrides;

    expect(overrides["color.action"]).toBe("#1e3a5f");
    expect(overrides["color.orange-500"]).toBe("#f2a71b");
    expect(overrides["radius.card"]).toBe("0.75rem");
    for (const value of Object.values(overrides)) {
      expect(typeof value).toBe("string");
      expect(value.length).toBeGreaterThan(0);
    }
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = educationTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "Courses" } },
        createElement("p", null, "Body content"),
      ),
    );

    expect(html).toContain("Courses");
    expect(html).toContain("Body content");
    expect(html).toContain("of-theme-education-page");
  });

  it("renders the post template with a formatted published date", () => {
    const PostTemplate = educationTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: {
          title: "Spring cohort dates",
          publishedAt: "2026-08-28T00:00:00.000Z",
        },
      }),
    );

    expect(html).toContain("Spring cohort dates");
    expect(html).toContain("2026");
  });

  it("renders the not-found template", () => {
    const NotFoundTemplate = educationTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("Page not found");
  });
});

describe("education theme example site", () => {
  it("ships six pages with unique slugs", () => {
    expect(exampleSite.pages).toHaveLength(6);
    expect(exampleSite.themeId).toBe(educationTheme.manifest.id);

    const slugs = exampleSite.pages.map((page) => page.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("parses every page's blocks as a valid content tree", () => {
    for (const page of exampleSite.pages) {
      expect(
        () => parseContentTree(page.blocks),
        `page ${page.slug} should parse`,
      ).not.toThrow();
      expect(page.blocks.length).toBeGreaterThan(0);
    }
  });

  it("renders every top-level node of every page without throwing", () => {
    for (const page of exampleSite.pages) {
      const nodes = parseContentTree(page.blocks);
      expect(
        () => renderTopLevelNodes(nodes),
        `page ${page.slug} should render`,
      ).not.toThrow();
    }
  });

  it("renders page content that the templates can wrap", () => {
    const home = exampleSite.pages.find((page) => page.slug === "/");
    const html = renderTopLevelNodes(parseContentTree(home.blocks));

    expect(html).toContain("Learn to work with data");
    expect(html).toContain("Live workshop");
    expect(html).toContain("Priya Raghunathan");
  });

  it("renders the enrollment page's three tuition options", () => {
    const enrollment = exampleSite.pages.find(
      (page) => page.slug === "/enrollment",
    );
    const html = renderTopLevelNodes(parseContentTree(enrollment.blocks));

    expect(html).toContain("Single Course");
    expect(html).toContain("Full Program");
    expect(html).toContain("Mentor Track");
    expect(html).toContain("of-pricing-featured");
  });

  it("renders the questions page as native details/summary items", () => {
    const questions = exampleSite.pages.find(
      (page) => page.slug === "/questions",
    );
    const html = renderTopLevelNodes(parseContentTree(questions.blocks));

    expect(html).toContain("<details");
    expect(html).toContain("Do I need to know how to code?");
  });

  it("only uses blocks its own regions allow at the top level", () => {
    const allowed = new Set(
      educationTheme.manifest.regions
        .filter((region) => region.key === "page-body")
        .flatMap((region) => region.allowedBlockIds),
    );

    for (const page of exampleSite.pages) {
      for (const node of page.blocks) {
        expect(
          allowed.has(node.blockId),
          `${node.blockId} in ${page.slug}`,
        ).toBe(true);
      }
    }
  });

  it("parses and renders the site footer", () => {
    expect(() => parseContentTree(exampleFooter)).not.toThrow();

    const html = renderTopLevelNodes(parseContentTree(exampleFooter));
    expect(html).toContain("Brightfield Academy");
    expect(html).toContain("Student stories");
  });
});
