import { parse } from "@babel/parser";
import { OFFICIAL_CMS_BLOCKS } from "@openforge/cms-blocks";
import { buildProjectIndex } from "@openforge/compiler";

import { blockIdForComponentPath } from "./block-files.js";

const BLOCK_DEFINITIONS_BY_ID = new Map(
  OFFICIAL_CMS_BLOCKS.map((block) => [block.definition.id, block.definition]),
);

/**
 * Same parser profile as @openforge/compiler's internal parseJavaScript
 * (not exported publicly) — kept identical so the AST this walks lines up
 * with the ranges buildProjectIndex reports for the same source.
 */
function parseSource(filePath, source) {
  return parse(source, {
    errorRecovery: false,
    plugins: ["jsx"],
    sourceFilename: filePath,
    sourceType: "unambiguous",
  });
}

function jsxNameOf(nameNode) {
  if (nameNode.type === "JSXIdentifier") return nameNode.name;
  if (nameNode.type === "JSXMemberExpression") {
    return `${jsxNameOf(nameNode.object)}.${jsxNameOf(nameNode.property)}`;
  }
  return null;
}

/** Direct JSXElement children of a JSXElement/JSXFragment, skipping whitespace-only text and empty expression containers. */
function elementChildren(node) {
  return node.children.filter((child) => {
    if (child.type === "JSXElement") return true;
    if (child.type === "JSXText") return child.value.trim() !== "";
    return false;
  });
}

function resolveImportSpecifierPath(fromFilePath, specifier) {
  const fromDir = fromFilePath.includes("/")
    ? fromFilePath.slice(0, fromFilePath.lastIndexOf("/"))
    : "";
  const segments = [...fromDir.split("/"), ...specifier.split("/")].filter(
    (segment) => segment !== "" && segment !== ".",
  );

  const resolved = [];
  for (const segment of segments) {
    if (segment === "..") resolved.pop();
    else resolved.push(segment);
  }
  return resolved.join("/");
}

function findImportedLocalTargets(ast, filePath) {
  const targets = new Map();
  for (const statement of ast.program.body) {
    if (statement.type !== "ImportDeclaration") continue;
    const resolvedPath = resolveImportSpecifierPath(
      filePath,
      statement.source.value,
    );
    for (const specifier of statement.specifiers) {
      if (specifier.type === "ImportDefaultSpecifier") {
        targets.set(specifier.local.name, resolvedPath);
      }
    }
  }
  return targets;
}

/** Literal-only, mirroring the values @openforge/compiler's set-jsx-attribute can write. */
function extractProps(openingElement) {
  const props = {};
  for (const attribute of openingElement.attributes) {
    if (attribute.type !== "JSXAttribute") continue;
    const name = attribute.name.name;

    if (attribute.value === null) {
      props[name] = true;
    } else if (attribute.value.type === "StringLiteral") {
      props[name] = attribute.value.value;
    } else if (attribute.value.type === "JSXExpressionContainer") {
      const expression = attribute.value.expression;
      if (expression.type === "NullLiteral") props[name] = null;
      else if (
        ["StringLiteral", "NumericLiteral", "BooleanLiteral"].includes(
          expression.type,
        )
      ) {
        props[name] = expression.value;
      }
    }
  }
  return props;
}

/** The default-exported page component's returned JSX (function declaration or arrow with a block/expression body). */
function findPageRootJsx(ast) {
  const defaultExport = ast.program.body.find(
    (statement) => statement.type === "ExportDefaultDeclaration",
  );
  if (!defaultExport) return null;

  let fn = defaultExport.declaration;
  if (fn.type === "VariableDeclaration") {
    fn = fn.declarations[0]?.init;
  }
  if (
    !fn ||
    !["FunctionDeclaration", "ArrowFunctionExpression"].includes(fn.type)
  ) {
    return null;
  }

  if (fn.body.type === "JSXElement" || fn.body.type === "JSXFragment") {
    return fn.body;
  }
  if (fn.body.type !== "BlockStatement") return null;

  const returnStatement = fn.body.body.find(
    (statement) => statement.type === "ReturnStatement",
  );
  const argument = returnStatement?.argument;
  return argument?.type === "JSXElement" || argument?.type === "JSXFragment"
    ? argument
    : null;
}

/**
 * Parses one page file into the same `{blockId, blockVersion, props, slots}`
 * tree shape the canvas already renders, with each node's `id` set to the
 * exact node id @openforge/compiler's buildProjectIndex assigns that JSX
 * element — the id every editor/visual operation targets — so an id read
 * here can be handed straight back as an operation's `target.nodeId`.
 *
 * Only recognizes JSX elements that resolve (via a default import) to a
 * `components/openforge/<block-id>.jsx` file; anything else is skipped,
 * since a block-composed page is only ever built from the known library.
 *
 * @param {Array<{path: string, source: string}>} files
 * @param {string} pagePath
 * @returns {object[]}
 */
export function parsePageToBlockTree(files, pagePath) {
  const page = files.find((file) => file.path === pagePath);
  if (!page) {
    throw new Error(`Page not found in workspace: ${pagePath}`);
  }

  const index = buildProjectIndex({ files });
  const nodeIdByRange = new Map(
    index.nodes
      .filter((node) => node.filePath === pagePath && node.range)
      .map((node) => [`${node.range.start}:${node.range.end}`, node.id]),
  );

  const ast = parseSource(pagePath, page.source);
  const importTargets = findImportedLocalTargets(ast, pagePath);

  function buildNode(jsxElement) {
    if (jsxElement.type !== "JSXElement") return null;

    const tagName = jsxNameOf(jsxElement.openingElement.name);
    const targetPath = tagName ? importTargets.get(tagName) : null;
    const blockId = targetPath ? blockIdForComponentPath(targetPath) : null;
    const definition = blockId ? BLOCK_DEFINITIONS_BY_ID.get(blockId) : null;
    if (!definition) return null;

    const slots = {};
    if (definition.slots.length === 1) {
      const slotName = definition.slots[0].name;
      slots[slotName] = elementChildren(jsxElement)
        .map(buildNode)
        .filter(Boolean);
    }

    return {
      id: nodeIdByRange.get(`${jsxElement.start}:${jsxElement.end}`) ?? null,
      blockId,
      blockVersion: definition.version,
      props: extractProps(jsxElement.openingElement),
      slots,
    };
  }

  const root = findPageRootJsx(ast);
  if (!root) return [];

  // If the root JSX itself is a recognized block, the page is that one
  // block with no wrapper. Otherwise (the normal case: a <main> wrapper,
  // or a bare <>...</> fragment) its direct children are the top-level
  // blocks.
  const rootAsBlock = buildNode(root);
  if (rootAsBlock) return [rootAsBlock];
  return elementChildren(root).map(buildNode).filter(Boolean);
}

/**
 * The node id of a page's own root JSX element (its `<main>` wrapper, in
 * every page this app generates) — the insertion target for appending a
 * new top-level block, since a Fragment root can only be targeted with
 * "before"/"after", not "inside-end", leaving nowhere to insert into a
 * page that's been emptied down to zero blocks.
 *
 * @param {Array<{path: string, source: string}>} files
 * @param {string} pagePath
 * @returns {string}
 */
export function findPageRootNodeId(files, pagePath) {
  const page = files.find((file) => file.path === pagePath);
  if (!page) {
    throw new Error(`Page not found in workspace: ${pagePath}`);
  }

  const ast = parseSource(pagePath, page.source);
  const root = findPageRootJsx(ast);
  if (!root) {
    throw new Error(`Page has no JSX root: ${pagePath}`);
  }

  const index = buildProjectIndex({ files });
  const match = index.nodes.find(
    (node) =>
      node.filePath === pagePath &&
      node.range?.start === root.start &&
      node.range?.end === root.end,
  );
  if (!match) {
    throw new Error(`Could not resolve the page root's node id: ${pagePath}`);
  }
  return match.id;
}

/**
 * Finds one node (by the id parsePageToBlockTree assigned it) anywhere in
 * a block tree, including inside slots.
 *
 * @param {object[]} tree
 * @param {string} nodeId
 * @returns {object|null}
 */
export function findNodeById(tree, nodeId) {
  for (const node of tree) {
    if (node.id === nodeId) return node;
    for (const children of Object.values(node.slots ?? {})) {
      const match = findNodeById(children, nodeId);
      if (match) return match;
    }
  }
  return null;
}

/**
 * A node's position in a tree, independent of its (buildProjectIndex-
 * derived) id — adding an import shifts every later node's id in a file,
 * since a node's id is partly derived from its component's position among
 * the file's top-level statements. locateNodeAddress/resolveNodeAddress
 * bridge a node's identity across that kind of shift: capture the address
 * before a mutation that might renumber ids, then resolve it again after,
 * against a freshly re-parsed tree.
 *
 * @param {object[]} tree
 * @param {string} nodeId
 * @returns {Array<number|{slotName: string, index: number}>|null}
 */
export function locateNodeAddress(tree, nodeId) {
  for (let i = 0; i < tree.length; i += 1) {
    const address = searchFromNode(tree[i], nodeId, [i]);
    if (address) return address;
  }
  return null;
}

function searchFromNode(node, nodeId, address) {
  if (node.id === nodeId) return address;
  for (const [slotName, children] of Object.entries(node.slots ?? {})) {
    for (let i = 0; i < children.length; i += 1) {
      const found = searchFromNode(children[i], nodeId, [
        ...address,
        { slotName, index: i },
      ]);
      if (found) return found;
    }
  }
  return null;
}

/**
 * @param {object[]} tree
 * @param {Array<number|{slotName: string, index: number}>} address
 * @returns {object|null}
 */
export function resolveNodeAddress(tree, address) {
  if (!Array.isArray(address) || address.length === 0) return null;
  let node = tree[address[0]];
  for (let i = 1; i < address.length && node; i += 1) {
    node = node.slots?.[address[i].slotName]?.[address[i].index];
  }
  return node ?? null;
}
