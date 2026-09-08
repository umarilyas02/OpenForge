"use client";

import { Redo2, Undo2 } from "lucide-react";
import { useEffect, useRef, useState, useTransition } from "react";

import { BlockList } from "./BlockList.jsx";
import { CanvasEditor } from "./CanvasEditor.jsx";

/**
 * The file-backed page editor: every interaction (prop edit, reorder,
 * insert, remove) is applied immediately as a real compiler operation on
 * the site's own files — there's no local draft or a "Save" button. Each
 * action's server function returns the freshly re-parsed tree (and the raw
 * source, for undo/redo — see below), which replaces local state directly,
 * so a change that shifts node ids (see source-content-actions.js's
 * insertBlock) never leaves the UI holding a stale one.
 *
 * Undo/redo works on full-source snapshots, not operation inverses:
 * several compiler operations (insert/remove/move/duplicate-jsx) don't
 * have a usable inverse — a first-use insert also adds an import as a
 * separate, non-invertible step — so a plain "restore this exact prior
 * source string" sidesteps that gap entirely. The stacks live in this
 * component's state (session-only, reset on reload, same as most editors'
 * in-session undo) and every restore is persisted through the same
 * save-and-commit path as any other edit.
 *
 * @param {{
 *   siteId: string,
 *   pagePath: string,
 *   pageTitle: string,
 *   initialTree: object[],
 *   initialPageRootNodeId: string,
 *   initialSource: string,
 *   catalog: object[],
 *   allowedBlockIds: string[],
 *   updateBlockProps: Function,
 *   moveBlockAction: Function,
 *   insertBlockAction: Function,
 *   removeBlockAction: Function,
 *   duplicateBlockAction: Function,
 *   restorePageSourceAction: Function,
 * }} props
 */
export function SourceContentEditor({
  siteId,
  pagePath,
  pageTitle,
  initialTree,
  initialPageRootNodeId,
  initialSource,
  catalog,
  allowedBlockIds,
  updateBlockProps,
  moveBlockAction,
  insertBlockAction,
  removeBlockAction,
  duplicateBlockAction,
  restorePageSourceAction,
}) {
  const [tree, setTree] = useState(initialTree);
  const [pageRootNodeId, setPageRootNodeId] = useState(initialPageRootNodeId);
  const [source, setSource] = useState(initialSource);
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const [view, setView] = useState("canvas");
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  // Every action here is a real round trip (read the file, re-parse it,
  // apply a compiler operation, write it back, commit) — slow enough
  // relative to typing speed that two calls can be in flight at once (e.g.
  // a debounced Style-tab edit still resolving when the user clicks
  // Remove, or two rapidly-edited fields resolving out of order). Without
  // this, whichever call happens to *resolve* last wins even if it was
  // *issued* first, silently reverting a newer edit. Tracking an
  // ever-increasing sequence number per call and only ever applying the
  // result of the most recently *issued* one — regardless of resolution
  // order — makes stale responses inert instead of corrupting state.
  const latestRequestId = useRef(0);
  const sourceRef = useRef(source);
  sourceRef.current = source;

  function applyState(result) {
    setTree(result.tree);
    setPageRootNodeId(result.pageRootNodeId);
    setSource(result.source);
  }

  /**
   * @param {() => Promise<object>} action
   * @param {{ recordHistory?: boolean }} [options] recordHistory is false
   *   for undo/redo themselves — they manage the past/future stacks
   *   explicitly around the call instead.
   */
  function dispatch(action, { recordHistory = true } = {}) {
    const requestId = (latestRequestId.current += 1);
    if (recordHistory) {
      setPast((current) => [...current, sourceRef.current]);
      setFuture([]);
    }
    setError(null);
    startTransition(async () => {
      try {
        const result = await action();
        if (requestId === latestRequestId.current) applyState(result);
      } catch (caught) {
        if (requestId === latestRequestId.current) {
          setError(caught instanceof Error ? caught.message : String(caught));
        }
      }
    });
  }

  function undo() {
    if (past.length === 0) return;
    const target = past[past.length - 1];
    setPast((current) => current.slice(0, -1));
    setFuture((current) => [...current, sourceRef.current]);
    dispatch(() => restorePageSourceAction(siteId, pagePath, target), {
      recordHistory: false,
    });
  }

  function redo() {
    if (future.length === 0) return;
    const target = future[future.length - 1];
    setFuture((current) => current.slice(0, -1));
    setPast((current) => [...current, sourceRef.current]);
    dispatch(() => restorePageSourceAction(siteId, pagePath, target), {
      recordHistory: false,
    });
  }

  useEffect(() => {
    function onKeyDown(event) {
      const isMod = event.metaKey || event.ctrlKey;
      if (!isMod || event.key.toLowerCase() !== "z") return;
      const target = event.target;
      const isEditable =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;
      if (isEditable) return;
      event.preventDefault();
      if (event.shiftKey) redo();
      else undo();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [past, future]);

  const handlers = {
    onPropsChange: (nodeId, nextProps) =>
      dispatch(() => updateBlockProps(siteId, pagePath, nodeId, nextProps)),
    onMove: (movedNodeId, destinationNodeId, position) =>
      dispatch(() =>
        moveBlockAction(
          siteId,
          pagePath,
          movedNodeId,
          destinationNodeId,
          position,
        ),
      ),
    onInsert: (blockId, containerNodeId) =>
      dispatch(() =>
        insertBlockAction(siteId, pagePath, blockId, containerNodeId),
      ),
    onRemove: (nodeId) =>
      dispatch(() => removeBlockAction(siteId, pagePath, nodeId)),
    onDuplicate: (nodeId) =>
      dispatch(() => duplicateBlockAction(siteId, pagePath, nodeId)),
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
        <div className="editor-meta-bar-row">
          <div className="editor-history-actions">
            <button
              className="icon-btn-sm"
              disabled={past.length === 0}
              onClick={undo}
              title="Undo (Ctrl+Z)"
              type="button"
            >
              <Undo2 size={14} strokeWidth={1.75} />
            </button>
            <button
              className="icon-btn-sm"
              disabled={future.length === 0}
              onClick={redo}
              title="Redo (Ctrl+Shift+Z)"
              type="button"
            >
              <Redo2 size={14} strokeWidth={1.75} />
            </button>
          </div>
          <div className="editor-meta-bar-actions">
            {error ? <p className="form-error">{error}</p> : null}
            {pending ? <p className="muted">Saving…</p> : null}
          </div>
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
