import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { describe, expect, it } from "vitest";

import { OFFICIAL_CMS_BLOCKS } from "../src/official-blocks.js";
import { createCmsBlockRegistry } from "../src/registry.js";

const registry = createCmsBlockRegistry(OFFICIAL_CMS_BLOCKS);

function dummyValueFor(field) {
  if (field.control === "boolean") return true;
  if (field.control === "url") return "https://example.test";
  if (field.control === "image") return "https://example.test/image.png";
  if (field.control === "select") return field.options[0].value;
  return "Test value";
}

function minimalProps(definition) {
  const props = { ...definition.defaultProps };
  for (const field of definition.editableFields) {
    if (field.required && !(field.path in props)) {
      props[field.path] = dummyValueFor(field);
    }
  }
  return props;
}

describe("official CMS blocks", () => {
  it("registers all twenty starter blocks with unique ids", () => {
    expect(registry.list()).toHaveLength(20);
    const ids = new Set(registry.list().map((definition) => definition.id));
    expect(ids.size).toBe(20);
  });

  it.each(OFFICIAL_CMS_BLOCKS)(
    "renders $definition.id to real markup with minimal valid props",
    (block) => {
      const props = minimalProps(block.definition);
      expect(() =>
        renderToStaticMarkup(createElement(block.component, props)),
      ).not.toThrow();
    },
  );

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

  it("renders the Stats Row block's nested Stat children", () => {
    const Stat = registry.get("openforge-cms.stat").component;
    const StatsRow = registry.get("openforge-cms.stats-row").component;

    const html = renderToStaticMarkup(
      StatsRow({
        heading: "By the numbers",
        slots: {
          items: [
            Stat({ value: "10k", label: "Users" }),
            Stat({ value: "99.9%", label: "Uptime" }),
          ],
        },
      }),
    );

    expect(html).toContain("By the numbers");
    expect(html).toContain("10k");
    expect(html).toContain("99.9%");
  });

  it("renders the Accordion block's nested FaqItem children", () => {
    const FaqItem = registry.get("openforge-cms.faq-item").component;
    const Accordion = registry.get("openforge-cms.accordion").component;

    const html = renderToStaticMarkup(
      Accordion({
        heading: "FAQ",
        slots: {
          items: [FaqItem({ question: "Is this real?", answer: "Yes." })],
        },
      }),
    );

    expect(html).toContain("<details");
    expect(html).toContain("Is this real?");
    expect(html).toContain("Yes.");
  });

  it("renders the Heading block's select-controlled level", () => {
    const Heading = registry.get("openforge-cms.heading").component;
    const html = renderToStaticMarkup(
      Heading({ text: "Section", level: "h3", align: "center" }),
    );
    expect(html).toContain("<h3");
    expect(html).toContain("of-heading-center");
  });

  it("rejects a select field definition with no options", async () => {
    const { parseCmsBlockDefinition } = await import("../src/schema.js");
    const heading = registry.get("openforge-cms.heading").definition;
    const broken = {
      ...heading,
      editableFields: heading.editableFields.map((field) =>
        field.path === "level" ? { ...field, options: undefined } : field,
      ),
    };
    expect(() => parseCmsBlockDefinition(broken)).toThrow();
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
