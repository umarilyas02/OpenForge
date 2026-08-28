"use client";

import { Button, TextInput } from "@primer/react";
import { useActionState } from "react";

const initialState = { error: null };

/**
 * @param {{ siteId: string, createMenu: Function }} props
 */
export function MenuCreateForm({ siteId, createMenu }) {
  const action = createMenu.bind(null, siteId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="card stack prose-width">
      <p className="editor-rail-label">New menu</p>
      <div className="form-field">
        <label htmlFor="key">Key</label>
        <TextInput block id="key" name="key" placeholder="primary" required />
        <span className="form-hint">
          A stable identifier, e.g. &quot;primary&quot; or &quot;footer&quot;.
        </span>
      </div>
      <div className="form-field">
        <label htmlFor="label">Label</label>
        <TextInput
          block
          id="label"
          name="label"
          placeholder="Main navigation"
          required
        />
      </div>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      <div className="form-actions">
        <Button disabled={pending} type="submit" variant="primary">
          {pending ? "Creating…" : "Create menu"}
        </Button>
      </div>
    </form>
  );
}
