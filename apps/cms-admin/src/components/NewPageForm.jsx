"use client";

import { TextInput } from "@primer/react";
import { useActionState, useState } from "react";

const initialState = { error: null };

/**
 * @param {{ siteId: string, createPage: Function }} props
 */
export function NewPageForm({ siteId, createPage }) {
  const action = createPage.bind(null, siteId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const [open, setOpen] = useState(false);

  if (!open) {
    return (
      <button
        className="btn btn-primary"
        onClick={() => setOpen(true)}
        type="button"
      >
        New page
      </button>
    );
  }

  return (
    <form action={formAction} className="card stack prose-width">
      <div className="form-field">
        <label htmlFor="path">Path</label>
        <TextInput
          block
          id="path"
          name="path"
          placeholder="about (leave blank for the homepage)"
        />
        <span className="form-hint">
          Creates <code>app/&lt;path&gt;/page.jsx</code> — a real file in this
          site's project.
        </span>
      </div>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      <div className="form-actions">
        <button className="btn btn-primary" disabled={pending} type="submit">
          {pending ? "Creating…" : "Create page"}
        </button>
        <button
          className="btn btn-ghost"
          onClick={() => setOpen(false)}
          type="button"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
