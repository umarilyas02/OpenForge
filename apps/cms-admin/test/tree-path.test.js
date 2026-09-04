import { describe, expect, it } from "vitest";

import { getNodeAtPath, setNodeAtPath } from "../src/lib/tree-path.js";

function tree() {
  return [
    { blockId: "openforge-cms.hero", props: { heading: "First" }, slots: {} },
    {
      blockId: "openforge-cms.columns",
      props: { heading: "Features" },
      slots: {
        items: [
          {
            blockId: "openforge-cms.rich-text",
            props: { content: "Column A" },
            slots: {},
          },
          {
            blockId: "openforge-cms.stats-row",
            props: {},
            slots: {
              items: [
                {
                  blockId: "openforge-cms.stat",
                  props: { value: "1", label: "One" },
                  slots: {},
                },
              ],
            },
          },
        ],
      },
    },
  ];
}

describe("getNodeAtPath", () => {
  it("reads a top-level node", () => {
    expect(getNodeAtPath(tree(), [0]).blockId).toBe("openforge-cms.hero");
  });

  it("reads a node inside a slot", () => {
    expect(getNodeAtPath(tree(), [1, "slots", "items", 0]).blockId).toBe(
      "openforge-cms.rich-text",
    );
  });

  it("reads a node inside a doubly-nested slot", () => {
    expect(
      getNodeAtPath(tree(), [1, "slots", "items", 1, "slots", "items", 0])
        .blockId,
    ).toBe("openforge-cms.stat");
  });
});

describe("setNodeAtPath", () => {
  it("replaces a top-level node without mutating the original tree", () => {
    const original = tree();
    const updated = setNodeAtPath(original, [0], (node) => ({
      ...node,
      props: { ...node.props, heading: "Changed" },
    }));

    expect(updated[0].props.heading).toBe("Changed");
    expect(original[0].props.heading).toBe("First");
    expect(updated[1]).toBe(original[1]);
  });

  it("replaces a node inside a slot, preserving siblings", () => {
    const updated = setNodeAtPath(tree(), [1, "slots", "items", 0], (node) => ({
      ...node,
      props: { content: "Changed" },
    }));

    expect(updated[1].slots.items[0].props.content).toBe("Changed");
    expect(updated[1].slots.items[1].blockId).toBe("openforge-cms.stats-row");
  });

  it("replaces a node inside a doubly-nested slot", () => {
    const updated = setNodeAtPath(
      tree(),
      [1, "slots", "items", 1, "slots", "items", 0],
      (node) => ({ ...node, props: { value: "99", label: "Ninety-nine" } }),
    );

    expect(updated[1].slots.items[1].slots.items[0].props.value).toBe("99");
  });
});
