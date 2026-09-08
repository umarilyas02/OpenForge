"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { getBlockPaletteMeta, groupBlocksByCategory } from "../lib/block-palette-meta.js";

/**
 * Ready-made block picker: every block type allowed in the current region
 * (or slot), each an option that appends a fresh instance with its default
 * props. Shared by BlockList.jsx (the "Layers" tree view, `variant="inline"`
 * — a compact flat list so it stays lightweight when repeated once per
 * nesting level) and CanvasEditor (the live-canvas view, `variant="grid"`
 * — the full searchable, categorized icon grid) so both editing modes
 * offer the same catalog.
 *
 * @param {{ allowedBlockIds: string[], catalog: object[], onAdd: (blockId: string) => void, variant?: "grid" | "inline" }} props
 */
export function BlockPalette({ allowedBlockIds, catalog, onAdd, variant = "grid" }) {
  const [search, setSearch] = useState("");

  const options = useMemo(
    () => catalog.filter((definition) => allowedBlockIds.includes(definition.id)),
    [allowedBlockIds, catalog],
  );

  if (options.length === 0) return null;

  if (variant === "inline") {
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

  const query = search.trim().toLowerCase();
  const filtered = query
    ? options.filter((definition) => definition.name.toLowerCase().includes(query))
    : options;
  const groups = groupBlocksByCategory(filtered);

  return (
    <div className="palette-grid-view">
      <div className="palette-search">
        <Search aria-hidden="true" size={14} />
        <input
          aria-label="Search elements"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search elements..."
          type="search"
          value={search}
        />
      </div>

      {groups.length === 0 ? (
        <p className="muted">No elements match &ldquo;{search}&rdquo;.</p>
      ) : (
        groups.map(({ category, items }) => (
          <div className="palette-category" key={category}>
            <p className="palette-category-label">{category}</p>
            <div className="palette-grid">
              {items.map((definition) => {
                const { icon: Icon } = getBlockPaletteMeta(definition.id);
                return (
                  <button
                    className="palette-card"
                    key={definition.id}
                    onClick={() => onAdd(definition.id)}
                    title={definition.description || definition.name}
                    type="button"
                  >
                    <span className="palette-card-icon">
                      <Icon aria-hidden="true" size={18} />
                    </span>
                    <span className="palette-card-label">{definition.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
