"use client";

/**
 * Ready-made block picker: every block type allowed in the current region
 * (or slot), each a button that appends a fresh instance with its default
 * props. Shared by BlockList.jsx (the "Layers" tree view) and CanvasEditor
 * (the live-canvas view) so both editing modes offer the same catalog.
 *
 * @param {{ allowedBlockIds: string[], catalog: object[], onAdd: (blockId: string) => void }} props
 */
export function BlockPalette({ allowedBlockIds, catalog, onAdd }) {
  const options = catalog.filter((definition) =>
    allowedBlockIds.includes(definition.id),
  );

  if (options.length === 0) return null;

  return (
    <div className="block-palette">
      {options.map((definition) => (
        <button
          className="add-block-btn"
          key={definition.id}
          onClick={() => onAdd(definition.id)}
          type="button"
        >
          <svg fill="none" height="12" viewBox="0 0 16 16" width="12">
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.5"
            />
          </svg>
          {definition.name}
        </button>
      ))}
    </div>
  );
}
