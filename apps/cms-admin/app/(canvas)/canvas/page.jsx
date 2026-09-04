"use client";

import { defaultDesignTokens } from "@openforge/design-tokens";
import { createRenderer, renderSiteStyles } from "@openforge/renderer";
import {
  defaultTheme,
  defaultThemeBlockRegistry,
} from "@openforge/theme-default";
import { useEffect, useState } from "react";

const DRAG_HIGHLIGHT_STYLE_ID = "of-canvas-drag-highlight";

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

  let body;
  try {
    body = renderer.renderTree(tree);
  } catch (renderError) {
    return (
      <p style={{ color: "#b91c1c", fontFamily: "sans-serif", padding: 24 }}>
        {renderError.message}
      </p>
    );
  }

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

  return (
    <div
      onClick={() =>
        window.parent.postMessage(
          { type: "of-canvas-select", path: null },
          window.location.origin,
        )
      }
    >
      {/* Token CSS is generated and validated by packages/design-tokens, never raw user input. */}
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <style
        dangerouslySetInnerHTML={{ __html: dragHighlightCss }}
        id={DRAG_HIGHLIGHT_STYLE_ID}
      />
      {body}
    </div>
  );
}
