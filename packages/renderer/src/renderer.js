import { createElement, Fragment } from "react";

import { parseContentTree } from "./content-tree.js";
import { invariant } from "./errors.js";

/**
 * Create a block-tree renderer bound to one theme and one block registry.
 * The theme decides which block components exist and which are allowed in
 * which region; the block registry validates and migrates each instance's
 * props before the theme's component ever sees them.
 *
 * @param {{ theme: { getBlockComponent: Function }, blockRegistry: { migrateInstance: Function, validateProps: Function } }} options
 */
export function createRenderer({ theme, blockRegistry }) {
  function renderNode(node) {
    const migrated = blockRegistry.migrateInstance({
      blockId: node.blockId,
      blockVersion: node.blockVersion,
      props: node.props ?? {},
    });

    blockRegistry.validateProps(migrated.blockId, migrated.props);

    const Component = theme.getBlockComponent(migrated.blockId);

    const slots = {};
    for (const [slotName, children] of Object.entries(node.slots ?? {})) {
      slots[slotName] = children.map((child, index) =>
        createElement(Fragment, { key: index }, renderNode(child)),
      );
    }

    return createElement(Component, { ...migrated.props, slots });
  }

  /**
   * @param {unknown} tree
   */
  function renderTree(tree) {
    const nodes = parseContentTree(tree);
    invariant(
      nodes.length > 0,
      "OF_RENDER_EMPTY_TREE",
      "Content tree has no top-level blocks to render.",
    );

    return createElement(
      Fragment,
      null,
      ...nodes.map((node, index) =>
        createElement(Fragment, { key: index }, renderNode(node)),
      ),
    );
  }

  return Object.freeze({ renderTree, renderNode });
}
