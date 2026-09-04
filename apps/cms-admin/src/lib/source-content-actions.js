import { OFFICIAL_CMS_BLOCKS } from "@openforge/cms-blocks";
import {
  CompilerOperationError,
  applyEditorOperation,
  applyVisualOperation,
} from "@openforge/compiler";

import {
  componentPathForBlock,
  readStandaloneBlockSource,
  standaloneFileNameForBlock,
} from "./block-files.js";
import { getWorkspaceManager } from "./site-workspace.js";
import {
  findNodeById,
  findPageRootNodeId,
  locateNodeAddress,
  parsePageToBlockTree,
  resolveNodeAddress,
} from "./source-content-tree.js";

const BLOCK_DEFINITIONS_BY_ID = new Map(
  OFFICIAL_CMS_BLOCKS.map((block) => [block.definition.id, block.definition]),
);

function requireDefinition(blockId) {
  const definition = BLOCK_DEFINITIONS_BY_ID.get(blockId);
  if (!definition) throw new Error(`Unknown block id: ${blockId}`);
  return definition;
}

function renderAttribute(name, value) {
  if (value === true) return name;
  if (typeof value === "string") return `${name}=${JSON.stringify(value)}`;
  return `${name}={${value === null ? "null" : String(value)}}`;
}

function kebabToPascalCase(kebab) {
  return kebab
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

/**
 * Always non-self-closing, even with no default-prop attributes and no
 * children: a self-closing element can never be targeted with
 * "inside-start"/"inside-end" (see @openforge/compiler's
 * apply-visual-operation.js getInsertionPoint), which would leave no way
 * to later insert the first item into this block's own slot.
 */
function renderBlockJsx(definition, localName) {
  const attributes = Object.entries(definition.defaultProps ?? {})
    .map(([name, value]) => ` ${renderAttribute(name, value)}`)
    .join("");
  return `<${localName}${attributes}></${localName}>`;
}

async function loadWorkspace(siteSlug) {
  const manager = getWorkspaceManager();
  const [state, files] = await Promise.all([
    manager.describe(siteSlug),
    manager.readFiles(siteSlug),
  ]);
  return { manager, state, files };
}

function requireFileSource(files, path) {
  const file = files.find((candidate) => candidate.path === path);
  if (!file) throw new Error(`File not found after operation: ${path}`);
  return file.source;
}

/**
 * Applies a prop-edit from BlockPropsForm — diffs against the block's
 * current (parsed-from-source) props and issues one set-jsx-attribute per
 * changed key, chained through the compiler's own local revision counter,
 * then commits the final source with a single workspace saveFile.
 */
export async function setBlockProps(siteSlug, pagePath, nodeId, nextProps) {
  const { manager, state, files } = await loadWorkspace(siteSlug);
  const tree = parsePageToBlockTree(files, pagePath);
  const node = findNodeById(tree, nodeId);
  if (!node) throw new Error(`Block not found: ${nodeId}`);

  const changedKeys = Object.keys(nextProps).filter(
    (key) => nextProps[key] !== node.props[key],
  );
  if (changedKeys.length === 0) return;

  let revision = 0;
  let opFiles = files;
  for (const key of changedKeys) {
    const result = await applyEditorOperation({
      files: opFiles,
      currentRevision: revision,
      operation: {
        schemaVersion: 1,
        baseRevision: revision,
        filePath: pagePath,
        type: "set-jsx-attribute",
        target: { nodeId },
        payload: { name: key, value: nextProps[key] },
      },
    });
    opFiles = result.files;
    revision = result.nextRevision;
  }

  await manager.saveFile(siteSlug, {
    baseRevision: state.revision,
    path: pagePath,
    source: requireFileSource(opFiles, pagePath),
  });
}

/** A drag reorder or ↑/↓ move: relocates one block relative to another. */
export async function moveBlock(
  siteSlug,
  pagePath,
  movedNodeId,
  destinationNodeId,
  position,
) {
  const { manager, state, files } = await loadWorkspace(siteSlug);
  const result = await applyVisualOperation({
    files,
    currentRevision: 0,
    operation: {
      schemaVersion: 1,
      baseRevision: 0,
      filePath: pagePath,
      type: "move-jsx",
      target: { nodeId: movedNodeId },
      payload: { destinationNodeId, position },
    },
  });

  await manager.saveFile(siteSlug, {
    baseRevision: state.revision,
    path: pagePath,
    source: requireFileSource(result.files, pagePath),
  });
}

export async function removeBlock(siteSlug, pagePath, nodeId) {
  const { manager, state, files } = await loadWorkspace(siteSlug);
  const result = await applyVisualOperation({
    files,
    currentRevision: 0,
    operation: {
      schemaVersion: 1,
      baseRevision: 0,
      filePath: pagePath,
      type: "remove-jsx",
      target: { nodeId },
    },
  });

  await manager.saveFile(siteSlug, {
    baseRevision: state.revision,
    path: pagePath,
    source: requireFileSource(result.files, pagePath),
  });
}

/**
 * Copies blockId's component file into the site (if this is the first time
 * it's used there) and makes sure pagePath imports it, persisting each as
 * its own workspace save. Returns the import's local binding name.
 *
 * Adding an import shifts the position of every top-level statement after
 * it, which changes every node id buildProjectIndex assigns for the rest
 * of that file (a node's id is derived partly from its component's
 * position among the file's top-level statements). Persisting this as a
 * standalone step — before any node is targeted for this insertion — means
 * a tree read afterward reflects final, stable ids.
 */
export async function ensureBlockAvailable(siteSlug, pagePath, blockId) {
  requireDefinition(blockId);
  const manager = getWorkspaceManager();

  let state = await manager.describe(siteSlug);
  let files = await manager.readFiles(siteSlug);

  const componentPath = componentPathForBlock(blockId);
  if (!files.some((file) => file.path === componentPath)) {
    const source = await readStandaloneBlockSource(blockId);
    await manager.saveFile(siteSlug, {
      baseRevision: state.revision,
      path: componentPath,
      source,
    });
    state = await manager.describe(siteSlug);
    files = await manager.readFiles(siteSlug);
  }

  const kebab = standaloneFileNameForBlock(blockId).replace(/\.jsx$/u, "");
  const localName = kebabToPascalCase(kebab);
  const depth = pagePath.split("/").length - 1;
  const specifier = `${"../".repeat(depth)}${componentPath}`;

  try {
    const result = await applyEditorOperation({
      files,
      currentRevision: 0,
      operation: {
        schemaVersion: 1,
        baseRevision: 0,
        filePath: pagePath,
        type: "add-import",
        payload: { source: specifier, importKind: "default", local: localName },
      },
    });
    await manager.saveFile(siteSlug, {
      baseRevision: state.revision,
      path: pagePath,
      source: requireFileSource(result.files, pagePath),
    });
  } catch (error) {
    // Already imported on this page under the same convention-derived
    // name — nothing to persist.
    if (
      !(error instanceof CompilerOperationError) ||
      error.code !== "OF_OPERATION_NO_CHANGE"
    ) {
      throw error;
    }
  }

  return { localName };
}

/**
 * Adds a new block instance (with its definition's default props) as the
 * last child of `containerNodeId` — the page's own root node (see
 * findPageRootNodeId) for a top-level insert from the palette, or a
 * slot-bearing block's own node id for inserting into that block's slot.
 *
 * `containerNodeId` must be current as of this call (read from a tree
 * fetched after any prior save — never reused across two calls in a row).
 * Internally, this locates the container by structural address before
 * ensureBlockAvailable runs and re-resolves it after, since adding an
 * import (the first time a block type is used on this page) shifts every
 * other node id in the file — but that only protects this one call; a
 * second insertBlock call still needs its own fresh containerNodeId.
 */
export async function insertBlock(
  siteSlug,
  pagePath,
  blockId,
  containerNodeId,
) {
  const definition = requireDefinition(blockId);
  const manager = getWorkspaceManager();

  const beforeFiles = await manager.readFiles(siteSlug);
  const isRoot = containerNodeId === findPageRootNodeId(beforeFiles, pagePath);
  const address = isRoot
    ? null
    : locateNodeAddress(
        parsePageToBlockTree(beforeFiles, pagePath),
        containerNodeId,
      );
  if (!isRoot && !address) {
    throw new Error(`Container not found: ${containerNodeId}`);
  }

  const { localName } = await ensureBlockAvailable(siteSlug, pagePath, blockId);

  const state = await manager.describe(siteSlug);
  const files = await manager.readFiles(siteSlug);
  const resolvedContainerNodeId = isRoot
    ? findPageRootNodeId(files, pagePath)
    : resolveNodeAddress(parsePageToBlockTree(files, pagePath), address)?.id;
  if (!resolvedContainerNodeId) {
    throw new Error(
      `Container no longer resolvable after ensuring block availability: ${containerNodeId}`,
    );
  }

  const result = await applyVisualOperation({
    files,
    currentRevision: 0,
    operation: {
      schemaVersion: 1,
      baseRevision: 0,
      filePath: pagePath,
      type: "insert-jsx",
      target: { nodeId: resolvedContainerNodeId },
      payload: {
        jsx: renderBlockJsx(definition, localName),
        position: "inside-end",
      },
    },
  });

  await manager.saveFile(siteSlug, {
    baseRevision: state.revision,
    path: pagePath,
    source: requireFileSource(result.files, pagePath),
  });
}

/** Convenience for the common case: append a new top-level block to a page. */
export async function insertTopLevelBlock(siteSlug, pagePath, blockId) {
  const manager = getWorkspaceManager();
  const files = await manager.readFiles(siteSlug);
  const containerNodeId = findPageRootNodeId(files, pagePath);
  return insertBlock(siteSlug, pagePath, blockId, containerNodeId);
}
