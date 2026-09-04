"use client";

import { Button, TextInput } from "@primer/react";
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
      <Button onClick={() => setOpen(true)} variant="primary">
        New page
      </Button>
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
        <Button disabled={pending} type="submit" variant="primary">
          {pending ? "Creating…" : "Create page"}
        </Button>
        <Button onClick={() => setOpen(false)} type="button">
          Cancel
        </Button>
      </div>
    </form>
  );
}
