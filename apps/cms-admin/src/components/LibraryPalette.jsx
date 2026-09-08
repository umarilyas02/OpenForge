"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { getLibraryCategoryMeta, groupLibraryByCategory } from "../lib/library-palette-meta.js";

/**
 * The "Blocks" tab: a searchable, categorized grid over
 * @openforge/component-library's harvested section catalog (nav, hero,
 * grid, product, blog, footer, custom) — same visual shape as the
 * "Elements" tab's BlockPalette, but backed by a different catalog and a
 * different insertion path (see insertLibraryComponent in
 * library-content-actions.js): a library component isn't a registered
 * block, so it's written into the site as a real, standalone file and
 * always appended at the page's top level, rather than inserted as a
 * {blockId, props} tree node.
 *
 * Known gap: because it isn't a tree node, an inserted library component
 * doesn't show up in this canvas's live iframe preview (which only ever
 * renders the recognized block tree) — only in the page's real, published
 * output. `lastInserted` surfaces that plainly instead of leaving a click
 * that visibly did nothing.
 *
 * @param {{ catalog: object[], onAdd: (componentId: string) => void }} props
 */
export function LibraryPalette({ catalog, onAdd }) {
  const [search, setSearch] = useState("");
  const [lastInserted, setLastInserted] = useState(null);

  const query = search.trim().toLowerCase();
  const filtered = useMemo(() => {
    if (!query) return catalog;
    return catalog.filter((component) => {
      const haystack = [component.name, component.description, ...component.tags]
        .join(" ")
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [catalog, query]);
  const groups = groupLibraryByCategory(filtered);

  function handleAdd(component) {
    onAdd(component.id);
    setLastInserted(component.name);
  }

  if (catalog.length === 0) return null;

  return (
    <div className="palette-grid-view">
      <div className="palette-search">
        <Search aria-hidden="true" size={14} />
        <input
          aria-label="Search blocks"
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search blocks..."
          type="search"
          value={search}
        />
      </div>

      {lastInserted ? (
        <p className="palette-insert-note">
          Added &ldquo;{lastInserted}&rdquo; to the page. It&rsquo;s written into the
          site&rsquo;s real files but won&rsquo;t appear on this canvas — open
          Preview to see it rendered.
        </p>
      ) : null}

      {groups.length === 0 ? (
        <p className="muted">No blocks match &ldquo;{search}&rdquo;.</p>
      ) : (
        groups.map(({ category, items }) => {
          const { label, icon: Icon } = getLibraryCategoryMeta(category);
          return (
            <div className="palette-category" key={category}>
              <p className="palette-category-label">{label}</p>
              <div className="palette-grid">
                {items.map((component) => (
                  <button
                    className="palette-card"
                    key={component.id}
                    onClick={() => handleAdd(component)}
                    title={component.description || component.name}
                    type="button"
                  >
                    <span className="palette-card-icon">
                      <Icon aria-hidden="true" size={18} />
                    </span>
                    <span className="palette-card-label">{component.name}</span>
                  </button>
                ))}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
