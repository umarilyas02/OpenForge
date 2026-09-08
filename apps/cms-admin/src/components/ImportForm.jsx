"use client";

import { useActionState } from "react";

const initialState = { error: null, imported: 0, token: null };

/**
 * Tools > Import's file form. `key={state.token}` remounts the form after a
 * successful import so the native file input clears — the same trick
 * UploadAssetForm.jsx uses for the media library's upload form.
 *
 * @param {{ importContent: Function }} props
 */
export function ImportForm({ importContent }) {
  const [state, formAction, pending] = useActionState(
    importContent,
    initialState,
  );

  return (
    <form action={formAction} className="stack-sm" key={state.token ?? "idle"}>
      <div className="form-field">
        <label htmlFor="import-file">Markdown or JSON file</label>
        <input
          accept=".md,.markdown,.txt,.json"
          id="import-file"
          name="file"
          required
          type="file"
        />
        <span className="form-hint">
          One Markdown post (optional --- frontmatter: title, slug, type,
          status) or a JSON array of {"{ title, slug, type, status, body }"}.
        </span>
      </div>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {!state.error && state.imported ? (
        <p className="form-success">
          ✓ Imported {state.imported} item{state.imported === 1 ? "" : "s"}.
        </p>
      ) : null}
      <div className="form-actions">
        <button className="btn btn-primary" disabled={pending} type="submit">
          {pending ? "Importing…" : "Import"}
        </button>
      </div>
    </form>
  );
}
