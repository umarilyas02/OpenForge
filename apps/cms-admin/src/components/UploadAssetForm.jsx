"use client";

import { TextInput } from "@primer/react";
import { useActionState } from "react";

const initialState = { error: null, uploaded: false, token: null };

/**
 * @param {{ siteId: string, addAsset: Function }} props
 */
export function UploadAssetForm({ siteId, addAsset }) {
  const action = addAsset.bind(null, siteId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form
      action={formAction}
      className="card stack prose-width"
      key={state.token ?? "idle"}
    >
      <p className="editor-rail-label">Add new</p>

      <div className="form-field">
        <label htmlFor="file">Image file</label>
        <input
          accept="image/png,image/jpeg,image/webp"
          id="file"
          name="file"
          required
          type="file"
        />
        <span className="form-hint">PNG, JPEG, or WebP — up to 10 MB.</span>
      </div>
      <div className="form-field">
        <label htmlFor="altText">Alt text</label>
        <TextInput block id="altText" name="altText" />
      </div>

      {state.error ? <p className="form-error">{state.error}</p> : null}
      {!state.error && state.uploaded ? (
        <p className="form-success">✓ Uploaded.</p>
      ) : null}

      <div className="form-actions">
        <button className="btn btn-primary" disabled={pending} type="submit">
          {pending ? "Uploading…" : "Upload"}
        </button>
      </div>
    </form>
  );
}
