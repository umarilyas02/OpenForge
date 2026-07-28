import { createTwoFilesPatch } from "diff";
import MagicString from "magic-string";
import { VISITOR_KEYS } from "@babel/types";

import { parseJavaScript } from "../parser/parse-javascript.js";
import { normalizeProjectPath } from "../paths/normalize-project-path.js";
import { buildProjectIndex } from "../read/build-project-index.js";
import { withTemporaryProject } from "../workspace/with-temporary-project.js";
import {
  CompilerOperationError,
  parseEditorOperation,
} from "./operation-schema.js";

/**
 * Apply one validated editor operation without mutating input files.
 *
 * @param {{
 *   files: Array<{ path: string, source: string }>,
 *   operation: unknown,
 *   currentRevision: number,
 *   format?: (input: {
 *     path: string,
 *     source: string,
 *     operation: object
 *   }) => Promise<string> | string,
 *   validators?: Array<(input: {
 *     workspacePath: string,
 *     files: Array<{ path: string, source: string }>,
 *     operation: object
 *   }) => Promise<void> | void>
 * }} input
 * @returns {Promise<{
 *   changedFiles: string[],
 *   fileDiffs: Array<{ path: string, patch: string }>,
 *   files: Array<{ path: string, source: string }>,
 *   inverseOperation: object | null,
 *   nextRevision: number,
 *   summary: string
 * }>}
 */
export async function applyEditorOperation({
  files,
  operation: rawOperation,
  currentRevision,
  format = ({ source }) => source,
  validators = [],
}) {
  if (!Number.isInteger(currentRevision) || currentRevision < 0) {
    throw new TypeError("currentRevision must be a non-negative integer.");
  }
  if (typeof format !== "function") {
    throw new TypeError("format must be a function.");
  }
  if (
    !Array.isArray(validators) ||
    validators.some((validator) => typeof validator !== "function")
  ) {
    throw new TypeError("validators must be an array of functions.");
  }

  const operation = parseEditorOperation(rawOperation);
  if (operation.baseRevision !== currentRevision) {
    throw new CompilerOperationError(
      "OF_OPERATION_STALE_REVISION",
      `Operation revision ${operation.baseRevision} does not match current revision ${currentRevision}.`,
      {
        baseRevision: operation.baseRevision,
        currentRevision,
      },
    );
  }

  const normalizedFilePath = normalizeProjectPath(operation.filePath);
  const normalizedFiles = normalizeAndSortFiles(files);
  const file = normalizedFiles.find(({ path }) => path === normalizedFilePath);

  if (!file) {
    throw new CompilerOperationError(
      "OF_OPERATION_FILE_NOT_FOUND",
      `Operation file "${normalizedFilePath}" does not exist.`,
      { filePath: normalizedFilePath },
    );
  }

  const index = buildProjectIndex({ files: normalizedFiles });
  const transformation = transformSource({
    index,
    operation: { ...operation, filePath: normalizedFilePath },
    source: file.source,
  });
  let nextSource = transformation.source;

  nextSource = await format({
    path: normalizedFilePath,
    source: nextSource,
    operation,
  });
  if (typeof nextSource !== "string") {
    throw new CompilerOperationError(
      "OF_OPERATION_FORMAT_FAILED",
      "The formatter must return source as a string.",
    );
  }
  if (nextSource === file.source) {
    throw new CompilerOperationError(
      "OF_OPERATION_NO_CHANGE",
      "The operation did not change project source.",
    );
  }

  try {
    parseJavaScript({ filePath: normalizedFilePath, source: nextSource });
  } catch (error) {
    throw new CompilerOperationError(
      "OF_OPERATION_VALIDATION_FAILED",
      "The transformed source is not valid JavaScript or JSX.",
      { cause: error instanceof Error ? error.message : String(error) },
    );
  }

  const nextFiles = normalizedFiles.map((candidate) =>
    candidate.path === normalizedFilePath
      ? { ...candidate, source: nextSource }
      : candidate,
  );

  await withTemporaryProject(nextFiles, async (workspacePath) => {
    for (const validator of validators) {
      try {
        await validator({
          workspacePath,
          files: nextFiles,
          operation,
        });
      } catch (error) {
        throw new CompilerOperationError(
          "OF_OPERATION_VALIDATION_FAILED",
          "A temporary-workspace validator rejected the operation.",
          { cause: error instanceof Error ? error.message : String(error) },
        );
      }
    }
  });

  const nextRevision = currentRevision + 1;
  const inverseOperation = transformation.inverseOperation
    ? {
        ...transformation.inverseOperation,
        schemaVersion: operation.schemaVersion,
        baseRevision: nextRevision,
        filePath: normalizedFilePath,
      }
    : null;

  return {
    changedFiles: [normalizedFilePath],
    fileDiffs: [
      {
        path: normalizedFilePath,
        patch: createTwoFilesPatch(
          `a/${normalizedFilePath}`,
          `b/${normalizedFilePath}`,
          file.source,
          nextSource,
          "before",
          "after",
          { context: 3 },
        ),
      },
    ],
    files: nextFiles,
    inverseOperation,
    nextRevision,
    summary: transformation.summary,
  };
}

function transformSource({ index, operation, source }) {
  if (operation.type === "add-import") {
    return addImport({ operation, source });
  }

  const indexedNode = index.nodes.find(
    ({ id, filePath }) =>
      id === operation.target.nodeId && filePath === operation.filePath,
  );
  if (!indexedNode) {
    throw new CompilerOperationError(
      "OF_OPERATION_TARGET_NOT_FOUND",
      "The operation target is missing, ambiguous, or unavailable in code-only source.",
      {
        filePath: operation.filePath,
        nodeId: operation.target.nodeId,
      },
    );
  }

  const ast = parseJavaScript({
    filePath: operation.filePath,
    source,
  });
  const target = findJsxNode(ast, indexedNode.range);
  if (!target || target.type !== "JSXElement") {
    throw new CompilerOperationError(
      "OF_OPERATION_TARGET_NOT_FOUND",
      "The indexed JSX target could not be located uniquely.",
    );
  }

  if (operation.type === "replace-jsx-text") {
    return replaceJsxText({ operation, source, target });
  }
  if (operation.type === "set-jsx-attribute") {
    return setJsxAttribute({ operation, source, target });
  }
  return removeJsxAttribute({ operation, source, target });
}

function setJsxAttribute({ operation, source, target }) {
  const matches = findAttributes(target, operation.payload.name);
  if (matches.length > 1) {
    throw ambiguousAttribute(operation.payload.name);
  }

  const editor = new MagicString(source);
  const renderedAttribute = renderAttribute(
    operation.payload.name,
    operation.payload.value,
  );
  let inverseOperation;

  if (matches.length === 1) {
    const attribute = matches[0];
    const previousValue = readLiteralAttributeValue(attribute);
    editor.overwrite(attribute.start, attribute.end, renderedAttribute);
    inverseOperation =
      previousValue.supported === true
        ? {
            type: "set-jsx-attribute",
            target: operation.target,
            payload: {
              name: operation.payload.name,
              value: previousValue.value,
            },
          }
        : null;
  } else {
    const insertionPoint =
      target.openingElement.end - (target.openingElement.selfClosing ? 2 : 1);
    editor.appendLeft(insertionPoint, ` ${renderedAttribute}`);
    inverseOperation = {
      type: "remove-jsx-attribute",
      target: operation.target,
      payload: { name: operation.payload.name },
    };
  }

  return {
    source: editor.toString(),
    inverseOperation,
    summary: `Set JSX attribute "${operation.payload.name}".`,
  };
}

function removeJsxAttribute({ operation, source, target }) {
  const matches = findAttributes(target, operation.payload.name);
  if (matches.length > 1) {
    throw ambiguousAttribute(operation.payload.name);
  }
  if (matches.length === 0) {
    throw new CompilerOperationError(
      "OF_OPERATION_NO_CHANGE",
      `JSX attribute "${operation.payload.name}" does not exist.`,
    );
  }

  const attribute = matches[0];
  const previousValue = readLiteralAttributeValue(attribute);
  const editor = new MagicString(source);
  let removalStart = attribute.start;

  while (
    removalStart > target.openingElement.name.end &&
    /\s/u.test(source[removalStart - 1])
  ) {
    removalStart -= 1;
  }
  editor.remove(removalStart, attribute.end);

  return {
    source: editor.toString(),
    inverseOperation:
      previousValue.supported === true
        ? {
            type: "set-jsx-attribute",
            target: operation.target,
            payload: {
              name: operation.payload.name,
              value: previousValue.value,
            },
          }
        : null,
    summary: `Removed JSX attribute "${operation.payload.name}".`,
  };
}

function replaceJsxText({ operation, source, target }) {
  const meaningfulChildren = target.children.filter(
    (child) => child.type !== "JSXText" || child.value.trim() !== "",
  );
  if (
    meaningfulChildren.length !== 1 ||
    meaningfulChildren[0].type !== "JSXText"
  ) {
    throw new CompilerOperationError(
      "OF_OPERATION_AMBIGUOUS",
      "Text replacement requires exactly one direct plain-text child.",
    );
  }

  const textNode = meaningfulChildren[0];
  const editor = new MagicString(source);
  editor.overwrite(
    textNode.start,
    textNode.end,
    escapeJsxText(operation.payload.text),
  );

  return {
    source: editor.toString(),
    inverseOperation:
      source.slice(textNode.start, textNode.end) ===
      escapeJsxText(textNode.value)
        ? {
            type: "replace-jsx-text",
            target: operation.target,
            payload: { text: textNode.value },
          }
        : null,
    summary: "Replaced JSX text content.",
  };
}

function addImport({ operation, source }) {
  const ast = parseJavaScript({ filePath: operation.filePath, source });
  const imports = ast.program.body.filter(
    (node) =>
      node.type === "ImportDeclaration" &&
      node.source.value === operation.payload.source,
  );
  if (imports.length > 1) {
    throw new CompilerOperationError(
      "OF_OPERATION_AMBIGUOUS",
      `Multiple imports from "${operation.payload.source}" cannot be merged safely.`,
    );
  }

  const editor = new MagicString(source);
  if (imports.length === 1) {
    const declaration = imports[0];
    if (
      declaration.attributes?.length > 0 ||
      declaration.assertions?.length > 0
    ) {
      throw new CompilerOperationError(
        "OF_OPERATION_AMBIGUOUS",
        "Imports with attributes or assertions are not rewritten automatically.",
      );
    }
    if (
      ast.comments?.some(
        (comment) =>
          comment.start > declaration.start && comment.end < declaration.end,
      )
    ) {
      throw new CompilerOperationError(
        "OF_OPERATION_AMBIGUOUS",
        "Imports containing inline comments are not rewritten automatically.",
      );
    }

    const nextSpecifiers = mergeImportSpecifiers(
      declaration.specifiers,
      operation.payload,
    );
    const rendered = renderImportDeclaration({
      payload: operation.payload,
      source,
      declaration,
      specifiers: nextSpecifiers,
    });
    editor.overwrite(declaration.start, declaration.end, rendered);
  } else {
    const rendered = renderImportDeclaration({
      payload: operation.payload,
      source,
      declaration: null,
      specifiers: [],
    });
    const existingImports = ast.program.body.filter(
      ({ type }) => type === "ImportDeclaration",
    );
    const lastImport = existingImports.at(-1);
    const lastDirective = ast.program.directives.at(-1);
    const insertionPoint = lastImport?.end ?? lastDirective?.end ?? 0;
    const prefix = insertionPoint === 0 ? "" : "\n";
    const suffix = source.length === 0 || insertionPoint === 0 ? "\n" : "";
    editor.appendLeft(insertionPoint, `${prefix}${rendered}${suffix}`);
  }

  return {
    source: editor.toString(),
    inverseOperation: null,
    summary: `Added ${operation.payload.importKind} import from "${operation.payload.source}".`,
  };
}

function mergeImportSpecifiers(specifiers, payload) {
  const normalized = specifiers.map(normalizeImportSpecifier);
  const requested = requestedImportSpecifier(payload);

  if (
    payload.importKind === "side-effect" ||
    normalized.some(
      (specifier) =>
        specifier.kind === requested.kind &&
        specifier.imported === requested.imported &&
        specifier.local === requested.local,
    )
  ) {
    throw new CompilerOperationError(
      "OF_OPERATION_NO_CHANGE",
      "The requested import already exists.",
    );
  }

  if (
    (requested.kind === "namespace" &&
      normalized.some(({ kind }) => kind === "named")) ||
    (requested.kind === "named" &&
      normalized.some(({ kind }) => kind === "namespace"))
  ) {
    throw new CompilerOperationError(
      "OF_OPERATION_AMBIGUOUS",
      "Namespace and named imports cannot be merged safely.",
    );
  }

  if (
    requested.kind === "default" &&
    normalized.some(({ kind }) => kind === "default")
  ) {
    throw new CompilerOperationError(
      "OF_OPERATION_AMBIGUOUS",
      "The import already has a default binding.",
    );
  }

  return [...normalized, requested];
}

function normalizeImportSpecifier(specifier) {
  if (specifier.type === "ImportDefaultSpecifier") {
    return {
      kind: "default",
      imported: "default",
      local: specifier.local.name,
    };
  }
  if (specifier.type === "ImportNamespaceSpecifier") {
    return { kind: "namespace", imported: "*", local: specifier.local.name };
  }

  return {
    kind: "named",
    imported:
      specifier.imported.type === "Identifier"
        ? specifier.imported.name
        : specifier.imported.value,
    local: specifier.local.name,
  };
}

function requestedImportSpecifier(payload) {
  return {
    kind: payload.importKind,
    imported:
      payload.importKind === "named"
        ? payload.imported
        : payload.importKind === "default"
          ? "default"
          : payload.importKind === "namespace"
            ? "*"
            : null,
    local:
      payload.local ??
      (payload.importKind === "named" ? payload.imported : null),
  };
}

function renderImportDeclaration({ payload, source, declaration, specifiers }) {
  const quote =
    declaration && source[declaration.source.start] === "'" ? "'" : '"';
  const semicolon =
    !declaration ||
    source.slice(declaration.start, declaration.end).endsWith(";")
      ? ";"
      : "";
  const sourceLiteral = `${quote}${payload.source}${quote}`;

  if (payload.importKind === "side-effect" && !declaration) {
    return `import ${sourceLiteral}${semicolon}`;
  }

  const finalSpecifiers =
    declaration === null ? [requestedImportSpecifier(payload)] : specifiers;
  const defaultSpecifier = finalSpecifiers.find(
    ({ kind }) => kind === "default",
  );
  const namespaceSpecifier = finalSpecifiers.find(
    ({ kind }) => kind === "namespace",
  );
  const namedSpecifiers = finalSpecifiers.filter(
    ({ kind }) => kind === "named",
  );
  const groups = [];

  if (defaultSpecifier) {
    groups.push(defaultSpecifier.local);
  }
  if (namespaceSpecifier) {
    groups.push(`* as ${namespaceSpecifier.local}`);
  }
  if (namedSpecifiers.length > 0) {
    groups.push(
      `{ ${namedSpecifiers
        .map(({ imported, local }) =>
          imported === local ? imported : `${imported} as ${local}`,
        )
        .join(", ")} }`,
    );
  }

  return `import ${groups.join(", ")} from ${sourceLiteral}${semicolon}`;
}

function findAttributes(target, name) {
  return target.openingElement.attributes.filter(
    (attribute) =>
      attribute.type === "JSXAttribute" &&
      attribute.name.type === "JSXIdentifier" &&
      attribute.name.name === name,
  );
}

function readLiteralAttributeValue(attribute) {
  if (attribute.value === null) {
    return { supported: true, value: true };
  }
  if (attribute.value.type === "StringLiteral") {
    return { supported: true, value: attribute.value.value };
  }
  if (attribute.value.type !== "JSXExpressionContainer") {
    return { supported: false };
  }

  const expression = attribute.value.expression;
  if (expression.type === "NullLiteral") {
    return { supported: true, value: null };
  }
  if (
    ["BooleanLiteral", "NumericLiteral", "StringLiteral"].includes(
      expression.type,
    )
  ) {
    return { supported: true, value: expression.value };
  }
  return { supported: false };
}

function renderAttribute(name, value) {
  if (value === true) {
    return name;
  }
  if (typeof value === "string") {
    return `${name}=${JSON.stringify(value)}`;
  }
  return `${name}={${value === null ? "null" : String(value)}}`;
}

function escapeJsxText(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("{", "&#123;")
    .replaceAll("}", "&#125;");
}

function findJsxNode(ast, range) {
  const matches = [];
  walk(ast, (node) => {
    if (
      (node.type === "JSXElement" || node.type === "JSXFragment") &&
      node.start === range?.start &&
      node.end === range?.end
    ) {
      matches.push(node);
    }
  });
  return matches.length === 1 ? matches[0] : null;
}

function walk(node, visit) {
  if (!node || typeof node.type !== "string") {
    return;
  }
  visit(node);
  for (const key of VISITOR_KEYS[node.type] ?? []) {
    const value = node[key];
    if (Array.isArray(value)) {
      value.forEach((child) => walk(child, visit));
    } else {
      walk(value, visit);
    }
  }
}

function normalizeAndSortFiles(files) {
  if (!Array.isArray(files)) {
    throw new TypeError("files must be an array.");
  }
  return files
    .map((file) => ({
      path: normalizeProjectPath(file.path),
      source: file.source,
    }))
    .sort((left, right) => left.path.localeCompare(right.path));
}

function ambiguousAttribute(name) {
  return new CompilerOperationError(
    "OF_OPERATION_AMBIGUOUS",
    `Multiple JSX attributes named "${name}" cannot be edited safely.`,
  );
}
