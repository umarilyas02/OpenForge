"use client";

import { TextInput } from "@primer/react";
import { useActionState } from "react";

const initialState = { error: null };

/**
 * @param {{ menuId: string, addMenuItem: Function }} props
 */
export function MenuItemAddForm({ menuId, addMenuItem }) {
  const action = addMenuItem.bind(null, menuId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="card stack prose-width">
      <p className="editor-rail-label">Add item</p>
      <div className="form-field">
        <label htmlFor="label">Label</label>
        <TextInput block id="label" name="label" required />
      </div>
      <div className="form-field">
        <label htmlFor="url">URL</label>
        <TextInput block id="url" name="url" placeholder="/about" required />
      </div>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      <div className="form-actions">
        <button className="btn btn-primary" disabled={pending} type="submit">
          {pending ? "Adding…" : "Add item"}
        </button>
      </div>
    </form>
  );
}
