/**
 * A path addresses one node in a block tree: `[index]` for a top-level
 * node, `[index, "slots", slotName, childIndex, ...]` for nested slot
 * content — the exact shape `packages/renderer`'s `wrapNode` hook reports
 * and `BlockList.jsx`'s `node.slots[slotName]` arrays already use. These
 * are the path-based generalization of `BlockList.jsx`'s local, index-only
 * `updateNode`, shared by the canvas editor.
 *
 * @param {object[]} tree
 * @param {(string|number)[]} path
 */
export function getNodeAtPath(tree, path) {
  let node = tree[path[0]];
  for (let i = 1; i < path.length; i += 3) {
    const slotName = path[i + 1];
    const index = path[i + 2];
    node = node?.slots?.[slotName]?.[index];
  }
  return node;
}

/**
 * Returns a new tree with the node at `path` replaced by
 * `updater(currentNode)`. Every ancestor array/object along the path is
 * shallow-copied; everything else is shared, matching the immutable-update
 * style `BlockList.jsx`'s `onChange` callbacks already expect.
 *
 * @param {object[]} tree
 * @param {(string|number)[]} path
 * @param {(node: object) => object} updater
 */
export function setNodeAtPath(tree, path, updater) {
  const [index, ...rest] = path;

  return tree.map((node, i) => {
    if (i !== index) return node;
    if (rest.length === 0) return updater(node);

    const [, slotName, slotIndex, ...deeper] = rest;
    const slotChildren = node.slots?.[slotName] ?? [];

    return {
      ...node,
      slots: {
        ...node.slots,
        [slotName]: setNodeAtPath(
          slotChildren,
          [slotIndex, ...deeper],
          updater,
        ),
      },
    };
  });
}
