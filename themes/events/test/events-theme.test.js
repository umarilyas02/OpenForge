import { createRenderer, parseContentTree } from "@openforge/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  eventsTheme,
  eventsThemeBlockRegistry,
  exampleSite,
} from "../src/index.js";

const renderer = createRenderer({
  theme: eventsTheme,
  blockRegistry: eventsThemeBlockRegistry,
});

describe("events theme", () => {
  it("registers all three declared templates", () => {
    expect(() => eventsTheme.getTemplate("page")).not.toThrow();
    expect(() => eventsTheme.getTemplate("post")).not.toThrow();
    expect(() => eventsTheme.getTemplate("notFound")).not.toThrow();
  });

  it("resolves every block referenced by a region", () => {
    for (const region of eventsTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => eventsTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("sets a violet-and-gold brand palette using well-formed token names", () => {
    const overrides = eventsTheme.manifest.defaultTokenOverrides;

    for (const [tokenName, value] of Object.entries(overrides)) {
      // Same shape design-tokens' own token-name schema enforces, so an
      // invented name can never be silently dropped by the style merge.
      expect(tokenName).toMatch(/^[a-z][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)+$/u);
      expect(typeof value).toBe("string");
      expect(value.trim().length).toBeGreaterThan(0);
    }

    expect(overrides["color.orange-500"]).toBe("#caa63d");
    expect(overrides["color.action"]).toBe("#4a1942");
    expect(overrides["radius.card"]).toBe("1.5rem");
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = eventsTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "Tickets" } },
        createElement("p", null, "Every pass gets you the whole Summit"),
      ),
    );

    expect(html).toContain("of-theme-events-page");
    expect(html).toContain("Tickets");
    expect(html).toContain("Every pass gets you the whole Summit");
  });

  it("renders the post template with a formatted published date", () => {
    const PostTemplate = eventsTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: {
          title: "Announcing the 2027 Aurum Summit",
          publishedAt: "2026-05-14T00:00:00.000Z",
        },
      }),
    );

    expect(html).toContain("Announcing the 2027 Aurum Summit");
    expect(html).toContain("2026");
  });

  it("renders the not-found template", () => {
    const NotFoundTemplate = eventsTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("Session not found");
  });
});

describe("events theme example site", () => {
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
          eventsTheme.isBlockAllowedInRegion("page-body", node.blockId),
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

  it("renders real conference copy on the home page", () => {
    const home = exampleSite.find((page) => page.path === "/");
    const html = renderToStaticMarkup(
      renderer.renderTree(parseContentTree(home.blocks)),
    );

    expect(html).toContain("Three days");
    expect(html).toContain("Aurum Summit");
    expect(html).not.toMatch(/lorem ipsum/iu);
  });

  it("builds the schedule page around timeline and timeline-step blocks", () => {
    const schedule = exampleSite.find((page) => page.path === "/schedule");
    const timelineNodes = schedule.blocks.filter(
      (node) => node.blockId === "openforge-cms.timeline",
    );

    expect(timelineNodes.length).toBeGreaterThanOrEqual(2);
    for (const node of timelineNodes) {
      expect(node.slots.items.length).toBeGreaterThanOrEqual(2);
      for (const step of node.slots.items) {
        expect(step.blockId).toBe("openforge-cms.timeline-step");
      }
    }
  });

  it("builds the speakers page around team-member blocks", () => {
    const speakers = exampleSite.find((page) => page.path === "/speakers");
    const teamMemberNodes = speakers.blocks.filter(
      (node) => node.blockId === "openforge-cms.team-member",
    );

    expect(teamMemberNodes.length).toBeGreaterThanOrEqual(3);
  });
});
