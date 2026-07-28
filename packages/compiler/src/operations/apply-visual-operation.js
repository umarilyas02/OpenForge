import { createTwoFilesPatch } from "diff";
import MagicString from "magic-string";
import { VISITOR_KEYS } from "@babel/types";

import { parseJavaScript } from "../parser/parse-javascript.js";
import { normalizeProjectPath } from "../paths/normalize-project-path.js";
import { buildProjectIndex } from "../read/build-project-index.js";
import { withTemporaryProject } from "../workspace/with-temporary-project.js";
import { CompilerOperationError } from "./operation-schema.js";
import { parseVisualOperation } from "./visual-operation-schema.js";

/**
 * Apply a structural canvas or page operation to authoritative project source.
 */
export async function applyVisualOperation({
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

  const operation = parseVisualOperation(rawOperation);
  if (operation.baseRevision !== currentRevision) {
    throw new CompilerOperationError(
      "OF_OPERATION_STALE_REVISION",
      `Operation revision ${operation.baseRevision} does not match current revision ${currentRevision}.`,
    );
  }

  const normalizedFiles = normalizeFiles(files);
  const normalizedOperation =
    "filePath" in operation
      ? { ...operation, filePath: normalizeProjectPath(operation.filePath) }
      : operation;
  const transformed = transformProject(normalizedFiles, normalizedOperation);
  const formattedFiles = [];

  for (const file of transformed.files) {
    if (!transformed.changedPaths.has(file.path)) {
      formattedFiles.push(file);
      continue;
    }
    const source = await format({
      path: file.path,
      source: file.source,
      operation: normalizedOperation,
    });
    if (typeof source !== "string") {
      throw new CompilerOperationError(
        "OF_OPERATION_FORMAT_FAILED",
        "The formatter must return source as a string.",
      );
    }
    try {
      parseJavaScript({ filePath: file.path, source });
    } catch (error) {
      throw new CompilerOperationError(
        "OF_OPERATION_VALIDATION_FAILED",
        "The transformed source is not valid JavaScript or JSX.",
        { cause: error instanceof Error ? error.message : String(error) },
      );
    }
    formattedFiles.push({ ...file, source });
  }

  await withTemporaryProject(formattedFiles, async (workspacePath) => {
    for (const validator of validators) {
      try {
        await validator({
          workspacePath,
          files: formattedFiles,
          operation: normalizedOperation,
        });
      } catch (error) {
        throw new CompilerOperationError(
          "OF_OPERATION_VALIDATION_FAILED",
          "A temporary-workspace validator rejected the visual operation.",
          { cause: error instanceof Error ? error.message : String(error) },
        );
      }
    }
  });

  const previousByPath = new Map(
    normalizedFiles.map((file) => [file.path, file.source]),
  );
  const nextByPath = new Map(
    formattedFiles.map((file) => [file.path, file.source]),
  );
  const changedFiles = [...transformed.changedPaths].sort();
  const fileDiffs = changedFiles.map((path) => ({
    path,
    patch: createTwoFilesPatch(
      previousByPath.has(path) ? `a/${path}` : "/dev/null",
      nextByPath.has(path) ? `b/${path}` : "/dev/null",
      previousByPath.get(path) ?? "",
      nextByPath.get(path) ?? "",
      "before",
      "after",
      { context: 3 },
    ),
  }));
  const nextRevision = currentRevision + 1;

  return {
    changedFiles,
    fileDiffs,
    files: formattedFiles,
    inverseOperation: transformed.inverseOperation
      ? {
          ...transformed.inverseOperation,
          schemaVersion: normalizedOperation.schemaVersion,
          baseRevision: nextRevision,
        }
      : null,
    nextRevision,
    summary: transformed.summary,
  };
}

function transformProject(files, operation) {
  if (operation.type === "add-page") {
    return addPage(files, operation);
  }
  if (operation.type === "rename-page") {
    return renamePage(files, operation);
  }
  if (operation.type === "delete-page") {
    return deletePage(files, operation);
  }
  if (operation.type === "update-page-metadata") {
    return updatePageMetadata(files, operation);
  }

  const file = requireFile(files, operation.filePath);
  const index = buildProjectIndex({ files });
  const target = resolveTarget({
    filePath: operation.filePath,
    index,
    nodeId: operation.target.nodeId,
    source: file.source,
  });
  let result;

  if (operation.type === "insert-jsx") {
    result = insertJsx(file.source, target, operation.payload);
  } else if (operation.type === "remove-jsx") {
    result = removeJsx(file.source, target);
  } else if (operation.type === "duplicate-jsx") {
    result = duplicateJsx(file.source, target);
  } else if (operation.type === "move-jsx") {
    const destination = resolveTarget({
      filePath: operation.filePath,
      index,
      nodeId: operation.payload.destinationNodeId,
      source: file.source,
    });
    result = moveJsx(
      file.source,
      target,
      destination,
      operation.payload.position,
    );
  } else if (operation.type === "wrap-jsx") {
    result = wrapJsx(file.source, target, operation.payload);
  } else if (operation.type === "unwrap-jsx") {
    result = unwrapJsx(file.source, target);
  } else if (operation.type === "replace-asset") {
    result = replaceAsset(file.source, target, operation.payload);
  } else {
    result = changeLink(file.source, target, operation.payload);
  }

  if (result.source === file.source) {
    throw new CompilerOperationError(
      "OF_OPERATION_NO_CHANGE",
      "The visual operation did not change project source.",
    );
  }

  return {
    changedPaths: new Set([file.path]),
    files: files.map((candidate) =>
      candidate.path === file.path
        ? { ...candidate, source: result.source }
        : candidate,
    ),
    inverseOperation: null,
    summary: result.summary,
  };
}

function insertJsx(source, target, payload) {
  validateJsxFragment(payload.jsx);
  const insertionPoint = getInsertionPoint(target, payload.position);
  const editor = new MagicString(source);
  editor.appendLeft(insertionPoint, payload.jsx);
  return {
    source: editor.toString(),
    summary: `Inserted JSX ${formatPosition(payload.position)}.`,
  };
}

function removeJsx(source, target) {
  const editor = new MagicString(source);
  editor.remove(target.start, target.end);
  return { source: editor.toString(), summary: "Removed JSX element." };
}

function duplicateJsx(source, target) {
  const editor = new MagicString(source);
  editor.appendRight(target.end, source.slice(target.start, target.end));
  return { source: editor.toString(), summary: "Duplicated JSX element." };
}

function moveJsx(source, target, destination, position) {
  if (
    target.start === destination.start ||
    (destination.start > target.start && destination.end < target.end)
  ) {
    throw new CompilerOperationError(
      "OF_OPERATION_INVALID_DESTINATION",
      "A JSX element cannot move into itself or one of its descendants.",
    );
  }

  const insertionPoint = getInsertionPoint(destination, position);
  const snippet = source.slice(target.start, target.end);
  const withoutTarget =
    source.slice(0, target.start) + source.slice(target.end);
  const adjustedPoint =
    insertionPoint > target.end
      ? insertionPoint - (target.end - target.start)
      : insertionPoint;
  const nextSource =
    withoutTarget.slice(0, adjustedPoint) +
    snippet +
    withoutTarget.slice(adjustedPoint);

  return {
    source: nextSource,
    summary: `Moved JSX ${formatPosition(position)}.`,
  };
}

function wrapJsx(source, target, payload) {
  const attributes = Object.entries(payload.attributes)
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([name, value]) => ` ${renderAttribute(name, value)}`)
    .join("");
  const original = source.slice(target.start, target.end);
  const wrapped = `<${payload.element}${attributes}>${original}</${payload.element}>`;
  validateJsxFragment(wrapped);
  const editor = new MagicString(source);
  editor.overwrite(target.start, target.end, wrapped);
  return {
    source: editor.toString(),
    summary: `Wrapped JSX in <${payload.element}>.`,
  };
}

function unwrapJsx(source, target) {
  if (
    target.type !== "JSXElement" ||
    target.openingElement.selfClosing ||
    !target.closingElement
  ) {
    throw new CompilerOperationError(
      "OF_OPERATION_AMBIGUOUS",
      "Only a non-self-closing JSX element can be unwrapped.",
    );
  }
  const meaningfulChildren = target.children.filter(
    (child) => child.type !== "JSXText" || child.value.trim() !== "",
  );
  if (meaningfulChildren.length === 0) {
    throw new CompilerOperationError(
      "OF_OPERATION_AMBIGUOUS",
      "An empty JSX element cannot be unwrapped.",
    );
  }
  const editor = new MagicString(source);
  editor.remove(target.closingElement.start, target.closingElement.end);
  editor.remove(target.openingElement.start, target.openingElement.end);
  return { source: editor.toString(), summary: "Unwrapped JSX element." };
}

function replaceAsset(source, target, payload) {
  if (target.type !== "JSXElement") {
    throw targetNotFound();
  }
  const result = setLiteralAttributes(source, target, {
    src: payload.src,
    alt: payload.alt,
  });
  return { source: result, summary: "Replaced asset source and alt text." };
}

function changeLink(source, target, payload) {
  if (
    target.type !== "JSXElement" ||
    !["a", "Link"].includes(readJsxName(target.openingElement.name))
  ) {
    throw new CompilerOperationError(
      "OF_OPERATION_AMBIGUOUS",
      "Link changes require an <a> or <Link> target.",
    );
  }
  let result = setLiteralAttributes(source, target, { href: payload.href });

  if (payload.label !== undefined) {
    const reparsed = parseJavaScript({
      filePath: "components/Link.jsx",
      source: result,
    });
    const updatedTarget = findJsxByStart(reparsed, target.start);
    const meaningful = updatedTarget.children.filter(
      (child) => child.type !== "JSXText" || child.value.trim() !== "",
    );
    if (meaningful.length !== 1 || meaningful[0].type !== "JSXText") {
      throw new CompilerOperationError(
        "OF_OPERATION_AMBIGUOUS",
        "Link label editing requires one direct plain-text child.",
      );
    }
    const editor = new MagicString(result);
    editor.overwrite(
      meaningful[0].start,
      meaningful[0].end,
      escapeJsxText(payload.label),
    );
    result = editor.toString();
  }

  return { source: result, summary: "Changed link destination and label." };
}

function addPage(files, operation) {
  const pagePath = routeToPagePath(operation.payload.route);
  if (files.some(({ path }) => path === pagePath)) {
    throw new CompilerOperationError(
      "OF_OPERATION_FILE_EXISTS",
      `Page file "${pagePath}" already exists.`,
    );
  }
  const componentName = routeToComponentName(operation.payload.route);
  const source = `export const metadata = {
  title: ${JSON.stringify(operation.payload.title)},
  description: ${JSON.stringify(operation.payload.description)},
};

export default function ${componentName}() {
  return (
    <main>
      <h1>{${JSON.stringify(operation.payload.title)}}</h1>
    </main>
  );
}
`;
  return {
    changedPaths: new Set([pagePath]),
    files: [...files, { path: pagePath, source }].sort(comparePaths),
    inverseOperation: { type: "delete-page", filePath: pagePath },
    summary: `Added page route "${operation.payload.route}".`,
  };
}

function renamePage(files, operation) {
  const file = requirePageFile(files, operation.filePath);
  const nextPath = routeToPagePath(operation.payload.route);
  if (files.some(({ path }) => path === nextPath)) {
    throw new CompilerOperationError(
      "OF_OPERATION_FILE_EXISTS",
      `Page file "${nextPath}" already exists.`,
    );
  }
  return {
    changedPaths: new Set([file.path, nextPath]),
    files: files
      .map((candidate) =>
        candidate.path === file.path
          ? { ...candidate, path: nextPath }
          : candidate,
      )
      .sort(comparePaths),
    inverseOperation: {
      type: "rename-page",
      filePath: nextPath,
      payload: { route: pagePathToRoute(file.path) },
    },
    summary: `Renamed page route to "${operation.payload.route}".`,
  };
}

function deletePage(files, operation) {
  const file = requirePageFile(files, operation.filePath);
  return {
    changedPaths: new Set([file.path]),
    files: files.filter(({ path }) => path !== file.path),
    inverseOperation: null,
    summary: `Deleted page route "${pagePathToRoute(file.path)}".`,
  };
}

function updatePageMetadata(files, operation) {
  const file = requirePageFile(files, operation.filePath);
  const ast = parseJavaScript({ filePath: file.path, source: file.source });
  const metadata = findMetadataExport(ast);
  const rendered = `export const metadata = {
  title: ${JSON.stringify(operation.payload.title)},
  description: ${JSON.stringify(operation.payload.description)},
};`;
  const editor = new MagicString(file.source);

  if (metadata?.object) {
    updateMetadataProperty({
      editor,
      metadata: metadata.object,
      name: "title",
      source: file.source,
      value: operation.payload.title,
    });
    updateMetadataProperty({
      editor,
      metadata: metadata.object,
      name: "description",
      source: file.source,
      value: operation.payload.description,
    });
  } else if (metadata) {
    throw new CompilerOperationError(
      "OF_OPERATION_AMBIGUOUS",
      "Existing page metadata is not a plain object and cannot be edited safely.",
    );
  } else {
    const imports = ast.program.body.filter(
      ({ type }) => type === "ImportDeclaration",
    );
    const insertionPoint =
      imports.at(-1)?.end ?? ast.program.directives.at(-1)?.end ?? 0;
    editor.appendLeft(
      insertionPoint,
      `${insertionPoint ? "\n\n" : ""}${rendered}\n`,
    );
  }

  return {
    changedPaths: new Set([file.path]),
    files: files.map((candidate) =>
      candidate.path === file.path
        ? { ...candidate, source: editor.toString() }
        : candidate,
    ),
    inverseOperation: null,
    summary: `Updated metadata for route "${pagePathToRoute(file.path)}".`,
  };
}

function updateMetadataProperty({ editor, metadata, name, source, value }) {
  const matches = metadata.properties.filter((property) => {
    if (property.type !== "ObjectProperty" || property.computed) return false;
    return (
      (property.key.type === "Identifier" && property.key.name === name) ||
      (property.key.type === "StringLiteral" && property.key.value === name)
    );
  });
  if (matches.length > 1) {
    throw new CompilerOperationError(
      "OF_OPERATION_AMBIGUOUS",
      `Page metadata contains duplicate "${name}" fields.`,
    );
  }
  if (matches.length === 1) {
    if (matches[0].value.type !== "StringLiteral") {
      throw new CompilerOperationError(
        "OF_OPERATION_AMBIGUOUS",
        `Page metadata "${name}" must be a string literal for visual editing.`,
      );
    }
    editor.overwrite(
      matches[0].value.start,
      matches[0].value.end,
      JSON.stringify(value),
    );
    return;
  }

  const lastProperty = metadata.properties.at(-1);
  const hasTrailingComma =
    lastProperty &&
    source.slice(lastProperty.end, metadata.end - 1).includes(",");
  const prefix =
    metadata.properties.length === 0 || hasTrailingComma ? "" : ",";
  editor.appendLeft(
    metadata.end - 1,
    `${prefix}\n  ${name}: ${JSON.stringify(value)},\n`,
  );
}

function setLiteralAttributes(source, target, requested) {
  const editor = new MagicString(source);
  const additions = [];

  for (const [name, value] of Object.entries(requested)) {
    const matches = target.openingElement.attributes.filter(
      (attribute) =>
        attribute.type === "JSXAttribute" &&
        attribute.name.type === "JSXIdentifier" &&
        attribute.name.name === name,
    );
    if (matches.length > 1) {
      throw new CompilerOperationError(
        "OF_OPERATION_AMBIGUOUS",
        `Multiple JSX attributes named "${name}" cannot be edited safely.`,
      );
    }
    if (matches.length === 1) {
      editor.overwrite(
        matches[0].start,
        matches[0].end,
        renderAttribute(name, value),
      );
    } else {
      additions.push(renderAttribute(name, value));
    }
  }

  if (additions.length > 0) {
    const point =
      target.openingElement.end - (target.openingElement.selfClosing ? 2 : 1);
    editor.appendLeft(point, ` ${additions.join(" ")}`);
  }
  return editor.toString();
}

function validateJsxFragment(jsx) {
  try {
    const ast = parseJavaScript({
      filePath: "components/OpenForgeFragment.jsx",
      source: `export function OpenForgeFragment() { return <>${jsx}</>; }`,
    });
    const fragment = findFirst(ast, ({ type }) => type === "JSXFragment");
    const meaningful = fragment.children.filter(
      (child) => child.type !== "JSXText" || child.value.trim() !== "",
    );
    if (meaningful.length !== 1) {
      throw new Error("Expected one JSX child.");
    }
  } catch (error) {
    throw new CompilerOperationError(
      "OF_OPERATION_INVALID_JSX",
      "Inserted JSX must contain exactly one valid JSX child.",
      { cause: error instanceof Error ? error.message : String(error) },
    );
  }
}

function resolveTarget({ filePath, index, nodeId, source }) {
  const indexed = index.nodes.find(
    (node) => node.id === nodeId && node.filePath === filePath,
  );
  if (!indexed) {
    throw targetNotFound();
  }
  const ast = parseJavaScript({ filePath, source });
  const matches = [];
  walk(ast, (node) => {
    if (
      ["JSXElement", "JSXFragment"].includes(node.type) &&
      node.start === indexed.range?.start &&
      node.end === indexed.range?.end
    ) {
      matches.push(node);
    }
  });
  if (matches.length !== 1) {
    throw targetNotFound();
  }
  return matches[0];
}

function getInsertionPoint(target, position) {
  if (position === "before") return target.start;
  if (position === "after") return target.end;
  if (
    target.type !== "JSXElement" ||
    target.openingElement.selfClosing ||
    !target.closingElement
  ) {
    throw new CompilerOperationError(
      "OF_OPERATION_INVALID_DESTINATION",
      "Inside insertion requires a non-self-closing JSX element.",
    );
  }
  return position === "inside-start"
    ? target.openingElement.end
    : target.closingElement.start;
}

function findMetadataExport(ast) {
  for (const node of ast.program.body) {
    if (node.type !== "ExportNamedDeclaration") continue;
    const declaration = node.declaration;
    if (declaration?.type !== "VariableDeclaration") continue;
    for (const item of declaration.declarations) {
      if (item.id.type !== "Identifier" || item.id.name !== "metadata")
        continue;
      return {
        declaration: node,
        object: item.init?.type === "ObjectExpression" ? item.init : null,
      };
    }
  }
  return null;
}

function routeToPagePath(route) {
  return route === "/" ? "app/page.jsx" : `app${route}/page.jsx`;
}

function pagePathToRoute(pagePath) {
  if (pagePath === "app/page.jsx") return "/";
  return `/${pagePath.slice(4, -9)}`;
}

function routeToComponentName(route) {
  if (route === "/") return "HomePage";
  const name = route
    .slice(1)
    .split("/")
    .flatMap((part) => part.split("-"))
    .map((part) => `${part[0].toUpperCase()}${part.slice(1)}`)
    .join("");
  return `${name}Page`;
}

function requirePageFile(files, filePath) {
  const file = requireFile(files, filePath);
  if (!/^app(?:\/[^/]+)*\/page\.jsx$/u.test(file.path)) {
    throw new CompilerOperationError(
      "OF_OPERATION_NOT_PAGE",
      `"${file.path}" is not a supported App Router page file.`,
    );
  }
  return file;
}

function requireFile(files, filePath) {
  const file = files.find((candidate) => candidate.path === filePath);
  if (!file) {
    throw new CompilerOperationError(
      "OF_OPERATION_FILE_NOT_FOUND",
      `Operation file "${filePath}" does not exist.`,
    );
  }
  return file;
}

function normalizeFiles(files) {
  if (!Array.isArray(files)) throw new TypeError("files must be an array.");
  const normalized = files
    .map(({ path, source }) => ({
      path: normalizeProjectPath(path),
      source,
    }))
    .sort(comparePaths);
  const seen = new Set();
  for (const file of normalized) {
    if (seen.has(file.path)) {
      throw new CompilerOperationError(
        "OF_PATH_DUPLICATE",
        `Duplicate project path: "${file.path}".`,
      );
    }
    seen.add(file.path);
  }
  return normalized;
}

function renderAttribute(name, value) {
  if (value === true) return name;
  if (typeof value === "string") return `${name}=${JSON.stringify(value)}`;
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

function readJsxName(node) {
  if (node?.type === "JSXIdentifier") return node.name;
  if (node?.type === "JSXMemberExpression") {
    return `${readJsxName(node.object)}.${readJsxName(node.property)}`;
  }
  return "";
}

function findJsxByStart(ast, start) {
  return findFirst(
    ast,
    (node) =>
      ["JSXElement", "JSXFragment"].includes(node.type) && node.start === start,
  );
}

function findFirst(ast, predicate) {
  let found = null;
  walk(ast, (node) => {
    if (!found && predicate(node)) found = node;
  });
  return found;
}

function walk(node, visit) {
  if (!node || typeof node.type !== "string") return;
  visit(node);
  for (const key of VISITOR_KEYS[node.type] ?? []) {
    const value = node[key];
    if (Array.isArray(value)) value.forEach((child) => walk(child, visit));
    else walk(value, visit);
  }
}

function targetNotFound() {
  return new CompilerOperationError(
    "OF_OPERATION_TARGET_NOT_FOUND",
    "The visual operation target is missing, ambiguous, or code-only.",
  );
}

function comparePaths(left, right) {
  return left.path.localeCompare(right.path);
}

function formatPosition(position) {
  return position.replace("-", " ");
}
