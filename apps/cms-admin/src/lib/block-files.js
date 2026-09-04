import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const COMPONENTS_DIR = "components/openforge";
const BLOCK_ID_PREFIX = "openforge-cms.";
const COMPONENT_PATH_PATTERN = /^components\/openforge\/([a-z0-9-]+)\.jsx$/u;

// Plain relative paths, not `import.meta.resolve("@openforge/cms-blocks/...")`:
// confirmed live that a standalone production build's file tracer doesn't
// resolve @openforge/cms-blocks as a package at all when it's only ever
// reached via a dynamic, block-id-parameterized specifier (the whole point,
// since any of the 38 blocks can be inserted into a site) — the package
// silently isn't copied into .next/standalone/node_modules, and site
// creation fails at runtime with no build-time warning. next.config.js's
// outputFileTracingIncludes instead copies these files to a path that
// mirrors the monorepo's own layout, which a plain relative path (computed
// from this file's own location) resolves identically in both the source
// tree and the deployed standalone tree.
const CMS_BLOCKS_STANDALONE_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../../packages/cms-blocks/dist/standalone",
);
const CMS_BLOCKS_CSS_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../../packages/cms-blocks/src/blocks.css",
);

/**
 * Every block a site imports lives at `components/openforge/<kebab-id>.jsx`
 * — the same kebab name as its `dist/standalone/*.jsx` source file and the
 * suffix of its `openforge-cms.<kebab-id>` block id. Keeping the on-disk
 * file name kebab-case (rather than the more common PascalCase) means a
 * block id round-trips through a site's real files with no separate lookup
 * table or embedded metadata comment — the file path *is* the block id.
 *
 * @param {string} blockId e.g. "openforge-cms.hero"
 */
export function componentPathForBlock(blockId) {
  if (!blockId.startsWith(BLOCK_ID_PREFIX)) {
    throw new Error(`Unrecognized block id: ${blockId}`);
  }
  return `${COMPONENTS_DIR}/${blockId.slice(BLOCK_ID_PREFIX.length)}.jsx`;
}

/**
 * @param {string} componentPath
 * @returns {string|null} the block id, or null if this isn't a block component path
 */
export function blockIdForComponentPath(componentPath) {
  const match = COMPONENT_PATH_PATTERN.exec(componentPath);
  return match ? `${BLOCK_ID_PREFIX}${match[1]}` : null;
}

/**
 * @param {string} blockId e.g. "openforge-cms.hero"
 * @returns {string} the dist/standalone file name, e.g. "hero.jsx"
 */
export function standaloneFileNameForBlock(blockId) {
  if (!blockId.startsWith(BLOCK_ID_PREFIX)) {
    throw new Error(`Unrecognized block id: ${blockId}`);
  }
  return `${blockId.slice(BLOCK_ID_PREFIX.length)}.jsx`;
}

/** The generated, dependency-free component source for a block, ready to be written into a site's own files. */
export async function readStandaloneBlockSource(blockId) {
  return readFile(
    path.join(CMS_BLOCKS_STANDALONE_DIR, standaloneFileNameForBlock(blockId)),
    "utf8",
  );
}

export async function readBlocksCss() {
  return readFile(CMS_BLOCKS_CSS_PATH, "utf8");
}
