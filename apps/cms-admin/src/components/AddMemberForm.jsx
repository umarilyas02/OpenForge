"use client";

import { Button, TextInput } from "@primer/react";
import { useActionState } from "react";

const initialState = { error: null };

/**
 * @param {{ addMember: Function }} props
 */
export function AddMemberForm({ addMember }) {
  const [state, formAction, pending] = useActionState(addMember, initialState);

  return (
    <form action={formAction} className="card stack prose-width">
      <p className="editor-rail-label">Add member</p>
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <TextInput block id="email" name="email" required type="email" />
        <span className="form-hint">
          Must already have an OpenForge account.
        </span>
      </div>
      <div className="form-field">
        <label htmlFor="role">Role</label>
        <select defaultValue="member" id="role" name="role">
          <option value="owner">Owner</option>
          <option value="admin">Admin</option>
          <option value="member">Member</option>
        </select>
      </div>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      <div className="form-actions">
        <Button disabled={pending} type="submit" variant="primary">
          {pending ? "Adding…" : "Add member"}
        </Button>
      </div>
    </form>
  );
}
