"use client";

import { Button, Checkbox, Heading, TextInput } from "@primer/react";
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
      <Heading as="h1">{title || "Untitled"}</Heading>

      <div className="card stack">
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <TextInput
            id="title"
            onChange={(event) => setTitle(event.target.value)}
            value={title}
          />
        </div>
        <div className="form-field">
          <label htmlFor="slug">Slug</label>
          <TextInput
            id="slug"
            onChange={(event) => setSlug(event.target.value)}
            value={slug}
          />
        </div>
        <label style={{ alignItems: "center", display: "flex", gap: 8 }}>
          <Checkbox
            checked={published}
            onChange={(event) => setPublished(event.target.checked)}
          />
          Published
        </label>
      </div>

      <div className="card">
        <BlockList
          allowedBlockIds={allowedBlockIds}
          catalog={catalog}
          nodes={blockTree}
          onChange={setBlockTree}
        />
      </div>

      {error ? <p className="form-error">{error}</p> : null}
      {savedAt ? <p className="muted">Saved.</p> : null}
      <div className="form-actions">
        <Button disabled={pending} onClick={handleSave} variant="primary">
          {pending ? "Saving…" : "Save"}
        </Button>
      </div>
    </div>
  );
}
