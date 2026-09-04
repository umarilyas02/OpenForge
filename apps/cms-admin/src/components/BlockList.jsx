"use client";

import { useState } from "react";

import { BlockPalette } from "./BlockPalette.jsx";
import { BlockPropsForm } from "./BlockPropsForm.jsx";

function DragHandle({ onDragStartAllowed }) {
  return (
    <span
      aria-hidden="true"
      className="drag-handle"
      onMouseDown={() => onDragStartAllowed(true)}
      onMouseUp={() => onDragStartAllowed(false)}
    >
      <svg fill="currentColor" height="14" viewBox="0 0 16 16" width="14">
        <circle cx="6" cy="4" r="1" />
        <circle cx="10" cy="4" r="1" />
        <circle cx="6" cy="8" r="1" />
        <circle cx="10" cy="8" r="1" />
        <circle cx="6" cy="12" r="1" />
        <circle cx="10" cy="12" r="1" />
      </svg>
    </span>
  );
}

/**
 * Recursive block-tree editor: a canvas of block cards at this level, each
 * with prop editing, drag-to-reorder (plus ↑/↓ buttons as a keyboard/
 * non-pointer fallback), removal, and — for blocks that declare slots — a
 * nested BlockList per slot scoped to that slot's acceptedTypes.
 *
 * @param {{ nodes: object[], onChange: (nodes: object[]) => void, allowedBlockIds: string[], catalog: object[] }} props
 */
export function BlockList({ nodes, onChange, allowedBlockIds, catalog }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [dragAllowed, setDragAllowed] = useState(false);
  const [dropTarget, setDropTarget] = useState(null);

  function updateNode(index, updater) {
    onChange(
      nodes.map((node, i) => (i === index ? updater({ ...node }) : node)),
    );
  }

  function removeNode(index) {
    onChange(nodes.filter((_, i) => i !== index));
  }

  function moveNode(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= nodes.length) return;
    const next = [...nodes];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function addNode(blockId) {
    const definition = catalog.find((entry) => entry.id === blockId);
    if (!definition) return;
    onChange([
      ...nodes,
      {
        blockId,
        blockVersion: definition.version,
        props: { ...definition.defaultProps },
        slots: {},
      },
    ]);
  }

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

  function handleDrop(event) {
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
      const next = [...nodes];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(targetIndex, 0, moved);
      onChange(next);
    }
    resetDrag();
  }

  return (
    <div className="stack">
      {nodes.map((node, index) => {
        const definition = catalog.find((entry) => entry.id === node.blockId);
        const showIndicatorBefore =
          dropTarget?.index === index && dropTarget.position === "before";
        const showIndicatorAfter =
          dropTarget?.index === index && dropTarget.position === "after";

        return (
          <div key={`${node.blockId}-${index}`}>
            {showIndicatorBefore ? <div className="drop-indicator" /> : null}
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
                  <DragHandle onDragStartAllowed={setDragAllowed} />
                  <span className="block-card-name">
                    {definition?.name ?? node.blockId}
                  </span>
                </div>
                <div className="block-card-actions">
                  <button
                    aria-label="Move up"
                    className="icon-btn-sm"
                    disabled={index === 0}
                    onClick={() => moveNode(index, -1)}
                    type="button"
                  >
                    <svg fill="none" height="12" viewBox="0 0 16 16" width="12">
                      <path
                        d="M8 12V4M4 8l4-4 4 4"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </button>
                  <button
                    aria-label="Move down"
                    className="icon-btn-sm"
                    disabled={index === nodes.length - 1}
                    onClick={() => moveNode(index, 1)}
                    type="button"
                  >
                    <svg fill="none" height="12" viewBox="0 0 16 16" width="12">
                      <path
                        d="M8 4v8M4 8l4 4 4-4"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="1.4"
                      />
                    </svg>
                  </button>
                  <button
                    aria-label="Remove block"
                    className="icon-btn-sm"
                    data-danger="true"
                    onClick={() => removeNode(index)}
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

              {definition ? (
                <BlockPropsForm
                  definition={definition}
                  onChange={(nextProps) =>
                    updateNode(index, (n) => ({ ...n, props: nextProps }))
                  }
                  props={node.props}
                />
              ) : (
                <p className="form-error">
                  Unknown block: {node.blockId}. Remove it to save this page.
                </p>
              )}

              {definition?.slots.map((slot) => (
                <div className="block-card-slot" key={slot.name}>
                  <p className="block-card-slot-label">{slot.label}</p>
                  <BlockList
                    allowedBlockIds={slot.acceptedTypes}
                    catalog={catalog}
                    nodes={node.slots?.[slot.name] ?? []}
                    onChange={(children) =>
                      updateNode(index, (n) => ({
                        ...n,
                        slots: { ...n.slots, [slot.name]: children },
                      }))
                    }
                  />
                </div>
              ))}
            </div>
            {showIndicatorAfter ? <div className="drop-indicator" /> : null}
          </div>
        );
      })}

      <BlockPalette
        allowedBlockIds={allowedBlockIds}
        catalog={catalog}
        onAdd={addNode}
      />
    </div>
  );
}
