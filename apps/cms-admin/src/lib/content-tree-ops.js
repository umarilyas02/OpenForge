import { parseContentTree } from "@openforge/renderer";

/**
 * Recursively migrate and validate one raw block-tree node against a CMS
 * block registry, reassembling `slots` afterward since
 * `blockRegistry.migrateInstance()` only returns `{blockId, blockVersion,
 * props}` — slots are the caller's responsibility to carry through.
 *
 * @param {unknown} node
 * @param {{ migrateInstance: Function, validateProps: Function }} blockRegistry
 */
function prepareNode(node, blockRegistry) {
  if (!node || typeof node !== "object" || Array.isArray(node)) {
    throw new Error("Each block must be an object.");
  }

  const migrated = blockRegistry.migrateInstance({
    blockId: node.blockId,
    blockVersion: node.blockVersion,
    props: node.props ?? {},
  });
  blockRegistry.validateProps(migrated.blockId, migrated.props);

  const slots = {};
  for (const [slotName, children] of Object.entries(node.slots ?? {})) {
    if (!Array.isArray(children)) {
      throw new Error(`Slot "${slotName}" must be an array of blocks.`);
    }
    slots[slotName] = children.map((child) =>
      prepareNode(child, blockRegistry),
    );
  }

  return {
    blockId: migrated.blockId,
    blockVersion: migrated.blockVersion,
    props: migrated.props,
    slots,
  };
}

/**
 * Validate a whole raw block tree (as submitted by the client editor)
 * against a block registry, then against the structural content-tree
 * schema. Throws with a descriptive message on the first problem found —
 * the caller is expected to catch and surface it to the form.
 *
 * @param {unknown} rawTree
 * @param {{ migrateInstance: Function, validateProps: Function }} blockRegistry
 */
export function prepareContentTreeForSave(rawTree, blockRegistry) {
  if (!Array.isArray(rawTree)) {
    throw new Error("Content tree must be an array of top-level blocks.");
  }

  const prepared = rawTree.map((node) => prepareNode(node, blockRegistry));
  return parseContentTree(prepared);
}

/**
 * Build a serializable (no component functions) description of a set of
 * block definitions, for handing to a client component. Only the fields
 * the editor UI needs are included.
 *
 * @param {string[]} blockIds
 * @param {{ get: Function }} blockRegistry
 */
export function serializeBlockDefinitions(blockIds, blockRegistry) {
  return blockIds.map((id) => {
    const { definition } = blockRegistry.get(id);
    return {
      id: definition.id,
      name: definition.name,
      description: definition.description,
      version: definition.version,
      editableFields: definition.editableFields,
      slots: definition.slots,
      defaultProps: definition.defaultProps,
    };
  });
}
