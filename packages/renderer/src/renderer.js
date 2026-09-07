import { createElement, Fragment } from "react";

import { parseContentTree } from "./content-tree.js";
import { invariant } from "./errors.js";
import { styleOverrideToCss } from "./style.js";

/**
 * Create a block-tree renderer bound to one theme and one block registry.
 * The theme decides which block components exist and which are allowed in
 * which region; the block registry validates and migrates each instance's
 * props before the theme's component ever sees them.
 *
 * @param {{ theme: { getBlockComponent: Function }, blockRegistry: { migrateInstance: Function, validateProps: Function }, wrapNode?: (element: unknown, path: (string|number)[], migrated: { blockId: string, blockVersion: number, props: object }) => unknown }} options
 */
export function createRenderer({ theme, blockRegistry, wrapNode }) {
  function renderNode(node, path = []) {
    const migrated = blockRegistry.migrateInstance({
      blockId: node.blockId,
      blockVersion: node.blockVersion,
      props: node.props ?? {},
    });

    blockRegistry.validateProps(migrated.blockId, migrated.props);

    const Component = theme.getBlockComponent(migrated.blockId);
    const { style: styleOverride, className: classNameOverride, ...contentProps } =
      migrated.props;

    const slots = {};
    for (const [slotName, children] of Object.entries(node.slots ?? {})) {
      slots[slotName] = children.map((child, index) =>
        createElement(
          Fragment,
          { key: index },
          renderNode(child, [...path, "slots", slotName, index]),
        ),
      );
    }

    const element = createElement(Component, { ...contentProps, slots });

    // `style`/`className` are a universal cross-cutting concern (the
    // admin's Style/Advanced tabs), not part of any block's own prop
    // schema — applied here, once, for every block, rather than requiring
    // each of the 38+ block components to know about them. Only wraps when
    // there's actually something to apply, so a block with no overrides
    // renders exactly as it always has (no extra DOM node, no risk to
    // existing `.of-block + .of-block` / theme CSS selectors).
    const css = styleOverrideToCss(styleOverride);
    const className =
      typeof classNameOverride === "string" && classNameOverride.trim()
        ? classNameOverride.trim()
        : null;
    const styled =
      css || className
        ? createElement(
            "div",
            { className: className ?? undefined, style: css ?? undefined },
            element,
          )
        : element;

    return wrapNode ? wrapNode(styled, path, migrated) : styled;
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
        createElement(Fragment, { key: index }, renderNode(node, [index])),
      ),
    );
  }

  return Object.freeze({ renderTree, renderNode });
}
