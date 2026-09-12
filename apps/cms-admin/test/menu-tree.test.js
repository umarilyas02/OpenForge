import { describe, expect, it } from "vitest";

import { buildMenuTree, flattenMenuTree } from "../src/lib/menu-tree.js";

describe("buildMenuTree", () => {
  it("returns a flat tree (no children) when every item has no parent", () => {
    const items = [
      { id: "a", parentId: null, position: 1 },
      { id: "b", parentId: null, position: 0 },
    ];

    const tree = buildMenuTree(items);

    expect(tree.map((node) => node.id)).toEqual(["b", "a"]);
    expect(tree.every((node) => node.children.length === 0)).toBe(true);
  });

  it("nests children under their parent, each side sorted by position", () => {
    const items = [
      { id: "home", parentId: null, position: 0 },
      { id: "about", parentId: null, position: 1 },
      { id: "team", parentId: "about", position: 1 },
      { id: "history", parentId: "about", position: 0 },
    ];

    const tree = buildMenuTree(items);

    expect(tree.map((node) => node.id)).toEqual(["home", "about"]);
    const about = tree.find((node) => node.id === "about");
    expect(about.children.map((child) => child.id)).toEqual([
      "history",
      "team",
    ]);
  });

  it("treats an item whose parentId points nowhere in the set as top-level", () => {
    const items = [{ id: "orphan", parentId: "missing-parent", position: 0 }];

    const tree = buildMenuTree(items);

    expect(tree.map((node) => node.id)).toEqual(["orphan"]);
  });
});

describe("flattenMenuTree", () => {
  it("assigns position from each node's index within its own sibling list", () => {
    const tree = [
      {
        id: "about",
        children: [
          { id: "history", children: [] },
          { id: "team", children: [] },
        ],
      },
      { id: "home", children: [] },
    ];

    const updates = flattenMenuTree(tree);

    expect(updates).toEqual([
      { id: "about", parentId: null, position: 0 },
      { id: "history", parentId: "about", position: 0 },
      { id: "team", parentId: "about", position: 1 },
      { id: "home", parentId: null, position: 1 },
    ]);
  });

  it("round-trips through buildMenuTree unchanged when nothing moved", () => {
    const items = [
      { id: "a", parentId: null, position: 0 },
      { id: "b", parentId: "a", position: 0 },
      { id: "c", parentId: null, position: 1 },
    ];

    const tree = buildMenuTree(items);
    const updates = flattenMenuTree(tree);

    expect(updates).toEqual([
      { id: "a", parentId: null, position: 0 },
      { id: "b", parentId: "a", position: 0 },
      { id: "c", parentId: null, position: 1 },
    ]);
  });

  it("moving a nested child out to top level clears its parentId", () => {
    const items = [
      { id: "a", parentId: null, position: 0 },
      { id: "b", parentId: "a", position: 0 },
    ];
    const tree = buildMenuTree(items);
    // Simulate the drag-and-drop UI promoting "b" to a top-level item
    // placed after "a".
    const promoted = tree[0].children.pop();
    tree.push({ ...promoted, children: [] });

    const updates = flattenMenuTree(tree);

    expect(updates).toEqual([
      { id: "a", parentId: null, position: 0 },
      { id: "b", parentId: null, position: 1 },
    ]);
  });

  it("reordering within a nesting level only changes the moved siblings' positions", () => {
    const items = [
      { id: "parent", parentId: null, position: 0 },
      { id: "first", parentId: "parent", position: 0 },
      { id: "second", parentId: "parent", position: 1 },
      { id: "third", parentId: "parent", position: 2 },
    ];
    const tree = buildMenuTree(items);
    // Drag "third" to the front of its sibling group.
    const [, , third] = tree[0].children;
    tree[0].children = [
      third,
      ...tree[0].children.filter((child) => child.id !== "third"),
    ];

    const updates = flattenMenuTree(tree);

    expect(updates).toEqual([
      { id: "parent", parentId: null, position: 0 },
      { id: "third", parentId: "parent", position: 0 },
      { id: "first", parentId: "parent", position: 1 },
      { id: "second", parentId: "parent", position: 2 },
    ]);
  });
});
