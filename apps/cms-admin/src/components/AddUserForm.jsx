"use client";

import { TextInput } from "@primer/react";
import { useActionState } from "react";

const initialState = { error: null, addedEmail: null, tempPassword: null };

/**
 * @param {{ siteId: string, addUser: Function }} props
 */
export function AddUserForm({ siteId, addUser }) {
  const action = addUser.bind(null, siteId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="card stack prose-width" key={state.addedEmail}>
      <p className="editor-rail-label">Add new</p>

      <div className="form-field">
        <label htmlFor="name">Name</label>
        <TextInput block id="name" name="name" required />
      </div>
      <div className="form-field">
        <label htmlFor="email">Email</label>
        <TextInput block id="email" name="email" required type="email" />
      </div>
      <div className="form-field">
        <label htmlFor="role">Role</label>
        <select defaultValue="member" id="role" name="role">
          <option value="owner">Owner</option>
          <option value="editor">Editor</option>
          <option value="member">Member</option>
        </select>
      </div>
      <div className="form-field">
        <label htmlFor="password">Temporary password</label>
        <TextInput
          autoComplete="new-password"
          block
          id="password"
          name="password"
          type="password"
        />
        <span className="form-hint">
          Only used if this email doesn&apos;t have an account yet — there&apos;s
          no outbound email in this install, so share it with them directly.
        </span>
      </div>

      {state.error ? <p className="form-error">{state.error}</p> : null}
      {!state.error && state.addedEmail ? (
        <p className="form-success">
          ✓ Added {state.addedEmail}
          {state.tempPassword
            ? ` — temporary password: ${state.tempPassword}`
            : " to this organization."}
        </p>
      ) : null}

      <div className="form-actions">
        <button className="btn btn-primary" disabled={pending} type="submit">
          {pending ? "Adding…" : "Add user"}
        </button>
      </div>
    </form>
  );
}
