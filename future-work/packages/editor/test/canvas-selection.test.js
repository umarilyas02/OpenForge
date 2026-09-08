import { describe, expect, it } from "vitest";

import {
  createCanvasSelectionState,
  getCanvasOverlayDescriptors,
  hoverCanvasNode,
  markInvalidDropTarget,
  navigateCanvasSelection,
  selectCanvasNode,
} from "../src/index.js";

const nodes = [
  { id: "page", label: "Page", parentId: null },
  {
    id: "hero",
    label: "Hero",
    parentId: "page",
    componentId: "component-hero",
  },
  { id: "heading", label: "Heading", parentId: "hero", slot: "heading" },
  { id: "body", label: "Body", parentId: "hero", slot: "body" },
];
const rectangles = {
  page: { top: 0, left: 0, width: 800, height: 600 },
  hero: { top: 40, left: 40, width: 720, height: 360 },
  heading: { top: 80, left: 80, width: 400, height: 60 },
  body: { top: 160, left: 80, width: 440, height: 80 },
};

describe("canvas selection", () => {
  it("renders selected, parent, component, slot, hover, and invalid states", () => {
    let state = createCanvasSelectionState(nodes);
    state = selectCanvasNode(state, "heading");
    state = hoverCanvasNode(state, "body");
    state = markInvalidDropTarget(state, "hero");
    const descriptors = getCanvasOverlayDescriptors(state, rectangles);

    expect(descriptors.find(({ id }) => id === "heading").states).toEqual(
      expect.arrayContaining(["selected", "focused", "slot"]),
    );
    expect(descriptors.find(({ id }) => id === "hero").states).toEqual(
      expect.arrayContaining(["parent", "component", "invalid-drop"]),
    );
    expect(descriptors.find(({ id }) => id === "body").states).toContain(
      "hovered",
    );
  });

  it("supports parent, child, sibling, and keyboard selection paths", () => {
    let state = createCanvasSelectionState(nodes);
    state = { ...state, focusedNodeId: "hero" };
    state = navigateCanvasSelection(state, "ArrowDown");
    expect(state.focusedNodeId).toBe("heading");
    state = navigateCanvasSelection(state, "ArrowRight");
    expect(state.focusedNodeId).toBe("body");
    state = navigateCanvasSelection(state, "ArrowUp");
    expect(state.focusedNodeId).toBe("hero");
    state = navigateCanvasSelection(state, "Enter");
    expect(state.selectedNodeId).toBe("hero");
  });

  it("never emits overlays without measured rectangles", () => {
    const state = selectCanvasNode(
      createCanvasSelectionState(nodes),
      "heading",
    );
    expect(getCanvasOverlayDescriptors(state, {})).toEqual([]);
  });
});
