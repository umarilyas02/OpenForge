"use client";

import { useState } from "react";

/**
 * A flat, drag-to-reorder list of menu items — the same native
 * HTML5-drag-and-drop pattern as BlockList, without slots/props forms
 * since a menu item is just a label + URL.
 *
 * @param {{ menuId: string, initialItems: object[], removeMenuItem: Function, reorderMenuItems: Function }} props
 */
export function MenuItemList({
  menuId,
  initialItems,
  removeMenuItem,
  reorderMenuItems,
}) {
  const [items, setItems] = useState(initialItems);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragAllowed, setDragAllowed] = useState(false);
  const [dropTarget, setDropTarget] = useState(null);
  const [pendingRemoveId, setPendingRemoveId] = useState(null);

  function resetDrag() {
    setDragIndex(null);
    setDropTarget(null);
  }

  function handleDragStart(event, index) {
    if (!dragAllowed) {
      event.preventDefault();
      return;
    }
    event.dataTransfer.effectAllowed = "move";
    setDragIndex(index);
  }

  function handleDragOver(event, index) {
    if (dragIndex === null) return;
    event.preventDefault();
    const rect = event.currentTarget.getBoundingClientRect();
    const position =
      event.clientY < rect.top + rect.height / 2 ? "before" : "after";
    setDropTarget({ index, position });
  }

  async function handleDrop(event) {
    event.preventDefault();
    if (dragIndex === null || !dropTarget) {
      resetDrag();
      return;
    }
    let targetIndex =
      dropTarget.position === "before"
        ? dropTarget.index
        : dropTarget.index + 1;
    if (dragIndex < targetIndex) targetIndex -= 1;

    if (targetIndex !== dragIndex) {
      const next = [...items];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(targetIndex, 0, moved);
      setItems(next);
      await reorderMenuItems(
        menuId,
        next.map((item) => item.id),
      );
    }
    resetDrag();
  }

  async function handleRemove(itemId) {
    setPendingRemoveId(itemId);
    await removeMenuItem(menuId, itemId);
    setItems((current) => current.filter((item) => item.id !== itemId));
    setPendingRemoveId(null);
  }

  if (items.length === 0) {
    return <p className="muted">No items yet — add one below.</p>;
  }

  return (
    <div className="stack-sm">
      {items.map((item, index) => (
        <div key={item.id}>
          {dropTarget?.index === index && dropTarget.position === "before" ? (
            <div className="drop-indicator" />
          ) : null}
          <div
            className="block-card"
            data-dragging={dragIndex === index}
            draggable
            onDragEnd={resetDrag}
            onDragOver={(event) => handleDragOver(event, index)}
            onDragStart={(event) => handleDragStart(event, index)}
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
                <span className="block-card-name">{item.label}</span>
                <span className="muted" style={{ fontSize: 12 }}>
                  {item.url}
                </span>
              </div>
              <button
                className="icon-btn-sm"
                data-danger="true"
                disabled={pendingRemoveId === item.id}
                onClick={() => handleRemove(item.id)}
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
          {dropTarget?.index === index && dropTarget.position === "after" ? (
            <div className="drop-indicator" />
          ) : null}
        </div>
      ))}
    </div>
  );
}
