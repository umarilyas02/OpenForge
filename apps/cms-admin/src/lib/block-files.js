const COMPONENTS_DIR = "components/openforge";
const BLOCK_ID_PREFIX = "openforge-cms.";
const COMPONENT_PATH_PATTERN = /^components\/openforge\/([a-z0-9-]+)\.jsx$/u;

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
