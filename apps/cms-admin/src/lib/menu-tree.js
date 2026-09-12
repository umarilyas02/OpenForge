/**
 * Pure helpers for turning a flat `menu_items` row list (each row carrying
 * `id`, `parentId`, `position`) into the nested tree the Menus UI edits and
 * back again into the flat `{id, parentId, position}` updates it persists.
 *
 * Kept dependency-free (no db/react imports) so both the client-side
 * `MenuItemList` component and the `reorderMenuItems` server action can
 * import it, and so it's trivial to unit test in isolation.
 *
 * The admin UI only ever *creates* one level of nesting (top-level items
 * and their direct children), but `buildMenuTree` itself is a plain
 * recursive fold over `parentId` and does not assume a depth limit — it
 * will happily nest deeper if the data already has it.
 */

/**
 * @param {{ id: string, parentId: string | null, position: number }[]} items
 * @returns {Array<object & { children: object[] }>}
 */
export function buildMenuTree(items) {
  const nodes = new Map(
    items.map((item) => [item.id, { ...item, children: [] }]),
  );
  const roots = [];

  for (const item of items) {
    const node = nodes.get(item.id);
    const parent = item.parentId ? nodes.get(item.parentId) : null;
    if (parent) {
      parent.children.push(node);
    } else {
      roots.push(node);
    }
  }

  const byPosition = (a, b) => a.position - b.position;
  const sortRecursive = (list) => {
    list.sort(byPosition);
    for (const node of list) sortRecursive(node.children);
    return list;
  };

  return sortRecursive(roots);
}

/**
 * Flatten a nested menu tree (as produced/edited via `buildMenuTree`) back
 * into the `{id, parentId, position}` triples to persist — position is
 * reassigned from each node's index within its own sibling list, so this
 * is also how reordering (with no structural change) gets its new
 * positions.
 *
 * @param {Array<{ id: string, children?: object[] }>} tree
 * @param {string | null} parentId
 * @returns {{ id: string, parentId: string | null, position: number }[]}
 */
export function flattenMenuTree(tree, parentId = null) {
  const updates = [];
  tree.forEach((node, index) => {
    updates.push({ id: node.id, parentId, position: index });
    if (node.children?.length) {
      updates.push(...flattenMenuTree(node.children, node.id));
    }
  });
  return updates;
}
