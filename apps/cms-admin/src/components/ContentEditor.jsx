"use client";

import { Button, Checkbox, TextInput } from "@primer/react";
import Link from "next/link";
import { useState } from "react";

import { BlockList } from "./BlockList.jsx";

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
      <Link className="breadcrumb" href={`/sites/${siteId}`}>
        ← Back
      </Link>
      <div className="page-header">
        <div>
          <h1 className="page-title">{title || "Untitled"}</h1>
          <p className="page-subtitle">/{slug || "…"}</p>
        </div>
      </div>

      <div className="editor-layout">
        <div className="block-canvas">
          <BlockList
            allowedBlockIds={allowedBlockIds}
            catalog={catalog}
            nodes={blockTree}
            onChange={setBlockTree}
          />
        </div>

        <aside className="editor-rail card stack">
          <div className="editor-rail-section">
            <p className="editor-rail-label">Page</p>
            <div className="stack">
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
            </div>
          </div>

          <div className="editor-rail-section stack-sm">
            {error ? <p className="form-error">{error}</p> : null}
            {savedAt ? <p className="toast-success">✓ Saved</p> : null}
            <Button
              block
              disabled={pending}
              onClick={handleSave}
              variant="primary"
            >
              {pending ? "Saving…" : "Save"}
            </Button>
          </div>
        </aside>
      </div>
    </div>
  );
}
