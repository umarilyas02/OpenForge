"use client";

import { useState, useTransition } from "react";

import { BlockList } from "./BlockList.jsx";
import { CanvasEditor } from "./CanvasEditor.jsx";

/**
 * The file-backed page editor: every interaction (prop edit, reorder,
 * insert, remove) is applied immediately as a real compiler operation on
 * the site's own files — there's no local draft or a "Save" button. Each
 * action's server function returns the freshly re-parsed tree, which
 * replaces local state directly, so a change that shifts node ids (see
 * source-content-actions.js's insertBlock) never leaves the UI holding a
 * stale one.
 *
 * @param {{
 *   siteId: string,
 *   pagePath: string,
 *   pageTitle: string,
 *   initialTree: object[],
 *   initialPageRootNodeId: string,
 *   catalog: object[],
 *   allowedBlockIds: string[],
 *   updateBlockProps: Function,
 *   moveBlockAction: Function,
 *   insertBlockAction: Function,
 *   removeBlockAction: Function,
 * }} props
 */
export function SourceContentEditor({
  siteId,
  pagePath,
  pageTitle,
  initialTree,
  initialPageRootNodeId,
  catalog,
  allowedBlockIds,
  updateBlockProps,
  moveBlockAction,
  insertBlockAction,
  removeBlockAction,
}) {
  const [tree, setTree] = useState(initialTree);
  const [pageRootNodeId, setPageRootNodeId] = useState(initialPageRootNodeId);
  const [view, setView] = useState("canvas");
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  function applyState(result) {
    setTree(result.tree);
    setPageRootNodeId(result.pageRootNodeId);
  }

  function run(action) {
    setError(null);
    startTransition(async () => {
      try {
        applyState(await action());
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : String(caught));
      }
    });
  }

  const handlers = {
    onPropsChange: (nodeId, nextProps) =>
      run(() => updateBlockProps(siteId, pagePath, nodeId, nextProps)),
    onMove: (movedNodeId, destinationNodeId, position) =>
      run(() =>
        moveBlockAction(
          siteId,
          pagePath,
          movedNodeId,
          destinationNodeId,
          position,
        ),
      ),
    onInsert: (blockId, containerNodeId) =>
      run(() => insertBlockAction(siteId, pagePath, blockId, containerNodeId)),
    onRemove: (nodeId) =>
      run(() => removeBlockAction(siteId, pagePath, nodeId)),
  };

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <h1 className="page-title">{pageTitle}</h1>
          <p className="page-subtitle">{pagePath}</p>
        </div>
        <div className="editor-view-toggle">
          <button
            data-active={view === "canvas"}
            onClick={() => setView("canvas")}
            type="button"
          >
            Canvas
          </button>
          <button
            data-active={view === "layers"}
            onClick={() => setView("layers")}
            type="button"
          >
            Layers
          </button>
        </div>
      </div>

      <div className="editor-meta-bar card">
        <div className="editor-meta-bar-actions">
          {error ? <p className="form-error">{error}</p> : null}
          {pending ? <p className="muted">Saving…</p> : null}
        </div>
      </div>

      {view === "canvas" ? (
        <CanvasEditor
          allowedBlockIds={allowedBlockIds}
          catalog={catalog}
          pageRootNodeId={pageRootNodeId}
          tree={tree}
          {...handlers}
        />
      ) : (
        <div className="editor-layout">
          <div className="block-canvas">
            <BlockList
              allowedBlockIds={allowedBlockIds}
              catalog={catalog}
              containerNodeId={pageRootNodeId}
              nodes={tree}
              {...handlers}
            />
          </div>
        </div>
      )}
    </div>
  );
}
