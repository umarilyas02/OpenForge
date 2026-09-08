import { OFFICIAL_CMS_BLOCKS } from "@openforge/cms-blocks";
import {
  CompilerOperationError,
  applyEditorOperation,
  applyVisualOperation,
  buildProjectIndex,
} from "@openforge/compiler";

import {
  componentPathForBlock,
  readStandaloneBlockSource,
  standaloneFileNameForBlock,
} from "./block-files.js";
import { commitSiteChanges } from "./site-git.js";
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
  await commitSiteChanges(state.rootPath, `Edit ${node.blockId} on ${pagePath}`);
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
  await commitSiteChanges(state.rootPath, `Reorder blocks on ${pagePath}`);
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
  await commitSiteChanges(state.rootPath, `Remove a block from ${pagePath}`);
}

/** Clones a block (and its full source text, slots included) as a new sibling immediately after itself. */
export async function duplicateBlock(siteSlug, pagePath, nodeId) {
  const { manager, state, files } = await loadWorkspace(siteSlug);
  const result = await applyVisualOperation({
    files,
    currentRevision: 0,
    operation: {
      schemaVersion: 1,
      baseRevision: 0,
      filePath: pagePath,
      type: "duplicate-jsx",
      target: { nodeId },
    },
  });

  await manager.saveFile(siteSlug, {
    baseRevision: state.revision,
    path: pagePath,
    source: requireFileSource(result.files, pagePath),
  });
  await commitSiteChanges(state.rootPath, `Duplicate a block on ${pagePath}`);
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
    await commitSiteChanges(state.rootPath, `Add ${blockId} component`);
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
    await commitSiteChanges(state.rootPath, `Import ${blockId} on ${pagePath}`);
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
 * `containerNodeId` is `null`/`undefined` for a top-level insert rather than
 * a snapshotted root id: node ids are positional (see buildProjectIndex),
 * so adding an import — which every *previous* queued insert of a
 * newly-used block type does — shifts every id in the file, including the
 * page root's. A client-cached root id from before an earlier queued insert
 * finished would then no longer equal the real root, this call would
 * mistake it for a (nonexistent) slot container, and it would fail. Always
 * re-resolving "root" fresh, right here, makes rapid sequential top-level
 * inserts (the palette's common case) immune to that regardless of how
 * stale the caller's last-seen root id is. A slot insert still needs its
 * own fresh containerNodeId — locateNodeAddress/resolveNodeAddress below
 * only protect *this* call's own two reads, not a second insertBlock call
 * racing behind it.
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
  const beforeIndex = buildProjectIndex({ files: beforeFiles });
  const isRoot =
    containerNodeId == null ||
    containerNodeId === findPageRootNodeId(beforeFiles, pagePath, beforeIndex);
  const address = isRoot
    ? null
    : locateNodeAddress(
        parsePageToBlockTree(beforeFiles, pagePath, beforeIndex),
        containerNodeId,
      );
  if (!isRoot && !address) {
    throw new Error(`Container not found: ${containerNodeId}`);
  }

  const { localName } = await ensureBlockAvailable(siteSlug, pagePath, blockId);

  const state = await manager.describe(siteSlug);
  const files = await manager.readFiles(siteSlug);
  const index = buildProjectIndex({ files });
  const resolvedContainerNodeId = isRoot
    ? findPageRootNodeId(files, pagePath, index)
    : resolveNodeAddress(parsePageToBlockTree(files, pagePath, index), address)
        ?.id;
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
  await commitSiteChanges(state.rootPath, `Add ${blockId} to ${pagePath}`);
}

/** Convenience for the common case: append a new top-level block to a page. */
export async function insertTopLevelBlock(siteSlug, pagePath, blockId) {
  const manager = getWorkspaceManager();
  const files = await manager.readFiles(siteSlug);
  const containerNodeId = findPageRootNodeId(files, pagePath);
  return insertBlock(siteSlug, pagePath, blockId, containerNodeId);
}

/**
 * Undo/redo primitive: overwrites the page file with an exact prior source
 * string the caller already holds (see restorePageSourceAction in
 * pages/editor/actions.js), through the same saveFile + git commit path
 * every other edit here uses — no different from any other save.
 */
export async function restorePageSource(siteSlug, pagePath, source) {
  const { manager, state } = await loadWorkspace(siteSlug);
  await manager.saveFile(siteSlug, {
    baseRevision: state.revision,
    path: pagePath,
    source,
  });
  await commitSiteChanges(state.rootPath, `Undo/redo on ${pagePath}`);
}
