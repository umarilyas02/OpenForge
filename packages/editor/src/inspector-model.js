import {
  defaultDesignTokenRegistry,
  validateStyleValue,
} from "@openforge/design-tokens";

export const INSPECTOR_VALUE_SOURCES = Object.freeze([
  "inherited",
  "global-token",
  "semantic-token",
  "local",
  "breakpoint",
]);

export const INSPECTOR_BREAKPOINTS = Object.freeze({
  base: 0,
  mobile: 390,
  tablet: 768,
  laptop: 1024,
  desktop: 1440,
});

export const INSPECTOR_CONTROLS = Object.freeze([
  control("content", "text", "Text", "text"),
  control("content", "href", "Link", "url"),
  control("content", "src", "Asset", "url"),
  control("content", "alt", "Alternative text", "text"),
  control("content", "visible", "Visible", "boolean"),
  control("layout", "display", "Display", "enum", [
    "block",
    "flex",
    "grid",
    "none",
  ]),
  control("layout", "flexDirection", "Direction", "enum", ["row", "column"]),
  control("layout", "justifyContent", "Justify", "enum", [
    "start",
    "center",
    "end",
    "space-between",
  ]),
  control("layout", "alignItems", "Align", "enum", [
    "start",
    "center",
    "end",
    "stretch",
  ]),
  control("layout", "gap", "Gap", "style"),
  control("spacing", "padding", "Padding", "style"),
  control("spacing", "paddingBlock", "Vertical padding", "style"),
  control("spacing", "paddingInline", "Horizontal padding", "style"),
  control("spacing", "margin", "Margin", "style"),
  control("size", "width", "Width", "style"),
  control("size", "height", "Height", "style"),
  control("size", "minWidth", "Minimum width", "style"),
  control("size", "maxWidth", "Maximum width", "style"),
  control("typography", "fontFamily", "Font", "style"),
  control("typography", "fontSize", "Font size", "style"),
  control("typography", "fontWeight", "Weight", "style"),
  control("typography", "lineHeight", "Line height", "style"),
  control("typography", "color", "Text color", "style"),
  control("background", "backgroundColor", "Background", "style"),
  control("border", "borderColor", "Border color", "style"),
  control("border", "borderRadius", "Radius", "style"),
]);

const controlsByProperty = new Map(
  INSPECTOR_CONTROLS.map((item) => [item.property, item]),
);

export class InspectorValueError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "InspectorValueError";
    this.code = code;
    this.details = details;
  }
}

export function createInspectorModel({
  selection,
  values,
  viewport = "desktop",
  tokenRegistry = defaultDesignTokenRegistry,
  files = [],
}) {
  if (!selection?.nodeId || !selection?.label) {
    throw new InspectorValueError(
      "OF_INSPECTOR_SELECTION_INVALID",
      "Inspector selection requires a node id and label.",
    );
  }
  if (!(viewport in INSPECTOR_BREAKPOINTS)) {
    throw new InspectorValueError(
      "OF_INSPECTOR_VIEWPORT_INVALID",
      `Unknown inspector viewport: "${viewport}".`,
    );
  }

  const normalized = values.map((input) =>
    createInspectorValue({ ...input, viewport, tokenRegistry, files }),
  );
  const groups = [];
  for (const group of [
    "content",
    "layout",
    "spacing",
    "size",
    "typography",
    "background",
    "border",
    "responsive",
  ]) {
    const controls = normalized.filter((item) => item.group === group);
    if (controls.length > 0) groups.push({ id: group, controls });
  }

  return {
    schemaVersion: 1,
    selection: structuredClone(selection),
    viewport,
    groups,
  };
}

export function createInspectorValue({
  property,
  value,
  source = "local",
  tokenName,
  inheritedFrom,
  breakpoints = {},
  viewport = "desktop",
  tokenRegistry = defaultDesignTokenRegistry,
  files = [],
}) {
  const controlDefinition = controlsByProperty.get(property);
  if (!controlDefinition) {
    throw new InspectorValueError(
      "OF_INSPECTOR_PROPERTY_UNSUPPORTED",
      `Unsupported inspector property: "${property}".`,
    );
  }
  if (!INSPECTOR_VALUE_SOURCES.includes(source)) {
    throw new InspectorValueError(
      "OF_INSPECTOR_SOURCE_INVALID",
      `Unsupported inspector value source: "${source}".`,
    );
  }
  validateBreakpoints(breakpoints);
  for (const breakpointValue of Object.values(breakpoints)) {
    validateControlValue(controlDefinition, breakpointValue);
  }

  const resolvedBreakpoint = resolveBreakpointValue({
    baseValue: value,
    breakpoints,
    viewport,
  });
  let displayedValue = resolvedBreakpoint.value;
  let token = null;
  let usage = null;

  if (["global-token", "semantic-token"].includes(source)) {
    if (!tokenName) {
      throw new InspectorValueError(
        "OF_INSPECTOR_TOKEN_REQUIRED",
        "Token-backed inspector values require a token name.",
      );
    }
    token = tokenRegistry.resolve(tokenName);
    validateControlValue(controlDefinition, token.resolvedValue);
    displayedValue = token.value;
    if (source === "global-token") {
      usage = tokenRegistry.planUpdate({
        name: tokenName,
        value: token.value,
        files,
      }).usage;
    }
  } else {
    validateControlValue(controlDefinition, displayedValue);
  }

  if (source === "inherited" && !inheritedFrom) {
    throw new InspectorValueError(
      "OF_INSPECTOR_INHERITANCE_INVALID",
      "Inherited values must name their source.",
    );
  }

  return {
    property,
    label: controlDefinition.label,
    group: controlDefinition.group,
    control: controlDefinition.control,
    options: controlDefinition.options,
    value: displayedValue,
    baseValue: value,
    source: resolvedBreakpoint.breakpoint === "base" ? source : "breakpoint",
    sourceDetail:
      resolvedBreakpoint.breakpoint === "base"
        ? (tokenName ?? inheritedFrom ?? "This element")
        : resolvedBreakpoint.breakpoint,
    token,
    usage,
    breakpoints: structuredClone(breakpoints),
  };
}

export function resolveBreakpointValue({ baseValue, breakpoints, viewport }) {
  if (!(viewport in INSPECTOR_BREAKPOINTS)) {
    throw new InspectorValueError(
      "OF_INSPECTOR_VIEWPORT_INVALID",
      `Unknown inspector viewport: "${viewport}".`,
    );
  }
  validateBreakpoints(breakpoints);
  const viewportWidth = INSPECTOR_BREAKPOINTS[viewport];
  const candidates = Object.entries(breakpoints)
    .filter(
      ([breakpoint]) =>
        breakpoint !== "base" &&
        INSPECTOR_BREAKPOINTS[breakpoint] <= viewportWidth,
    )
    .sort(
      ([left], [right]) =>
        INSPECTOR_BREAKPOINTS[right] - INSPECTOR_BREAKPOINTS[left],
    );
  const [breakpoint, value] = candidates[0] ?? ["base", baseValue];
  return { breakpoint, value };
}

export function planInspectorTokenUpdate({
  property,
  tokenName,
  value,
  files,
  tokenRegistry = defaultDesignTokenRegistry,
}) {
  const definition = controlsByProperty.get(property);
  if (!definition || definition.control !== "style") {
    throw new InspectorValueError(
      "OF_INSPECTOR_TOKEN_UNSUPPORTED",
      `Property "${property}" cannot use a design token.`,
    );
  }
  const plan = tokenRegistry.planUpdate({ name: tokenName, value, files });
  validateControlValue(definition, plan.resolvedValue);
  return {
    ...plan,
    warning:
      plan.usage.count === 0
        ? null
        : `This global change affects ${plan.usage.count} usage${
            plan.usage.count === 1 ? "" : "s"
          } across ${plan.usage.files.length} file${
            plan.usage.files.length === 1 ? "" : "s"
          }.`,
  };
}

function validateControlValue(definition, value) {
  if (definition.control === "style") {
    validateStyleValue({ property: definition.property, value });
    return;
  }
  if (definition.control === "boolean" && typeof value !== "boolean") {
    throw invalidValue(definition.property);
  }
  if (
    definition.control === "text" &&
    (typeof value !== "string" || hasUnsafeControlCharacters(value))
  ) {
    throw invalidValue(definition.property);
  }
  if (definition.control === "url") {
    if (
      typeof value !== "string" ||
      !/^(?:\/(?!\/)|#|https?:\/\/|mailto:|tel:)/iu.test(value)
    ) {
      throw invalidValue(definition.property);
    }
  }
  if (definition.control === "enum" && !definition.options.includes(value)) {
    throw invalidValue(definition.property);
  }
}

function hasUnsafeControlCharacters(value) {
  return [...value].some((character) => {
    const code = character.codePointAt(0);
    return code < 32 && ![9, 10, 13].includes(code);
  });
}

function validateBreakpoints(breakpoints) {
  if (
    !breakpoints ||
    typeof breakpoints !== "object" ||
    Array.isArray(breakpoints) ||
    Object.keys(breakpoints).some(
      (key) => key === "base" || !(key in INSPECTOR_BREAKPOINTS),
    )
  ) {
    throw new InspectorValueError(
      "OF_INSPECTOR_BREAKPOINT_INVALID",
      "Breakpoint overrides must use mobile, tablet, laptop, or desktop.",
    );
  }
}

function invalidValue(property) {
  return new InspectorValueError(
    "OF_INSPECTOR_VALUE_INVALID",
    `Invalid value for inspector property "${property}".`,
  );
}

function control(group, property, label, controlType, options = []) {
  return {
    group,
    property,
    label,
    control: controlType,
    options: Object.freeze(options),
  };
}
