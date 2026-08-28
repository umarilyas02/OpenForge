import { defaultThemeBlockRegistry } from "@openforge/theme-default";
import { describe, expect, it } from "vitest";

import {
  prepareContentTreeForSave,
  serializeBlockDefinitions,
} from "../src/lib/content-tree-ops.js";

describe("prepareContentTreeForSave", () => {
  it("round-trips a valid single-block tree", () => {
    const result = prepareContentTreeForSave(
      [
        {
          blockId: "openforge-cms.hero",
          blockVersion: 1,
          props: { heading: "Hello" },
        },
      ],
      defaultThemeBlockRegistry,
    );

    expect(result).toEqual([
      {
        blockId: "openforge-cms.hero",
        blockVersion: 1,
        props: { heading: "Hello" },
        slots: {},
      },
    ]);
  });

  it("rejects an unknown block id", () => {
    expect(() =>
      prepareContentTreeForSave(
        [
          {
            blockId: "openforge-cms.does-not-exist",
            blockVersion: 1,
            props: {},
          },
        ],
        defaultThemeBlockRegistry,
      ),
    ).toThrow();
  });

  it("rejects a node missing a required prop", () => {
    expect(() =>
      prepareContentTreeForSave(
        [{ blockId: "openforge-cms.hero", blockVersion: 1, props: {} }],
        defaultThemeBlockRegistry,
      ),
    ).toThrow(/missing required props/u);
  });

  it("rejects a block version newer than the registry supports", () => {
    expect(() =>
      prepareContentTreeForSave(
        [
          {
            blockId: "openforge-cms.hero",
            blockVersion: 2,
            props: { heading: "Hello" },
          },
        ],
        defaultThemeBlockRegistry,
      ),
    ).toThrow();
  });

  it("preserves nested slot content through migration and validation", () => {
    const result = prepareContentTreeForSave(
      [
        {
          blockId: "openforge-cms.columns",
          blockVersion: 1,
          props: { heading: "Features" },
          slots: {
            items: [
              {
                blockId: "openforge-cms.rich-text",
                blockVersion: 1,
                props: { content: "First" },
              },
              {
                blockId: "openforge-cms.rich-text",
                blockVersion: 1,
                props: { content: "Second" },
              },
            ],
          },
        },
      ],
      defaultThemeBlockRegistry,
    );

    expect(result[0].slots.items).toHaveLength(2);
    expect(result[0].slots.items[0].props.content).toBe("First");
    expect(result[0].slots.items[1].props.content).toBe("Second");
  });

  it("rejects invalid content inside a slot, not just at the top level", () => {
    expect(() =>
      prepareContentTreeForSave(
        [
          {
            blockId: "openforge-cms.columns",
            blockVersion: 1,
            props: { heading: "Features" },
            slots: {
              items: [
                {
                  blockId: "openforge-cms.rich-text",
                  blockVersion: 1,
                  props: {},
                },
              ],
            },
          },
        ],
        defaultThemeBlockRegistry,
      ),
    ).toThrow(/missing required props/u);
  });

  it("rejects a non-array top-level tree", () => {
    expect(() =>
      prepareContentTreeForSave({ not: "an array" }, defaultThemeBlockRegistry),
    ).toThrow(/must be an array/u);
  });
});

describe("serializeBlockDefinitions", () => {
  it("returns serializable definitions without component functions", () => {
    const definitions = serializeBlockDefinitions(
      ["openforge-cms.hero", "openforge-cms.rich-text"],
      defaultThemeBlockRegistry,
    );

    expect(definitions).toHaveLength(2);
    expect(definitions[0].id).toBe("openforge-cms.hero");
    expect(definitions[0].editableFields.length).toBeGreaterThan(0);
    expect(definitions[0].component).toBeUndefined();
    expect(() => JSON.stringify(definitions)).not.toThrow();
  });
});
