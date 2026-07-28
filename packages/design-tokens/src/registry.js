import { parseDesignTokenCollection, TOKEN_TYPES } from "./schema.js";

const REFERENCE_PATTERN = /^\{([a-z][a-z0-9]*(?:\.[a-z0-9][a-z0-9-]*)+)\}$/u;
const UNSAFE_CSS_PATTERN = /[;{}]|url\s*\(|expression\s*\(|@import/iu;

export class DesignTokenError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "DesignTokenError";
    this.code = code;
    this.details = details;
  }
}

export function createDesignTokenRegistry(collection) {
  const parsed = parseDesignTokenCollection(collection);
  const tokens = [...parsed.tokens].sort((left, right) =>
    left.name.localeCompare(right.name),
  );
  const byName = new Map();
  const byVariable = new Map();

  for (const token of tokens) {
    if (byName.has(token.name) || byVariable.has(token.cssVariable)) {
      throw new DesignTokenError(
        "OF_TOKEN_DUPLICATE",
        `Duplicate token name or CSS variable: "${token.name}".`,
      );
    }
    byName.set(token.name, token);
    byVariable.set(token.cssVariable, token);
  }
  for (const token of tokens) resolveToken(token.name, byName, []);

  return Object.freeze({
    list() {
      return structuredClone(tokens);
    },

    get(name) {
      return structuredClone(requireToken(byName, name));
    },

    resolve(name) {
      return structuredClone(resolveToken(name, byName, []));
    },

    toCss() {
      return `:root {\n${tokens
        .map((token) => {
          const reference = readReference(token.value);
          const value = reference
            ? `var(${requireToken(byName, reference).cssVariable})`
            : token.value;
          return `  ${token.cssVariable}: ${value};`;
        })
        .join("\n")}\n}\n`;
    },

    planUpdate({ name, value, files = [] }) {
      const token = requireToken(byName, name);
      validateTokenValue({ type: token.type, value, tokens: byName });
      const usage = collectTokenUsage({ files, tokens: [token] });
      return {
        token: structuredClone(token),
        nextValue: value,
        resolvedValue: readReference(value)
          ? resolveToken(readReference(value), byName, []).resolvedValue
          : value,
        usage,
      };
    },
  });
}

export function validateTokenValue({ type, value, tokens }) {
  if (!TOKEN_TYPES.includes(type) || typeof value !== "string") {
    throw new DesignTokenError(
      "OF_TOKEN_VALUE_INVALID",
      "Token type and string value are required.",
    );
  }
  const reference = readReference(value);
  if (reference) {
    const referenced =
      tokens instanceof Map
        ? requireToken(tokens, reference)
        : tokens?.find((token) => token.name === reference);
    if (!referenced || referenced.type !== type) {
      throw new DesignTokenError(
        "OF_TOKEN_REFERENCE_INVALID",
        `Token reference "${reference}" is missing or has a different type.`,
      );
    }
    return value;
  }
  if (UNSAFE_CSS_PATTERN.test(value) || !matchesType(type, value.trim())) {
    throw new DesignTokenError(
      "OF_TOKEN_VALUE_UNSAFE",
      `Value is not a safe ${type} token value.`,
      { type, value },
    );
  }
  return value;
}

export function validateStyleValue({ property, value }) {
  const type = inferPropertyType(property);
  if (!type) {
    throw new DesignTokenError(
      "OF_STYLE_PROPERTY_UNSUPPORTED",
      `Unsupported visual property: "${property}".`,
    );
  }
  return validateTokenValue({ type, value, tokens: [] });
}

export function collectTokenUsage({ files, tokens }) {
  const normalizedTokens = [...tokens].sort((left, right) =>
    left.name.localeCompare(right.name),
  );
  const usages = [];

  for (const file of [...files].sort((left, right) =>
    left.path.localeCompare(right.path),
  )) {
    for (const token of normalizedTokens) {
      const needles = [
        `{${token.name}}`,
        `var(${token.cssVariable})`,
        token.name,
      ];
      const seenOffsets = new Set();
      for (const needle of needles) {
        let offset = file.source.indexOf(needle);
        while (offset !== -1) {
          if (!seenOffsets.has(offset)) {
            seenOffsets.add(offset);
            const before = file.source.slice(0, offset);
            const lines = before.split("\n");
            usages.push({
              token: token.name,
              filePath: file.path,
              line: lines.length,
              column: lines.at(-1).length,
            });
          }
          offset = file.source.indexOf(needle, offset + needle.length);
        }
      }
    }
  }

  usages.sort(
    (left, right) =>
      left.token.localeCompare(right.token) ||
      left.filePath.localeCompare(right.filePath) ||
      left.line - right.line ||
      left.column - right.column,
  );
  return {
    count: usages.length,
    files: [...new Set(usages.map(({ filePath }) => filePath))],
    locations: usages,
  };
}

function resolveToken(name, byName, stack) {
  const token = requireToken(byName, name);
  if (stack.includes(name)) {
    throw new DesignTokenError(
      "OF_TOKEN_REFERENCE_CYCLE",
      `Token reference cycle: ${[...stack, name].join(" -> ")}.`,
    );
  }
  validateTokenValue({ type: token.type, value: token.value, tokens: byName });
  const reference = readReference(token.value);
  if (!reference) return { ...token, resolvedValue: token.value };
  const resolved = resolveToken(reference, byName, [...stack, name]);
  return { ...token, resolvedValue: resolved.resolvedValue };
}

function requireToken(byName, name) {
  const token = byName.get(name);
  if (!token) {
    throw new DesignTokenError(
      "OF_TOKEN_NOT_FOUND",
      `Unknown design token: "${name}".`,
    );
  }
  return token;
}

function readReference(value) {
  return value.match(REFERENCE_PATTERN)?.[1] ?? null;
}

function inferPropertyType(property) {
  if (
    ["color", "backgroundColor", "borderColor", "outlineColor"].includes(
      property,
    )
  ) {
    return "color";
  }
  if (
    /^(?:margin|padding|gap|width|height|minWidth|maxWidth|minHeight|maxHeight)/u.test(
      property,
    )
  ) {
    return "dimension";
  }
  if (property === "borderRadius") return "radius";
  if (property === "fontFamily") return "font-family";
  if (property === "fontSize") return "font-size";
  if (property === "fontWeight") return "font-weight";
  if (property === "lineHeight") return "line-height";
  if (property === "boxShadow") return "shadow";
  return null;
}

function matchesType(type, value) {
  if (type === "color") {
    return (
      /^#[\da-f]{3,8}$/iu.test(value) ||
      /^(?:rgb|hsl|oklch)\([\d\s.,%/+.-]+\)$/iu.test(value) ||
      ["transparent", "currentColor"].includes(value)
    );
  }
  if (["dimension", "font-size", "radius"].includes(type)) {
    return (
      value === "0" ||
      /^-?(?:\d+|\d*\.\d+)(?:px|rem|em|%|vw|vh|ch)$/u.test(value)
    );
  }
  if (type === "font-weight") {
    return /^(?:[1-9]00|normal|bold)$/u.test(value);
  }
  if (type === "line-height") {
    return (
      /^(?:\d+|\d*\.\d+)$/u.test(value) ||
      /^-?(?:\d+|\d*\.\d+)(?:px|rem|em|%)$/u.test(value)
    );
  }
  if (type === "font-family") {
    return /^[\w\s"',-]+$/u.test(value);
  }
  if (type === "shadow") {
    return value.length <= 256 && /^[\w\s.,%#/()+-]+$/u.test(value);
  }
  return false;
}
