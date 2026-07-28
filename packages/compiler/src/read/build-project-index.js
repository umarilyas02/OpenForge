import { createHash } from "node:crypto";
import path from "node:path";

import { VISITOR_KEYS } from "@babel/types";

import {
  COMPATIBILITY_LEVELS,
  analyzeSourceCompatibility,
} from "../compatibility/analyze-source.js";
import { parseJavaScript } from "../parser/parse-javascript.js";
import { normalizeProjectPath } from "../paths/normalize-project-path.js";

const SOURCE_EXTENSIONS = Object.freeze([".js", ".jsx"]);

/**
 * Build a deterministic, disposable index from authoritative project source.
 *
 * @param {{ files: Array<{ path: string, source: string }> }} input
 * @returns {{
 *   schemaVersion: 1,
 *   files: Array<object>,
 *   components: Array<object>,
 *   nodes: Array<object>,
 *   dependencies: Array<object>,
 *   diagnostics: Array<object>
 * }}
 */
export function buildProjectIndex({ files }) {
  if (!Array.isArray(files)) {
    throw new TypeError("files must be an array.");
  }

  const normalizedFiles = normalizeFiles(files);
  const knownPaths = new Set(normalizedFiles.map((file) => file.path));
  const indexedFiles = [];
  const components = [];
  const nodes = [];
  const dependencies = [];
  const diagnostics = [];

  for (const file of normalizedFiles) {
    const compatibility = analyzeSourceCompatibility({
      filePath: file.path,
      source: file.source,
    });
    const fileComponentIds = [];
    const fileNodeIds = [];
    const fileDependencyIds = [];

    diagnostics.push(
      ...compatibility.diagnostics.map((diagnostic) => ({
        ...diagnostic,
        filePath: file.path,
      })),
    );

    if (compatibility.diagnostics[0]?.code !== "OF_COMPAT_PARSE_ERROR") {
      const ast = parseJavaScript({
        filePath: file.path,
        source: file.source,
      });
      const fileIndex = indexAst({
        ast,
        filePath: file.path,
        knownPaths,
      });

      dependencies.push(...fileIndex.dependencies);
      fileDependencyIds.push(...fileIndex.dependencies.map(({ id }) => id));

      if (compatibility.level !== COMPATIBILITY_LEVELS.CODE_ONLY) {
        components.push(...fileIndex.components);
        nodes.push(...fileIndex.nodes);
        fileComponentIds.push(...fileIndex.components.map(({ id }) => id));
        fileNodeIds.push(...fileIndex.nodes.map(({ id }) => id));
      }
    }

    indexedFiles.push({
      path: file.path,
      compatibility: compatibility.level,
      componentIds: fileComponentIds,
      nodeIds: fileNodeIds,
      dependencyIds: fileDependencyIds,
    });
  }

  return {
    schemaVersion: 1,
    files: indexedFiles,
    components: sortById(components),
    nodes: sortById(nodes),
    dependencies: sortById(dependencies),
    diagnostics: sortDiagnostics(diagnostics),
  };
}

function normalizeFiles(files) {
  const seenPaths = new Set();
  const seenCaseInsensitivePaths = new Map();

  const normalizedFiles = files.map((file, index) => {
    if (!file || typeof file !== "object") {
      throw new TypeError(`files[${index}] must be an object.`);
    }

    if (typeof file.source !== "string") {
      throw new TypeError(`files[${index}].source must be a string.`);
    }

    const normalizedPath = normalizeProjectPath(file.path);
    const caseInsensitivePath = normalizedPath.toLocaleLowerCase("en-US");

    if (seenPaths.has(normalizedPath)) {
      throw new DuplicateProjectPathError(normalizedPath);
    }

    const conflictingPath = seenCaseInsensitivePaths.get(caseInsensitivePath);
    if (conflictingPath) {
      throw new DuplicateProjectPathError(
        normalizedPath,
        `Project paths "${conflictingPath}" and "${normalizedPath}" collide on case-insensitive filesystems.`,
      );
    }

    seenPaths.add(normalizedPath);
    seenCaseInsensitivePaths.set(caseInsensitivePath, normalizedPath);

    return {
      path: normalizedPath,
      source: file.source,
    };
  });

  return normalizedFiles.sort((left, right) =>
    left.path.localeCompare(right.path),
  );
}

function indexAst({ ast, filePath, knownPaths }) {
  const components = [];
  const nodes = [];
  const dependencies = [];
  const dependencyKeys = new Set();
  const nodeCounts = new Map();

  visitNode({
    ancestors: [],
    astPath: "program",
    currentComponent: null,
    filePath,
    knownPaths,
    node: ast.program,
    onComponent(component) {
      components.push(component);
    },
    onDependency(dependency) {
      const key = `${dependency.kind}:${dependency.specifier}:${dependency.location?.line ?? 0}:${dependency.location?.column ?? 0}`;
      if (!dependencyKeys.has(key)) {
        dependencyKeys.add(key);
        dependencies.push(dependency);
      }
    },
    onNode(indexedNode) {
      nodes.push(indexedNode);
    },
    nextNodeOrdinal(componentId) {
      const ordinal = nodeCounts.get(componentId) ?? 0;
      nodeCounts.set(componentId, ordinal + 1);
      return ordinal;
    },
  });

  return { components, dependencies, nodes };
}

function visitNode(context) {
  const { node } = context;
  if (!node || typeof node.type !== "string") {
    return;
  }

  const componentDescriptor = getComponentDescriptor(
    node,
    context.ancestors,
    context.filePath,
    context.astPath,
  );
  const currentComponent = componentDescriptor ?? context.currentComponent;

  if (componentDescriptor) {
    context.onComponent(componentDescriptor);
  }

  const dependency = getDependency(
    node,
    context.filePath,
    context.knownPaths,
    context.astPath,
  );
  if (dependency) {
    context.onDependency(dependency);
  }

  if (
    currentComponent &&
    (node.type === "JSXElement" || node.type === "JSXFragment")
  ) {
    context.onNode(
      createJsxNode({
        astPath: context.astPath,
        component: currentComponent,
        filePath: context.filePath,
        node,
        ordinal: context.nextNodeOrdinal(currentComponent.id),
      }),
    );
  }

  for (const key of VISITOR_KEYS[node.type] ?? []) {
    const value = node[key];
    if (Array.isArray(value)) {
      value.forEach((child, index) =>
        visitNode({
          ...context,
          ancestors: [...context.ancestors, node],
          astPath: `${context.astPath}.${key}.${index}`,
          currentComponent,
          node: child,
        }),
      );
    } else {
      visitNode({
        ...context,
        ancestors: [...context.ancestors, node],
        astPath: `${context.astPath}.${key}`,
        currentComponent,
        node: value,
      });
    }
  }
}

function getComponentDescriptor(node, ancestors, filePath, astPath) {
  if (!isFunction(node) || !containsJsx(node)) {
    return null;
  }

  const parent = ancestors.at(-1);
  let name = node.id?.name ?? null;

  if (
    !name &&
    parent?.type === "VariableDeclarator" &&
    parent.id?.type === "Identifier"
  ) {
    name = parent.id.name;
  }

  if (!name && parent?.type === "ExportDefaultDeclaration") {
    name = "default";
  }

  if (!name || (name !== "default" && !/^[A-Z]/u.test(name))) {
    return null;
  }

  const exported = ancestors.some((ancestor) =>
    ["ExportDefaultDeclaration", "ExportNamedDeclaration"].includes(
      ancestor.type,
    ),
  );
  const id = stableId("component", `${filePath}:${name}:${astPath}`);

  return {
    id,
    filePath,
    name,
    exported,
    async: node.async === true,
    location: getLocation(node),
    range: getRange(node),
  };
}

function createJsxNode({ component, filePath, node, ordinal }) {
  const openingElement =
    node.type === "JSXElement" ? node.openingElement : null;
  const element = openingElement ? getJsxName(openingElement.name) : "Fragment";

  return {
    id: stableId("node", `${filePath}:${component.id}:${element}:${ordinal}`),
    componentId: component.id,
    filePath,
    element,
    location: getLocation(node),
    range: getRange(node),
  };
}

function getDependency(node, filePath, knownPaths, astPath) {
  let kind = null;
  let sourceNode = null;

  if (node.type === "ImportDeclaration") {
    kind = "static-import";
    sourceNode = node.source;
  } else if (
    (node.type === "ExportNamedDeclaration" ||
      node.type === "ExportAllDeclaration") &&
    node.source
  ) {
    kind = "re-export";
    sourceNode = node.source;
  } else if (
    node.type === "ImportExpression" &&
    node.source?.type === "StringLiteral"
  ) {
    kind = "dynamic-import";
    sourceNode = node.source;
  }

  if (!kind || sourceNode?.type !== "StringLiteral") {
    return null;
  }

  const specifier = sourceNode.value;
  const external = !specifier.startsWith(".");
  const target = external
    ? null
    : resolveProjectImport(filePath, specifier, knownPaths);

  return {
    id: stableId("dependency", `${filePath}:${kind}:${specifier}:${astPath}`),
    filePath,
    kind,
    specifier,
    external,
    resolved: external || target !== null,
    target,
    location: getLocation(sourceNode),
  };
}

function resolveProjectImport(filePath, specifier, knownPaths) {
  const basePath = path.posix.normalize(
    path.posix.join(path.posix.dirname(filePath), specifier),
  );

  if (basePath === ".." || basePath.startsWith("../")) {
    return null;
  }

  const candidates = [
    basePath,
    ...SOURCE_EXTENSIONS.map((extension) => `${basePath}${extension}`),
    ...SOURCE_EXTENSIONS.map((extension) =>
      path.posix.join(basePath, `index${extension}`),
    ),
  ];

  return candidates.find((candidate) => knownPaths.has(candidate)) ?? null;
}

function containsJsx(node) {
  if (!node || typeof node.type !== "string") {
    return false;
  }

  if (node.type === "JSXElement" || node.type === "JSXFragment") {
    return true;
  }

  return (VISITOR_KEYS[node.type] ?? []).some((key) => {
    const value = node[key];
    return Array.isArray(value)
      ? value.some((child) => containsJsx(child))
      : containsJsx(value);
  });
}

function getJsxName(node) {
  if (node?.type === "JSXIdentifier") {
    return node.name;
  }

  if (node?.type === "JSXMemberExpression") {
    return `${getJsxName(node.object)}.${getJsxName(node.property)}`;
  }

  if (node?.type === "JSXNamespacedName") {
    return `${getJsxName(node.namespace)}:${getJsxName(node.name)}`;
  }

  return "Unknown";
}

function getLocation(node) {
  return node?.loc?.start
    ? { line: node.loc.start.line, column: node.loc.start.column }
    : null;
}

function getRange(node) {
  return Number.isInteger(node?.start) && Number.isInteger(node?.end)
    ? { start: node.start, end: node.end }
    : null;
}

function isFunction(node) {
  return [
    "ArrowFunctionExpression",
    "FunctionDeclaration",
    "FunctionExpression",
  ].includes(node?.type);
}

function stableId(prefix, value) {
  return `${prefix}_${createHash("sha256").update(value).digest("hex").slice(0, 16)}`;
}

function sortById(values) {
  return values.sort((left, right) => left.id.localeCompare(right.id));
}

function sortDiagnostics(values) {
  return values.sort(
    (left, right) =>
      left.filePath.localeCompare(right.filePath) ||
      (left.location?.line ?? 0) - (right.location?.line ?? 0) ||
      left.code.localeCompare(right.code),
  );
}

export class DuplicateProjectPathError extends Error {
  constructor(
    projectPath,
    message = `Duplicate project path: "${projectPath}".`,
  ) {
    super(message);
    this.name = "DuplicateProjectPathError";
    this.code = "OF_PATH_DUPLICATE";
    this.projectPath = projectPath;
  }
}
