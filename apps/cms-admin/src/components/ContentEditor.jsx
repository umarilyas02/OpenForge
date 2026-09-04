"use client";

import { Button, Checkbox, TextInput } from "@primer/react";
import { useState } from "react";

import { BlockList } from "./BlockList.jsx";
import { CanvasEditor } from "./CanvasEditor.jsx";

/**
 * @param {{ siteId: string, initialItem: object, catalog: object[], allowedBlockIds: string[], saveContent: Function }} props
 */
export function ContentEditor({
  siteId,
  initialItem,
  catalog,
  allowedBlockIds,
  saveContent,
}) {
  const [title, setTitle] = useState(initialItem.title);
  const [slug, setSlug] = useState(initialItem.slug);
  const [published, setPublished] = useState(
    initialItem.status === "published",
  );
  const [blockTree, setBlockTree] = useState(initialItem.blockTree ?? []);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState(null);
  const [savedAt, setSavedAt] = useState(null);
  const [view, setView] = useState("canvas");

  async function handleSave() {
    setPending(true);
    setError(null);
    setSavedAt(null);

    const result = await saveContent(siteId, initialItem.id, {
      title,
      slug,
      status: published ? "published" : "draft",
      blockTree,
    });

    setPending(false);
    if (!result.ok) {
      setError(result.error);
    } else {
      setSavedAt(new Date());
    }
  }

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <h1 className="page-title">{title || "Untitled"}</h1>
          <p className="page-subtitle">/{slug || "…"}</p>
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
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <TextInput
            block
            id="title"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
          />
        </div>
        <div className="form-field">
          <label htmlFor="slug">Slug</label>
          <TextInput
            block
            id="slug"
            onChange={(event) => setSlug(event.target.value)}
            value={slug}
          />
        </div>
        <div className="toggle-row">
          <Checkbox
            checked={published}
            id="published"
            onChange={(event) => setPublished(event.target.checked)}
          />
          <label htmlFor="published">Published</label>
        </div>
        <div className="editor-meta-bar-actions">
          {error ? <p className="form-error">{error}</p> : null}
          {savedAt ? <p className="toast-success">✓ Saved</p> : null}
          <Button disabled={pending} onClick={handleSave} variant="primary">
            {pending ? "Saving…" : "Save"}
          </Button>
        </div>
      </div>

      {view === "canvas" ? (
        <CanvasEditor
          allowedBlockIds={allowedBlockIds}
          blockTree={blockTree}
          catalog={catalog}
          onChange={setBlockTree}
        />
      ) : (
        <div className="editor-layout">
          <div className="block-canvas">
            <BlockList
              allowedBlockIds={allowedBlockIds}
              catalog={catalog}
              nodes={blockTree}
              onChange={setBlockTree}
            />
          </div>
        </div>
      )}
    </div>
  );
}
