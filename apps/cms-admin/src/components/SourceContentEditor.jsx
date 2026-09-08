"use client";

import { ArrowLeft, ChevronRight, ExternalLink, Redo2, Undo2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";

import { PREVIEW_WIDTHS } from "../lib/preview-modes.js";
import { CanvasEditor } from "./CanvasEditor.jsx";
import { useHideAppTopbar } from "./PageChromeContext.jsx";

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
 *   initialSource: string,
 *   initialThemeId: string,
 *   initialTokenOverrides: object,
 *   catalog: object[],
 *   allowedBlockIds: string[],
 *   libraryCatalog: object[],
 *   updateBlockProps: Function,
 *   moveBlockAction: Function,
 *   insertBlockAction: Function,
 *   insertLibraryComponentAction: Function,
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
  initialSource,
  initialThemeId,
  initialTokenOverrides,
  catalog,
  allowedBlockIds,
  libraryCatalog,
  updateBlockProps,
  moveBlockAction,
  insertBlockAction,
  insertLibraryComponentAction,
  removeBlockAction,
  duplicateBlockAction,
  restorePageSourceAction,
}) {
  useHideAppTopbar();

  const [tree, setTree] = useState(initialTree);
  const [source, setSource] = useState(initialSource);
  const [themeId, setThemeId] = useState(initialThemeId);
  const [tokenOverrides, setTokenOverrides] = useState(initialTokenOverrides);
  const [past, setPast] = useState([]);
  const [future, setFuture] = useState([]);
  const [previewMode, setPreviewMode] = useState("desktop");
  const [error, setError] = useState(null);
  const [pending, startTransition] = useTransition();

  const sourceRef = useRef(source);
  sourceRef.current = source;

  // Every mutation re-parses the page's real JSX and targets a node by an id
  // that's positional (derived from the node's place among the file's
  // top-level statements — see @openforge/compiler's buildProjectIndex), so
  // an import added by one in-flight edit can renumber every id a second,
  // already-issued edit is about to act on. Chaining every dispatch through
  // one promise queue means the server call for edit N+1 never starts until
  // edit N's has actually landed and been re-read, so N+1 always resolves
  // ids against post-N file content — and because the queue guarantees
  // responses arrive in the same order they were dispatched, there's no
  // "stale response" case left to guard against separately.
  const dispatchQueue = useRef(Promise.resolve());

  function applyState(result) {
    setTree(result.tree);
    setSource(result.source);
    if (result.themeId !== undefined) setThemeId(result.themeId);
    if (result.tokenOverrides !== undefined) setTokenOverrides(result.tokenOverrides);
  }

  /**
   * @param {() => Promise<object>} action
   * @param {{ recordHistory?: boolean }} [options] recordHistory is false
   *   for undo/redo themselves — they manage the past/future stacks
   *   explicitly around the call instead.
   */
  function dispatch(action, { recordHistory = true } = {}) {
    if (recordHistory) {
      setPast((current) => [...current, sourceRef.current]);
      setFuture([]);
    }
    setError(null);
    // The queue (above) guarantees these settle in the exact order they were
    // dispatched in, so — unlike the old unordered-concurrent version of
    // this function — there's no "newer" response a stale one could ever
    // clobber; every result here is by construction the most current one
    // available at the moment it arrives, safe to apply unconditionally.
    const queued = dispatchQueue.current.catch(() => {}).then(action);
    dispatchQueue.current = queued.catch(() => {});
    startTransition(async () => {
      try {
        applyState(await queued);
      } catch (caught) {
        setError(caught instanceof Error ? caught.message : String(caught));
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
    onInsertLibraryComponent: (componentId) =>
      dispatch(() =>
        insertLibraryComponentAction(siteId, pagePath, componentId),
      ),
  };

  return (
    <div className="editor-fullbleed">
      <div className="editor-toolbar">
        <div className="editor-toolbar-identity">
          <Link
            className="editor-toolbar-back"
            href={`/sites/${siteId}/pages`}
            title="Back to pages"
          >
            <ArrowLeft size={16} strokeWidth={2} />
          </Link>
          <span aria-hidden="true" className="editor-toolbar-rule" />
          <div className="editor-toolbar-breadcrumb">
            <Link href={`/sites/${siteId}/pages`}>Pages</Link>
            <ChevronRight
              aria-hidden="true"
              className="editor-toolbar-crumb-sep"
              size={13}
              strokeWidth={2}
            />
            <span className="editor-toolbar-title" title={pagePath}>
              {pageTitle}
            </span>
          </div>
        </div>

        <div className="editor-toolbar-center">
          <div className="editor-toolbar-cluster">
            <div className="editor-history-actions">
              <button
                className="toolbar-icon-btn"
                disabled={past.length === 0}
                onClick={undo}
                title="Undo (Ctrl+Z)"
                type="button"
              >
                <Undo2 size={15} strokeWidth={2} />
              </button>
              <button
                className="toolbar-icon-btn"
                disabled={future.length === 0}
                onClick={redo}
                title="Redo (Ctrl+Shift+Z)"
                type="button"
              >
                <Redo2 size={15} strokeWidth={2} />
              </button>
            </div>

            <span aria-hidden="true" className="editor-toolbar-cluster-rule" />

            <div
              aria-label="Canvas viewport"
              className="canvas-device-toggle"
              role="tablist"
            >
              {Object.entries(PREVIEW_WIDTHS).map(([mode, config]) => {
                const Icon = config.icon;
                return (
                  <button
                    aria-selected={previewMode === mode}
                    data-active={previewMode === mode}
                    key={mode}
                    onClick={() => setPreviewMode(mode)}
                    role="tab"
                    title={config.label}
                    type="button"
                  >
                    <Icon size={15} strokeWidth={2} />
                  </button>
                );
              })}
            </div>

            <span aria-hidden="true" className="editor-toolbar-cluster-rule" />

            <p className="editor-toolbar-readout">
              <span className="editor-toolbar-readout-label">
                {PREVIEW_WIDTHS[previewMode].label}
              </span>
              <span className="editor-toolbar-readout-value">
                {PREVIEW_WIDTHS[previewMode].width === "100%"
                  ? "Fluid"
                  : PREVIEW_WIDTHS[previewMode].width}
              </span>
            </p>
          </div>
        </div>

        <div className="editor-toolbar-actions">
          <p
            className="editor-toolbar-status"
            data-state={error ? "error" : pending ? "saving" : "saved"}
            title={error ?? undefined}
          >
            <span aria-hidden="true" className="editor-toolbar-status-dot" />
            {error ? error : pending ? "Saving…" : "Saved"}
          </p>
          <span aria-hidden="true" className="editor-toolbar-rule" />
          <a
            className="btn btn-ghost editor-toolbar-btn"
            href={`/preview/${siteId}`}
            rel="noreferrer"
            target="_blank"
          >
            Preview
            <ExternalLink size={13} strokeWidth={2} />
          </a>
          <Link
            className="btn btn-primary editor-toolbar-btn editor-toolbar-publish"
            href={`/sites/${siteId}/settings`}
          >
            Publish
          </Link>
        </div>
      </div>

      <CanvasEditor
        allowedBlockIds={allowedBlockIds}
        catalog={catalog}
        libraryCatalog={libraryCatalog}
        previewMode={previewMode}
        themeId={themeId}
        tokenOverrides={tokenOverrides}
        tree={tree}
        {...handlers}
      />
    </div>
  );
}
