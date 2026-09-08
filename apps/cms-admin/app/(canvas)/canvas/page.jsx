"use client";

import { defaultDesignTokens } from "@openforge/design-tokens";
import { createRenderer, renderSiteStyles } from "@openforge/renderer";
import {
  defaultTheme,
  defaultThemeBlockRegistry,
} from "@openforge/theme-default";
import { Grip, X } from "lucide-react";
import { Fragment, useEffect, useState } from "react";

import { getBlockPaletteMeta } from "../../../src/lib/block-palette-meta.js";

const DRAG_HIGHLIGHT_STYLE_ID = "of-canvas-drag-highlight";

/** Selected-block overlay chrome — this route deliberately loads none of the admin app's CSS (see layout.jsx), so its own small monochrome palette is hardcoded here rather than pulled from design tokens meant for real site content. */
const SELECTION_INK = "#111111";
const SELECTION_INK_TEXT = "#ffffff";

function getSelectionRect(path) {
  const wrapper = document.querySelector(
    `[data-of-path='${JSON.stringify(path)}']`,
  );
  const target = wrapper?.firstElementChild;
  if (!target) return null;
  const rect = target.getBoundingClientRect();
  if (rect.width === 0 && rect.height === 0) return null;
  return { top: rect.top, left: rect.left, width: rect.width, height: rect.height };
}

/**
 * The live canvas: a same-app, isolated-CSS document loaded in an <iframe>
 * by the content editor. It renders the exact same block-tree pipeline
 * apps/cms-renderer uses in production, so what you see while editing is
 * what actually ships — this route is never linked to directly, only ever
 * embedded. The parent posts the current (possibly unsaved) tree on every
 * change; this page re-renders it and reports clicks back by path so the
 * parent can drive a properties panel.
 *
 * Top-level blocks are also natively draggable here for reordering —
 * dragged/drop-target highlighting is done with a CSS attribute selector
 * targeting each wrapper's real child, not the wrapper itself: wrapNode's
 * wrappers are display:contents (so CSS adjacency like ".of-block +
 * .of-block" keeps working across them), and display:contents elements
 * generate no box of their own to style directly. Nested slot content
 * isn't draggable here — that stays a Layers-view (BlockList.jsx)
 * operation, which already supports reordering at any depth.
 */
export default function CanvasPage() {
  const [tree, setTree] = useState(null);
  const [tokenOverrides, setTokenOverrides] = useState({});
  const [error, setError] = useState(null);
  const [dragIndex, setDragIndex] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedBlockId, setSelectedBlockId] = useState(null);
  const [selectionRect, setSelectionRect] = useState(null);

  useEffect(() => {
    function handleMessage(event) {
      if (event.source !== window.parent) return;
      if (event.data?.type !== "of-canvas-tree") return;
      setError(null);
      setTree(event.data.tree);
      setTokenOverrides(event.data.tokenOverrides ?? {});
      // Acknowledge so the parent can stop its retry loop — see
      // CanvasEditor.jsx's comment on why a single post-on-load isn't
      // reliable enough on its own.
      window.parent.postMessage(
        { type: "of-canvas-ack" },
        window.location.origin,
      );
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  // Re-measure the selected block's box whenever it changes, the tree
  // reflows around it (props edited elsewhere), or the frame scrolls/resizes
  // — getBoundingClientRect() is only ever accurate at the instant it's
  // called, so the overlay has to be recomputed rather than cached.
  useEffect(() => {
    if (!selectedPath) {
      setSelectionRect(null);
      return;
    }

    function measure() {
      setSelectionRect(getSelectionRect(selectedPath));
    }

    const frame = requestAnimationFrame(measure);
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
    };
  }, [selectedPath, tree]);

  function clearSelection() {
    setSelectedPath(null);
    setSelectedBlockId(null);
  }

  function handleRemoveSelected() {
    if (!selectedPath) return;
    window.parent.postMessage(
      { type: "of-canvas-remove", path: selectedPath },
      window.location.origin,
    );
    clearSelection();
  }

  function resetDrag() {
    setDragIndex(null);
    setDropTarget(null);
  }

  function handleDrop() {
    if (dragIndex === null || !dropTarget || !tree) {
      resetDrag();
      return;
    }

    let targetIndex =
      dropTarget.position === "before"
        ? dropTarget.index
        : dropTarget.index + 1;
    if (dragIndex < targetIndex) targetIndex -= 1;

    if (targetIndex !== dragIndex) {
      const next = [...tree];
      const [moved] = next.splice(dragIndex, 1);
      next.splice(targetIndex, 0, moved);
      setTree(next);
      window.parent.postMessage(
        { type: "of-canvas-reorder", tree: next },
        window.location.origin,
      );
    }
    resetDrag();
  }

  function wrapNode(element, path, migrated) {
    const isTopLevel = path.length === 1;
    const index = path[0];

    return (
      <div
        data-of-block-id={migrated.blockId}
        data-of-path={JSON.stringify(path)}
        draggable={isTopLevel}
        key={JSON.stringify(path)}
        onClick={(event) => {
          event.stopPropagation();
          setSelectedPath(path);
          setSelectedBlockId(migrated.blockId);
          window.parent.postMessage(
            { type: "of-canvas-select", path, blockId: migrated.blockId },
            window.location.origin,
          );
        }}
        onDragEnd={resetDrag}
        onDragOver={
          isTopLevel
            ? (event) => {
                if (dragIndex === null) return;
                event.preventDefault();
                const rect = event.currentTarget.firstElementChild
                  ? event.currentTarget.firstElementChild.getBoundingClientRect()
                  : event.currentTarget.getBoundingClientRect();
                const position =
                  event.clientY < rect.top + rect.height / 2
                    ? "before"
                    : "after";
                setDropTarget({ index, position });
              }
            : undefined
        }
        onDragStart={
          isTopLevel
            ? (event) => {
                event.dataTransfer.effectAllowed = "move";
                setDragIndex(index);
              }
            : undefined
        }
        onDrop={isTopLevel ? handleDrop : undefined}
        style={{ display: "contents" }}
      >
        {element}
      </div>
    );
  }

  if (error) {
    return (
      <p style={{ color: "#b91c1c", fontFamily: "sans-serif", padding: 24 }}>
        {error}
      </p>
    );
  }

  if (!tree) {
    return (
      <p style={{ color: "#71717a", fontFamily: "sans-serif", padding: 24 }}>
        Waiting for content…
      </p>
    );
  }

  const renderer = createRenderer({
    theme: defaultTheme,
    blockRegistry: defaultThemeBlockRegistry,
    wrapNode,
  });
  const css = renderSiteStyles({
    baseTokens: defaultDesignTokens,
    overrides: tokenOverrides,
  });

  // Each top-level block is rendered in its own try/catch — a block with
  // invalid props (e.g. a required field cleared from the props panel)
  // shows an inline error in its own place instead of blanking every other
  // block on the canvas. renderNode is the same per-node path renderTree
  // uses internally (see packages/renderer/src/renderer.js), so wrapNode
  // (click-to-select, drag reorder) behaves identically either way.
  const nodes = Array.isArray(tree) ? tree : [];
  const body = nodes.map((node, index) => {
    try {
      return (
        <Fragment key={index}>{renderer.renderNode(node, [index])}</Fragment>
      );
    } catch (renderError) {
      return (
        <div
          key={index}
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: 8,
            color: "#b91c1c",
            fontFamily: "sans-serif",
            margin: "8px 0",
            padding: 16,
          }}
        >
          {renderError.message}
        </div>
      );
    }
  });

  const draggedSelector =
    dragIndex !== null
      ? `[data-of-path='${JSON.stringify([dragIndex])}']`
      : null;
  const dropSelector = dropTarget
    ? `[data-of-path='${JSON.stringify([dropTarget.index])}']`
    : null;
  const dragHighlightCss = `
    ${draggedSelector ? `${draggedSelector} > * { opacity: 0.35; }` : ""}
    ${
      dropSelector
        ? `${dropSelector} > * { outline: 3px solid #3b82f6; outline-offset: -3px; }`
        : ""
    }
  `;

  const selectedMeta = selectedBlockId ? getBlockPaletteMeta(selectedBlockId) : null;
  const SelectedIcon = selectedMeta?.icon;
  const selectedName =
    (selectedBlockId && defaultThemeBlockRegistry.get(selectedBlockId)?.definition?.name) ||
    "Block";

  // Anchored with position:fixed directly off the measured rect (viewport
  // coordinates, same frame getBoundingClientRect() reports in), clamped so
  // the label/toolbar tuck inside the box instead of clipping off-screen
  // when the selected block sits flush against the top of the frame.
  const labelTop = selectionRect
    ? selectionRect.top < 28
      ? selectionRect.top + 6
      : selectionRect.top - 24
    : 0;
  const toolbarTop = labelTop;
  const toolbarLeft = selectionRect
    ? Math.max(8, selectionRect.left + selectionRect.width - 58)
    : 0;

  return (
    <div
      onClick={() => {
        clearSelection();
        window.parent.postMessage(
          { type: "of-canvas-select", path: null },
          window.location.origin,
        );
      }}
    >
      {/* Token CSS is generated and validated by packages/design-tokens, never raw user input. */}
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <style
        dangerouslySetInnerHTML={{ __html: dragHighlightCss }}
        id={DRAG_HIGHLIGHT_STYLE_ID}
      />
      <style>{`
        .of-selection-btn { align-items: center; background: none; border: 0; border-radius: 999px; color: ${SELECTION_INK_TEXT}; cursor: pointer; display: inline-flex; height: 22px; justify-content: center; width: 22px; }
        .of-selection-btn:hover { background: rgba(255, 255, 255, 0.18); }
        .of-selection-btn[data-grab="true"] { cursor: grab; }
      `}</style>
      {body}
      {selectionRect ? (
        <div style={{ inset: 0, pointerEvents: "none", position: "fixed", zIndex: 2147483000 }}>
          <div
            style={{
              border: `2px solid ${SELECTION_INK}`,
              borderRadius: 2,
              boxShadow: "0 0 0 1px rgba(255, 255, 255, 0.85)",
              height: selectionRect.height,
              left: selectionRect.left,
              position: "fixed",
              top: selectionRect.top,
              width: selectionRect.width,
            }}
          />

          <div
            style={{
              alignItems: "center",
              background: SELECTION_INK,
              borderRadius: "3px 3px 3px 0",
              color: SELECTION_INK_TEXT,
              display: "inline-flex",
              fontFamily: "system-ui, sans-serif",
              fontSize: 11,
              fontWeight: 600,
              gap: 5,
              left: selectionRect.left,
              lineHeight: 1,
              padding: "5px 8px",
              position: "fixed",
              top: labelTop,
              whiteSpace: "nowrap",
            }}
          >
            {SelectedIcon ? <SelectedIcon size={12} /> : null}
            {selectedName}
          </div>

          <div
            style={{
              background: SELECTION_INK,
              borderRadius: 999,
              display: "flex",
              gap: 2,
              left: toolbarLeft,
              padding: 2,
              pointerEvents: "auto",
              position: "fixed",
              top: toolbarTop,
            }}
          >
            <button className="of-selection-btn" data-grab="true" title="Drag to reorder" type="button">
              <Grip size={13} />
            </button>
            <button
              className="of-selection-btn"
              onClick={handleRemoveSelected}
              title="Remove block"
              type="button"
            >
              <X size={13} />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
