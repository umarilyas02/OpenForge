import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { OFFICIAL_CMS_BLOCKS } from "../src/official-blocks.js";
import { createCmsBlockRegistry } from "../src/registry.js";

const registry = createCmsBlockRegistry(OFFICIAL_CMS_BLOCKS);

describe("official CMS blocks", () => {
  it("registers all six starter blocks with unique ids", () => {
    expect(registry.list()).toHaveLength(6);
    const ids = new Set(registry.list().map((definition) => definition.id));
    expect(ids.size).toBe(6);
  });

  it("renders every block's component to real markup without throwing", () => {
    const Hero = registry.get("openforge-cms.hero").component;
    const html = renderToStaticMarkup(
      Hero({ heading: "Welcome", ctaLabel: "Start", ctaHref: "/start" }),
    );
    expect(html).toContain("Welcome");
    expect(html).toContain('href="/start"');
  });

  it("renders the Columns block's nested slot content", () => {
    const RichText = registry.get("openforge-cms.rich-text").component;
    const Columns = registry.get("openforge-cms.columns").component;

    const html = renderToStaticMarkup(
      Columns({
        heading: "Features",
        slots: {
          items: [RichText({ content: "First column" })],
        },
      }),
    );

    expect(html).toContain("Features");
    expect(html).toContain("First column");
  });

  it("rejects required-prop validation failures", () => {
    expect(() => registry.validateProps("openforge-cms.hero", {})).toThrow(
      /missing required props/u,
    );
  });

  it("accepts valid required props", () => {
    expect(() =>
      registry.validateProps("openforge-cms.hero", { heading: "Welcome" }),
    ).not.toThrow();
  });

  it("throws for an unknown block id", () => {
    expect(() => registry.get("openforge-cms.does-not-exist")).toThrow();
  });
});
