"use client";

import { useState } from "react";

import { buildMenuTree } from "../lib/menu-tree.js";

/**
 * Find the array a node with `id` currently lives in (the top-level array
 * itself, or some node's `children` array) plus its index there, so the
 * caller can splice it out or compute a sibling-relative insert index.
 *
 * @param {object[]} tree
 * @param {string} id
 */
function locate(tree, id) {
  for (let index = 0; index < tree.length; index += 1) {
    if (tree[index].id === id) return { list: tree, index, parent: null };
    const childIndex = tree[index].children.findIndex(
      (child) => child.id === id,
    );
    if (childIndex !== -1) {
      return {
        list: tree[index].children,
        index: childIndex,
        parent: tree[index],
      };
    }
  }
  return null;
}

/** Deep-clone a tree that's at most one level deep. */
function cloneTree(tree) {
  return tree.map((node) => ({
    ...node,
    children: node.children.map((child) => ({ ...child, children: [] })),
  }));
}

/**
 * A drag-to-reorder — and now drag-to-nest — menu item list. Built on the
 * same native HTML5-drag-and-drop pattern as `BlockList`: a single level of
 * nesting (top-level items and their direct children), matching the
 * `parentId` column already on `menu_items`.
 *
 * Dragging a row over another row's top/bottom band reorders it as a
 * sibling (before/after); dragging over the middle band of a *top-level*
 * row nests it as that row's child. A row that already has children can't
 * itself be nested (it would need a second level), so its middle band is
 * not a valid nest target and dropping it there falls back to a
 * before/after reorder.
 *
 * @param {{ menuId: string, initialItems: object[], removeMenuItem: Function, reorderMenuItems: Function }} props
 */
export function MenuItemList({
  menuId,
  initialItems,
  removeMenuItem,
  reorderMenuItems,
}) {
  const [tree, setTree] = useState(() => buildMenuTree(initialItems));
  const [dragId, setDragId] = useState(null);
  const [dragAllowed, setDragAllowed] = useState(false);
  const [dropTarget, setDropTarget] = useState(null);
  const [pendingRemoveId, setPendingRemoveId] = useState(null);

  function resetDrag() {
    setDragId(null);
    setDropTarget(null);
  }

  function handleDragStart(event, id) {
    if (!dragAllowed) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.effectAllowed = "move";
    setDragId(id);
  }

  function handleDragOver(event, node, isTopLevel) {
    if (dragId === null || dragId === node.id) return;
    event.preventDefault();

    const rect = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientY - rect.top) / rect.height;
    const draggedLocation = locate(tree, dragId);
    const draggedHasChildren =
      (draggedLocation?.list[draggedLocation.index]?.children.length ?? 0) > 0;

    // A row only offers a "nest into me" middle band when it's top-level
    // and the item being dragged doesn't already have children of its own
    // (that would need a second level of nesting, which isn't supported).
    const middleIsNestZone = isTopLevel && !draggedHasChildren;

    let position;
    if (middleIsNestZone) {
      if (ratio < 0.25) position = "before";
      else if (ratio > 0.75) position = "after";
      else position = "into";
    } else {
      position = ratio < 0.5 ? "before" : "after";
    }

    setDropTarget({ id: node.id, position });
  }

  async function persist(nextTree) {
    setTree(nextTree);
    await reorderMenuItems(menuId, nextTree);
  }

  async function handleDrop(event) {
    event.preventDefault();
    const sourceId = dragId;
    const target = dropTarget;
    resetDrag();
    if (!sourceId || !target || sourceId === target.id) return;

    const next = cloneTree(tree);
    const sourceLocation = locate(next, sourceId);
    if (!sourceLocation) return;
    const [draggedNode] = sourceLocation.list.splice(sourceLocation.index, 1);

    const targetLocation = locate(next, target.id);
    if (!targetLocation) return;

    if (target.position === "into") {
      // Only a top-level target accepts children, and only a childless
      // dragged node can become one — keeps nesting to a single level.
      if (targetLocation.parent !== null || draggedNode.children.length > 0) {
        return;
      }
      targetLocation.list[targetLocation.index].children.push(draggedNode);
    } else {
      // A before/after drop onto a child row would also nest the dragged
      // node one level deeper — block it for the same reason as above.
      if (targetLocation.parent !== null && draggedNode.children.length > 0) {
        return;
      }
      const insertIndex =
        target.position === "before"
          ? targetLocation.index
          : targetLocation.index + 1;
      targetLocation.list.splice(insertIndex, 0, draggedNode);
    }

    await persist(next);
  }

  async function handleRemove(itemId) {
    setPendingRemoveId(itemId);
    await removeMenuItem(menuId, itemId);
    setTree((current) => {
      const next = cloneTree(current);
      const location = locate(next, itemId);
      if (!location) return current;
      const [removed] = location.list.splice(location.index, 1);
      if (location.parent === null && removed.children.length > 0) {
        next.splice(location.index, 0, ...removed.children);
      }
      return next;
    });
    setPendingRemoveId(null);
  }

  if (tree.length === 0) {
    return <p className="muted">No items yet — add one below.</p>;
  }

  function renderIndicator(id, position) {
    if (dropTarget?.id !== id || dropTarget.position !== position) return null;
    return <div className="drop-indicator" />;
  }

  function renderRow(node, isTopLevel) {
    const isNestTarget =
      dropTarget?.id === node.id && dropTarget.position === "into";

    return (
      <div
        className="block-card"
        data-drop-into={isNestTarget}
        data-dragging={dragId === node.id}
        draggable
        onDragEnd={resetDrag}
        onDragOver={(event) => handleDragOver(event, node, isTopLevel)}
        onDragStart={(event) => handleDragStart(event, node.id)}
        onDrop={handleDrop}
      >
        <div className="block-card-header">
          <div className="block-card-title">
            <span
              aria-hidden="true"
              className="drag-handle"
              onMouseDown={() => setDragAllowed(true)}
              onMouseUp={() => setDragAllowed(false)}
            >
              <svg
                fill="currentColor"
                height="14"
                viewBox="0 0 16 16"
                width="14"
              >
                <circle cx="6" cy="4" r="1" />
                <circle cx="10" cy="4" r="1" />
                <circle cx="6" cy="8" r="1" />
                <circle cx="10" cy="8" r="1" />
                <circle cx="6" cy="12" r="1" />
                <circle cx="10" cy="12" r="1" />
              </svg>
            </span>
            <span className="block-card-name">{node.label}</span>
            <span className="muted" style={{ fontSize: 12 }}>
              {node.url}
            </span>
          </div>
          <button
            className="icon-btn-sm"
            data-danger="true"
            disabled={pendingRemoveId === node.id}
            onClick={() => handleRemove(node.id)}
            type="button"
          >
            <svg fill="none" height="12" viewBox="0 0 16 16" width="12">
              <path
                d="M3 4h10M6.5 4V3a1 1 0 0 1 1-1h1a1 1 0 0 1 1 1v1M5 4v9a1 1 0 0 0 1 1h4a1 1 0 0 0 1-1V4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.3"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="stack-sm">
      {tree.map((node) => (
        <div key={node.id}>
          {renderIndicator(node.id, "before")}
          {renderRow(node, true)}
          {renderIndicator(node.id, "after")}
          {node.children.length > 0 ? (
            <div className="menu-item-children">
              {node.children.map((child) => (
                <div key={child.id}>
                  {renderIndicator(child.id, "before")}
                  {renderRow(child, false)}
                  {renderIndicator(child.id, "after")}
                </div>
              ))}
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
