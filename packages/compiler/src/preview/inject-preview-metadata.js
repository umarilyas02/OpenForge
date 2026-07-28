import MagicString from "magic-string";
import { VISITOR_KEYS } from "@babel/types";

import { CompilerOperationError } from "../operations/operation-schema.js";
import { parseJavaScript } from "../parser/parse-javascript.js";
import { buildProjectIndex } from "../read/build-project-index.js";

const RESERVED_PREFIX = "data-openforge-";

/**
 * Inject development-only source mapping attributes into host JSX elements.
 *
 * @param {{ filePath: string, source: string }} input
 * @returns {{ source: string, mappedNodeIds: string[] }}
 */
export function injectPreviewMetadata({ filePath, source }) {
  const index = buildProjectIndex({
    files: [{ path: filePath, source }],
  });
  const file = index.files[0];
  if (file.compatibility === "code-only") {
    return { source, mappedNodeIds: [] };
  }

  const ast = parseJavaScript({ filePath: file.path, source });
  assertNoReservedMetadata(ast);
  const nodesByRange = new Map(
    index.nodes.map((node) => [`${node.range.start}:${node.range.end}`, node]),
  );
  const editor = new MagicString(source);
  const mappedNodeIds = [];

  walk(ast, (node) => {
    if (
      node.type !== "JSXElement" ||
      node.openingElement.name.type !== "JSXIdentifier" ||
      !/^[a-z]/u.test(node.openingElement.name.name)
    ) {
      return;
    }
    const indexedNode = nodesByRange.get(`${node.start}:${node.end}`);
    if (!indexedNode) return;

    const attributes = [
      ["node", indexedNode.id],
      ["file", indexedNode.filePath],
      ["component", indexedNode.componentId],
      ["source", `${indexedNode.range.start}:${indexedNode.range.end}`],
    ]
      .map(
        ([name, value]) =>
          ` ${RESERVED_PREFIX}${name}="${escapeAttribute(value)}"`,
      )
      .join("");
    editor.appendLeft(node.openingElement.name.end, attributes);
    mappedNodeIds.push(indexedNode.id);
  });

  return {
    source: editor.toString(),
    mappedNodeIds,
  };
}

function assertNoReservedMetadata(ast) {
  walk(ast, (node) => {
    if (node.type !== "JSXAttribute") return;
    const name =
      node.name.type === "JSXIdentifier" ? node.name.name.toLowerCase() : "";
    if (name.startsWith(RESERVED_PREFIX)) {
      throw new CompilerOperationError(
        "OF_PREVIEW_METADATA_RESERVED",
        `Source cannot declare reserved attribute "${name}".`,
      );
    }
  });
}

function escapeAttribute(value) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function walk(node, visit) {
  if (!node || typeof node.type !== "string") return;
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
