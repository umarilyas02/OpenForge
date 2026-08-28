import { defaultThemeBlockRegistry } from "@openforge/theme-default";
import { describe, expect, it } from "vitest";

import { prepareContentTreeForSave } from "../src/lib/content-tree-ops.js";
import {
  PAGE_TEMPLATES,
  POST_TEMPLATES,
  templatesForType,
} from "../src/lib/page-templates.js";

describe("page templates", () => {
  it.each(PAGE_TEMPLATES)(
    "page template '$id' produces a tree that passes save validation",
    (template) => {
      expect(() =>
        prepareContentTreeForSave(template.build(), defaultThemeBlockRegistry),
      ).not.toThrow();
    },
  );

  it.each(POST_TEMPLATES)(
    "post template '$id' produces a tree that passes save validation",
    (template) => {
      expect(() =>
        prepareContentTreeForSave(template.build(), defaultThemeBlockRegistry),
      ).not.toThrow();
    },
  );

  it("every page template has a unique id", () => {
    const ids = PAGE_TEMPLATES.map((template) => template.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every post template has a unique id", () => {
    const ids = POST_TEMPLATES.map((template) => template.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("templatesForType falls back to page templates for an unknown type", () => {
    expect(templatesForType("page")).toBe(PAGE_TEMPLATES);
    expect(templatesForType("post")).toBe(POST_TEMPLATES);
  });

  it("the blank template always produces an empty tree", () => {
    expect(PAGE_TEMPLATES.find((t) => t.id === "blank").build()).toEqual([]);
    expect(POST_TEMPLATES.find((t) => t.id === "blank").build()).toEqual([]);
  });
});
