"use client";

import { History as HistoryIcon, RotateCcw, X } from "lucide-react";
import { useEffect, useState } from "react";

import { diffLines, summarizeDiff } from "../lib/line-diff.js";

/**
 * Slide-over panel listing a page's real revision history: one entry per
 * git commit that touched this page file in the site's git-backed
 * workspace repo (see source-content-actions.js's listPageRevisions).
 * Every block-editor save already produces a commit there, so this list
 * *is* the page's authoritative history — there is no separate database
 * table behind it (the older `content_revisions` Postgres table only ever
 * recorded saves for the earlier, now-superseded database-JSON content
 * model that on-disk pages like this one never touch).
 *
 * Selecting a revision loads its exact historical source and previews a
 * line diff against the page's current source; Restore writes that
 * historical source back as the current page through the same real
 * save/commit path as any other edit (see restorePageRevisionAction),
 * which SourceContentEditor.jsx also records on its own undo stack, so a
 * restore itself can be undone with Ctrl+Z like any other change.
 *
 * @param {{
 *   open: boolean,
 *   onClose: () => void,
 *   siteId: string,
 *   pagePath: string,
 *   currentSource: string,
 *   listPageRevisionsAction: Function,
 *   getPageRevisionSourceAction: Function,
 *   onRestore: (hash: string) => void,
 *   restoring: boolean,
 * }} props
 */
export function PageHistoryPanel({
  open,
  onClose,
  siteId,
  pagePath,
  currentSource,
  listPageRevisionsAction,
  getPageRevisionSourceAction,
  onRestore,
  restoring,
}) {
  const [revisions, setRevisions] = useState(null);
  const [listError, setListError] = useState(null);
  const [selectedHash, setSelectedHash] = useState(null);
  const [previewSource, setPreviewSource] = useState(null);
  const [previewError, setPreviewError] = useState(null);
  const [loadingPreview, setLoadingPreview] = useState(false);

  useEffect(() => {
    if (!open) return undefined;
    let cancelled = false;
    setRevisions(null);
    setListError(null);
    setSelectedHash(null);
    setPreviewSource(null);
    setPreviewError(null);

    listPageRevisionsAction(siteId, pagePath)
      .then((list) => {
        if (!cancelled) setRevisions(list);
      })
      .catch((caught) => {
        if (!cancelled) {
          setListError(caught instanceof Error ? caught.message : String(caught));
        }
      });

    return () => {
      cancelled = true;
    };
  }, [open, siteId, pagePath, listPageRevisionsAction]);

  function selectRevision(hash) {
    setSelectedHash(hash);
    setPreviewSource(null);
    setPreviewError(null);
    setLoadingPreview(true);
    getPageRevisionSourceAction(siteId, pagePath, hash)
      .then((source) => setPreviewSource(source))
      .catch((caught) => {
        setPreviewError(caught instanceof Error ? caught.message : String(caught));
      })
      .finally(() => setLoadingPreview(false));
  }

  if (!open) return null;

  const diff =
    previewSource != null ? diffLines(previewSource, currentSource) : null;
  const summary = diff ? summarizeDiff(diff) : null;
  const isCurrentRevision = diff != null && summary.added === 0 && summary.removed === 0;

  return (
    <>
      <div
        aria-hidden="true"
        className="history-panel-backdrop"
        onClick={onClose}
      />
      <aside aria-label="Revision history" className="history-panel" role="dialog">
        <header className="history-panel-header">
          <h2 className="history-panel-title">
            <HistoryIcon size={15} strokeWidth={2} />
            Revision history
          </h2>
          <button
            aria-label="Close revision history"
            className="toolbar-icon-btn"
            onClick={onClose}
            type="button"
          >
            <X size={15} strokeWidth={2} />
          </button>
        </header>

        <div className="history-panel-body">
          <div className="history-panel-list">
            {listError && <p className="history-panel-error">{listError}</p>}
            {revisions === null && !listError && (
              <p className="history-panel-empty">Loading revisions…</p>
            )}
            {revisions?.length === 0 && (
              <p className="history-panel-empty">
                No saved revisions for this page yet — every edit you make
                will show up here.
              </p>
            )}
            {revisions?.map((revision) => (
              <button
                className="history-panel-item"
                data-active={revision.hash === selectedHash}
                key={revision.hash}
                onClick={() => selectRevision(revision.hash)}
                type="button"
              >
                <span className="history-panel-item-message">
                  {revision.message}
                </span>
                <span className="history-panel-item-meta">
                  <span className="history-panel-item-hash">
                    {revision.hash}
                  </span>
                  <time dateTime={revision.date}>
                    {formatRevisionDate(revision.date)}
                  </time>
                </span>
              </button>
            ))}
          </div>

          {selectedHash && (
            <div className="history-panel-preview">
              {loadingPreview && (
                <p className="history-panel-empty">Loading preview…</p>
              )}
              {previewError && (
                <p className="history-panel-error">{previewError}</p>
              )}
              {diff && (
                <>
                  <div className="history-panel-preview-summary">
                    {isCurrentRevision ? (
                      <span className="history-panel-empty" style={{ padding: 0 }}>
                        This is the current content.
                      </span>
                    ) : (
                      <>
                        <span className="history-diff-added">
                          +{summary.added}
                        </span>
                        <span className="history-diff-removed">
                          -{summary.removed}
                        </span>
                      </>
                    )}
                    <button
                      className="btn btn-primary history-panel-restore"
                      disabled={restoring || isCurrentRevision}
                      onClick={() => onRestore(selectedHash)}
                      type="button"
                    >
                      <RotateCcw size={13} strokeWidth={2} />
                      Restore this version
                    </button>
                  </div>
                  <pre className="history-panel-diff">
                    {diff.map((op, index) => (
                      <div
                        className="history-diff-line"
                        data-type={op.type}
                        key={index}
                      >
                        <span className="history-diff-marker">
                          {op.type === "added"
                            ? "+"
                            : op.type === "removed"
                              ? "-"
                              : " "}
                        </span>
                        <span>{op.line}</span>
                      </div>
                    ))}
                  </pre>
                </>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}

function formatRevisionDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}
