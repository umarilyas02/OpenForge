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
  it("registers all thirty-one starter blocks with unique ids", () => {
    expect(registry.list()).toHaveLength(31);
    const ids = new Set(registry.list().map((definition) => definition.id));
    expect(ids.size).toBe(31);
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

  it("renders the Logo Cloud block's nested LogoItem children, duplicated for the marquee loop", () => {
    const LogoItem = registry.get("openforge-cms.logo-item").component;
    const LogoCloud = registry.get("openforge-cms.logo-cloud").component;

    const html = renderToStaticMarkup(
      LogoCloud({
        heading: "Trusted by",
        slots: {
          items: [
            LogoItem({ image: "https://example.test/a.png", name: "Acme" }),
            LogoItem({ image: "https://example.test/b.png", name: "Globex" }),
          ],
        },
      }),
    );

    expect(html).toContain("Trusted by");
    expect(html.match(/alt="Acme"/gu) ?? []).toHaveLength(2);
  });

  it("renders the Timeline block's nested TimelineStep children", () => {
    const TimelineStep = registry.get("openforge-cms.timeline-step").component;
    const Timeline = registry.get("openforge-cms.timeline").component;

    const html = renderToStaticMarkup(
      Timeline({
        heading: "Roadmap",
        slots: {
          items: [
            TimelineStep({ date: "Q1", title: "Launch" }),
            TimelineStep({ date: "Q2", title: "Scale" }),
          ],
        },
      }),
    );

    expect(html).toContain("Roadmap");
    expect(html).toContain("Launch");
    expect(html).toContain("Scale");
  });

  it("renders the Avatar Group block's nested AvatarItem children", () => {
    const AvatarItem = registry.get("openforge-cms.avatar-item").component;
    const AvatarGroup = registry.get("openforge-cms.avatar-group").component;

    const html = renderToStaticMarkup(
      AvatarGroup({
        caption: "Trusted by 200+ teams",
        slots: {
          items: [
            AvatarItem({ image: "https://example.test/a.png", name: "Ada" }),
            AvatarItem({ image: "https://example.test/b.png", name: "Grace" }),
          ],
        },
      }),
    );

    expect(html).toContain("Trusted by 200+ teams");
    expect(html).toContain('alt="Ada"');
    expect(html).toContain('alt="Grace"');
  });

  it("renders the Rating block's filled stars up to its value", () => {
    const Rating = registry.get("openforge-cms.rating").component;
    const html = renderToStaticMarkup(
      Rating({ value: "3", label: "3 out of 5" }),
    );
    expect(html.match(/of-rating-star-filled/gu) ?? []).toHaveLength(3);
  });

  it("renders the Progress block's fill width clamped to 0-100", () => {
    const Progress = registry.get("openforge-cms.progress").component;
    const html = renderToStaticMarkup(
      Progress({ label: "Goal", percent: "70" }),
    );
    expect(html).toContain('style="width:70%"');
    expect(html).toContain('aria-valuenow="70"');
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
