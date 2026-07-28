export function createCanvasSelectionState(nodes) {
  const records = Object.fromEntries(
    nodes.map((node) => [node.id, { ...node }]),
  );
  return {
    focusedNodeId: nodes[0]?.id ?? null,
    hoveredNodeId: null,
    invalidDropTargetId: null,
    nodes: records,
    order: nodes.map(({ id }) => id),
    selectedNodeId: null,
  };
}

export const hoverCanvasNode = (state, nodeId) => ({
  ...state,
  hoveredNodeId: requireOptionalNode(state, nodeId),
});

export const selectCanvasNode = (state, nodeId) => ({
  ...state,
  focusedNodeId: requireOptionalNode(state, nodeId),
  selectedNodeId: requireOptionalNode(state, nodeId),
});

export const markInvalidDropTarget = (state, nodeId) => ({
  ...state,
  invalidDropTargetId: requireOptionalNode(state, nodeId),
});

export function navigateCanvasSelection(state, key) {
  const focused = state.nodes[state.focusedNodeId];
  if (!focused) return state;
  const siblings = state.order
    .map((id) => state.nodes[id])
    .filter((node) => node.parentId === focused.parentId);
  const siblingIndex = siblings.findIndex(({ id }) => id === focused.id);
  let nextId = focused.id;

  if (key === "ArrowUp" && focused.parentId) nextId = focused.parentId;
  if (key === "ArrowDown") {
    nextId =
      state.order
        .map((id) => state.nodes[id])
        .find(({ parentId }) => parentId === focused.id)?.id ?? focused.id;
  }
  if (key === "ArrowLeft" && siblingIndex > 0) {
    nextId = siblings[siblingIndex - 1].id;
  }
  if (key === "ArrowRight" && siblingIndex < siblings.length - 1) {
    nextId = siblings[siblingIndex + 1].id;
  }
  if (key === "Enter" || key === " ") {
    return { ...state, selectedNodeId: focused.id };
  }
  return { ...state, focusedNodeId: nextId };
}

export function getCanvasOverlayDescriptors(state, rectangles) {
  const relevantIds = new Set([
    state.focusedNodeId,
    state.hoveredNodeId,
    state.invalidDropTargetId,
    state.selectedNodeId,
    state.nodes[state.selectedNodeId]?.parentId,
  ]);

  return [...relevantIds]
    .filter(Boolean)
    .filter((id) => rectangles[id])
    .map((id) => {
      const node = state.nodes[id];
      const states = [];
      if (id === state.hoveredNodeId) states.push("hovered");
      if (id === state.selectedNodeId) states.push("selected");
      if (id === state.focusedNodeId) states.push("focused");
      if (id === state.nodes[state.selectedNodeId]?.parentId) {
        states.push("parent");
      }
      if (node.componentId) states.push("component");
      if (node.slot) states.push("slot");
      if (id === state.invalidDropTargetId) states.push("invalid-drop");
      return {
        id,
        label: node.label,
        rectangle: { ...rectangles[id] },
        states,
      };
    });
}

function requireOptionalNode(state, nodeId) {
  if (nodeId === null) return null;
  if (!state.nodes[nodeId])
    throw new Error(`Unknown canvas node: "${nodeId}".`);
  return nodeId;
}
