export const VIEWPORT_PRESETS = Object.freeze({
  mobile: Object.freeze({ label: "Mobile", width: 390 }),
  tablet: Object.freeze({ label: "Tablet", width: 768 }),
  laptop: Object.freeze({ label: "Laptop", width: 1024 }),
  desktop: Object.freeze({ label: "Desktop", width: 1440 }),
});

const BREAKPOINT_ORDER = Object.freeze([
  "mobile",
  "tablet",
  "laptop",
  "desktop",
]);

export class ResponsiveEditorError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "ResponsiveEditorError";
    this.code = code;
    this.details = details;
  }
}

export function createResponsiveEditorState({
  viewport = "desktop",
  hostWidth = 1440,
  overrides = {},
} = {}) {
  requireViewport(viewport);
  requireHostWidth(hostWidth);
  return {
    schemaVersion: 1,
    viewport,
    viewportWidth: VIEWPORT_PRESETS[viewport].width,
    overrides: structuredClone(overrides),
    layout: getResponsiveEditorLayout({ hostWidth }),
  };
}

export function selectResponsiveViewport(state, viewport) {
  requireViewport(viewport);
  return {
    ...state,
    viewport,
    viewportWidth: VIEWPORT_PRESETS[viewport].width,
  };
}

export function updateResponsiveHostWidth(state, hostWidth) {
  requireHostWidth(hostWidth);
  return { ...state, layout: getResponsiveEditorLayout({ hostWidth }) };
}

export function setResponsiveOverride(
  state,
  { nodeId, property, breakpoint, value },
) {
  requireOverrideTarget({ nodeId, property, breakpoint });
  const nodeOverrides = state.overrides[nodeId] ?? {};
  const propertyOverrides = nodeOverrides[property] ?? {};

  return {
    ...state,
    overrides: {
      ...state.overrides,
      [nodeId]: {
        ...nodeOverrides,
        [property]: {
          ...propertyOverrides,
          [breakpoint]: structuredClone(value),
        },
      },
    },
  };
}

export function resetResponsiveOverride(
  state,
  { nodeId, property, breakpoint },
) {
  requireOverrideTarget({ nodeId, property, breakpoint });
  const nodeOverrides = state.overrides[nodeId];
  const propertyOverrides = nodeOverrides?.[property];
  if (!propertyOverrides || !(breakpoint in propertyOverrides)) return state;

  const nextProperty = { ...propertyOverrides };
  delete nextProperty[breakpoint];
  const nextNode = { ...nodeOverrides };
  if (Object.keys(nextProperty).length === 0) delete nextNode[property];
  else nextNode[property] = nextProperty;
  const nextOverrides = { ...state.overrides };
  if (Object.keys(nextNode).length === 0) delete nextOverrides[nodeId];
  else nextOverrides[nodeId] = nextNode;

  return { ...state, overrides: nextOverrides };
}

export function resolveResponsiveOverride(
  state,
  { nodeId, property, baseValue },
) {
  const propertyOverrides = state.overrides[nodeId]?.[property] ?? {};
  const viewportIndex = BREAKPOINT_ORDER.indexOf(state.viewport);
  const active = BREAKPOINT_ORDER.slice(0, viewportIndex + 1)
    .reverse()
    .find((breakpoint) => breakpoint in propertyOverrides);

  return active
    ? {
        value: structuredClone(propertyOverrides[active]),
        source: "breakpoint",
        breakpoint: active,
        inherited: active !== state.viewport,
      }
    : {
        value: structuredClone(baseValue),
        source: "base",
        breakpoint: null,
        inherited: true,
      };
}

export function analyzeResponsiveLayout({ viewport, nodes }) {
  requireViewport(viewport);
  if (!Array.isArray(nodes)) {
    throw new TypeError("nodes must be an array.");
  }
  const viewportWidth = VIEWPORT_PRESETS[viewport].width;
  const diagnostics = [];

  for (const node of nodes) {
    if (!node?.nodeId || !node?.label || !node.rect) {
      throw new ResponsiveEditorError(
        "OF_RESPONSIVE_MEASUREMENT_INVALID",
        "Responsive measurements require nodeId, label, and rect.",
      );
    }
    const right = node.rect.left + node.rect.width;
    if (node.rect.left < -1 || right > viewportWidth + 1) {
      diagnostics.push(
        diagnostic(
          node,
          "OF_RESPONSIVE_HORIZONTAL_OVERFLOW",
          "error",
          `${node.label} extends beyond the ${viewport} viewport.`,
        ),
      );
    }
    if (
      Number.isFinite(node.scrollWidth) &&
      Number.isFinite(node.clientWidth) &&
      node.scrollWidth > node.clientWidth + 1
    ) {
      diagnostics.push(
        diagnostic(
          node,
          "OF_RESPONSIVE_CONTENT_CLIPPED",
          "warning",
          `${node.label} clips or scrolls its content horizontally.`,
        ),
      );
    }
    if (
      node.fixedWidth === true &&
      node.rect.width > viewportWidth &&
      !diagnostics.some(
        (item) =>
          item.nodeId === node.nodeId &&
          item.code === "OF_RESPONSIVE_FIXED_WIDTH",
      )
    ) {
      diagnostics.push(
        diagnostic(
          node,
          "OF_RESPONSIVE_FIXED_WIDTH",
          "warning",
          `${node.label} has a fixed width larger than the viewport.`,
        ),
      );
    }
  }

  return diagnostics.sort(
    (left, right) =>
      left.nodeId.localeCompare(right.nodeId) ||
      left.code.localeCompare(right.code),
  );
}

export function getResponsiveEditorLayout({ hostWidth }) {
  requireHostWidth(hostWidth);
  if (hostWidth < 900) {
    return {
      mode: "review",
      readOnly: true,
      showLayerPanel: false,
      showInspector: false,
      showBottomPanel: false,
    };
  }
  if (hostWidth < 1180) {
    return {
      mode: "compact",
      readOnly: false,
      showLayerPanel: true,
      showInspector: false,
      showBottomPanel: true,
    };
  }
  return {
    mode: "editor",
    readOnly: false,
    showLayerPanel: true,
    showInspector: true,
    showBottomPanel: true,
  };
}

function diagnostic(node, code, severity, message) {
  return { code, severity, nodeId: node.nodeId, label: node.label, message };
}

function requireViewport(viewport) {
  if (!(viewport in VIEWPORT_PRESETS)) {
    throw new ResponsiveEditorError(
      "OF_RESPONSIVE_VIEWPORT_INVALID",
      `Unknown responsive viewport: "${viewport}".`,
    );
  }
}

function requireHostWidth(hostWidth) {
  if (!Number.isFinite(hostWidth) || hostWidth <= 0) {
    throw new ResponsiveEditorError(
      "OF_RESPONSIVE_HOST_WIDTH_INVALID",
      "Editor host width must be a positive finite number.",
    );
  }
}

function requireOverrideTarget({ nodeId, property, breakpoint }) {
  if (
    typeof nodeId !== "string" ||
    nodeId.length === 0 ||
    typeof property !== "string" ||
    property.length === 0 ||
    !BREAKPOINT_ORDER.includes(breakpoint)
  ) {
    throw new ResponsiveEditorError(
      "OF_RESPONSIVE_OVERRIDE_INVALID",
      "Responsive overrides require a node, property, and known breakpoint.",
    );
  }
}
