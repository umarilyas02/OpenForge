import { parse } from "@babel/parser";
import { VISITOR_KEYS } from "@babel/types";

export const COMPATIBILITY_LEVELS = Object.freeze({
  CODE_ONLY: "code-only",
  PARTIAL: "partial",
  SUPPORTED: "supported",
});

const LEVEL_WEIGHT = Object.freeze({
  [COMPATIBILITY_LEVELS.SUPPORTED]: 0,
  [COMPATIBILITY_LEVELS.PARTIAL]: 1,
  [COMPATIBILITY_LEVELS.CODE_ONLY]: 2,
});

/**
 * Analyze JavaScript or JSX without modifying the supplied source.
 *
 * This first compatibility pass deliberately recognizes only high-confidence
 * unsafe patterns. Operation-specific write confidence is handled separately.
 *
 * @param {{ filePath: string, source: string }} input
 * @returns {{
 *   diagnostics: Array<{
 *     code: string,
 *     level: "partial" | "code-only",
 *     message: string,
 *     location: { line: number, column: number } | null
 *   }>,
 *   filePath: string,
 *   level: "supported" | "partial" | "code-only"
 * }}
 */
export function analyzeSourceCompatibility({ filePath, source }) {
  assertInput(filePath, source);

  let ast;

  try {
    ast = parse(source, {
      errorRecovery: false,
      plugins: ["jsx"],
      sourceFilename: filePath,
      sourceType: "unambiguous",
    });
  } catch (error) {
    return {
      diagnostics: [
        createDiagnostic({
          code: "OF_COMPAT_PARSE_ERROR",
          level: COMPATIBILITY_LEVELS.CODE_ONLY,
          message:
            error instanceof Error
              ? error.message
              : "Source could not be parsed.",
          node: error,
        }),
      ],
      filePath,
      level: COMPATIBILITY_LEVELS.CODE_ONLY,
    };
  }

  const diagnostics = [];

  walk(ast, null, (node, parent) => {
    if (isNonLiteralDynamicImport(node)) {
      diagnostics.push(
        createDiagnostic({
          code: "OF_COMPAT_DYNAMIC_IMPORT",
          level: COMPATIBILITY_LEVELS.PARTIAL,
          message:
            "Dynamic imports must use a string literal to be mapped safely.",
          node,
        }),
      );
    }

    if (
      node.type === "CallExpression" &&
      node.callee?.type === "MemberExpression" &&
      node.callee.computed === false &&
      node.callee.object?.type === "Identifier" &&
      node.callee.object.name === "React" &&
      node.callee.property?.type === "Identifier" &&
      node.callee.property.name === "createElement"
    ) {
      diagnostics.push(
        createDiagnostic({
          code: "OF_COMPAT_RUNTIME_ELEMENT",
          level: COMPATIBILITY_LEVELS.CODE_ONLY,
          message:
            "Runtime-generated React elements are available in code-only mode.",
          node,
        }),
      );
    }

    if (
      isFunction(node) &&
      node.body?.type === "BlockStatement" &&
      node.body.body.some(
        (statement) =>
          statement.type === "ReturnStatement" &&
          isFunction(statement.argument),
      )
    ) {
      diagnostics.push(
        createDiagnostic({
          code: "OF_COMPAT_COMPONENT_FACTORY",
          level: COMPATIBILITY_LEVELS.CODE_ONLY,
          message:
            "Component factories cannot be mapped safely to the visual model.",
          node,
        }),
      );
    }

    if (
      node.type === "ConditionalExpression" &&
      containsJsx(node) &&
      parent?.type === "ConditionalExpression"
    ) {
      diagnostics.push(
        createDiagnostic({
          code: "OF_COMPAT_COMPLEX_CONDITIONAL",
          level: COMPATIBILITY_LEVELS.PARTIAL,
          message: "Nested conditional JSX is only partially supported.",
          node,
        }),
      );
    }
  });

  return {
    diagnostics,
    filePath,
    level: diagnostics.reduce(
      (level, diagnostic) =>
        LEVEL_WEIGHT[diagnostic.level] > LEVEL_WEIGHT[level]
          ? diagnostic.level
          : level,
      COMPATIBILITY_LEVELS.SUPPORTED,
    ),
  };
}

function assertInput(filePath, source) {
  if (typeof filePath !== "string" || filePath.length === 0) {
    throw new TypeError("filePath must be a non-empty string.");
  }

  if (typeof source !== "string") {
    throw new TypeError("source must be a string.");
  }
}

function containsJsx(node) {
  let found = false;

  walk(node, null, (child) => {
    if (
      child !== node &&
      (child.type === "JSXElement" || child.type === "JSXFragment")
    ) {
      found = true;
    }
  });

  return found;
}

function createDiagnostic({ code, level, message, node }) {
  const position = node?.loc?.start;

  return {
    code,
    level,
    message,
    location:
      typeof position?.line === "number" && typeof position?.column === "number"
        ? { line: position.line, column: position.column }
        : null,
  };
}

function isFunction(node) {
  return (
    node?.type === "ArrowFunctionExpression" ||
    node?.type === "FunctionDeclaration" ||
    node?.type === "FunctionExpression"
  );
}

function isNonLiteralDynamicImport(node) {
  if (node?.type === "ImportExpression") {
    return node.source?.type !== "StringLiteral";
  }

  return (
    node?.type === "CallExpression" &&
    node.callee?.type === "Import" &&
    node.arguments[0]?.type !== "StringLiteral"
  );
}

function walk(node, parent, visit) {
  if (!node || typeof node.type !== "string") {
    return;
  }

  visit(node, parent);

  for (const key of VISITOR_KEYS[node.type] ?? []) {
    const value = node[key];

    if (Array.isArray(value)) {
      for (const child of value) {
        walk(child, node, visit);
      }
    } else {
      walk(value, node, visit);
    }
  }
}
