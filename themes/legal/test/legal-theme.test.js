import { createRenderer, parseContentTree } from "@openforge/renderer";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import {
  exampleSite,
  legalTheme,
  legalThemeBlockRegistry,
} from "../src/index.js";

const renderer = createRenderer({
  theme: legalTheme,
  blockRegistry: legalThemeBlockRegistry,
});

describe("legal theme", () => {
  it("registers all three declared templates", () => {
    expect(() => legalTheme.getTemplate("page")).not.toThrow();
    expect(() => legalTheme.getTemplate("post")).not.toThrow();
    expect(() => legalTheme.getTemplate("notFound")).not.toThrow();
  });

  it("uses the legal theme id", () => {
    expect(legalTheme.manifest.id).toBe("openforge-theme.legal");
  });

  it("resolves every block referenced by a region", () => {
    for (const region of legalTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => legalTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("sets a navy-and-gold brand palette using well-formed token names", () => {
    const overrides = legalTheme.manifest.defaultTokenOverrides;

    for (const [tokenName, value] of Object.entries(overrides)) {
      // Same shape design-tokens' own token-name schema enforces, so an
      // invented name can never be silently dropped by the style merge.
      expect(tokenName).toMatch(/^[a-z][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)+$/u);
      expect(typeof value).toBe("string");
      expect(value.trim().length).toBeGreaterThan(0);
    }

    expect(overrides["color.orange-500"]).toBe("#b3922f");
    expect(overrides["color.ink"]).toBe("#101d33");
    expect(overrides["radius.card"]).toBe("0.375rem");
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = legalTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "Practice Areas" } },
        createElement("p", null, "Six practice groups, one standard of preparation"),
      ),
    );

    expect(html).toContain("of-theme-legal-page");
    expect(html).toContain("Practice Areas");
    expect(html).toContain("Six practice groups, one standard of preparation");
  });

  it("renders the post template with a formatted published date", () => {
    const PostTemplate = legalTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: {
          title: "A note on recent appellate rule changes",
          publishedAt: "2026-04-02T00:00:00.000Z",
        },
      }),
    );

    expect(html).toContain("A note on recent appellate rule changes");
    expect(html).toContain("2026");
  });

  it("renders the not-found template", () => {
    const NotFoundTemplate = legalTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("Page not found");
  });
});

describe("legal theme example site", () => {
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
          legalTheme.isBlockAllowedInRegion("page-body", node.blockId),
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

  it("renders real firm copy on the home page", () => {
    const home = exampleSite.find((page) => page.path === "/");
    const html = renderToStaticMarkup(
      renderer.renderTree(parseContentTree(home.blocks)),
    );

    expect(html).toContain("Counsel you can build a case on");
    expect(html).toContain("Meridian & Cole");
    expect(html).not.toMatch(/lorem ipsum/iu);
  });

  it("ends every page with the firm's footer, including the advertising notice", () => {
    for (const page of exampleSite) {
      const nodes = parseContentTree(page.blocks);
      const lastNode = nodes[nodes.length - 1];

      expect(lastNode.blockId).toBe("openforge-cms.footer");

      const html = renderToStaticMarkup(
        renderer.renderNode(lastNode, [nodes.length - 1]),
      );
      expect(html).toContain("Attorney advertising");
    }
  });

  it("carries the required attorney-client disclaimer on the contact page", () => {
    const contact = exampleSite.find((page) => page.path === "/contact");
    const html = renderToStaticMarkup(
      renderer.renderTree(parseContentTree(contact.blocks)),
    );

    expect(html).toContain("does not create an attorney-client relationship");
  });
});
