"use client";

import { Button, TextInput } from "@primer/react";
import { useActionState } from "react";

import { setup } from "./actions.js";

const initialState = { error: null };

/**
 * First-run "create your account" form, shown at `/login` in place of the
 * sign-in form only while this install has zero users. Once submitted
 * successfully there is no way to reach this form again — a second visit to
 * `/login` renders `LoginForm` instead (see `page.jsx`), and the `setup`
 * Server Action itself refuses to create a second account even if this form
 * is somehow submitted again.
 */
export function SetupForm() {
  const [state, formAction, pending] = useActionState(setup, initialState);

  return (
    <div className="page-narrow">
      <div className="card stack" style={{ width: "100%" }}>
        <div>
          <span className="app-brand-mark">OF</span>
        </div>
        <div>
          <h1 className="page-title">Set up your account</h1>
          <p className="page-subtitle">
            Create the one admin account for this OpenForge install.
          </p>
        </div>
        <form action={formAction} className="stack">
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <TextInput
              autoComplete="name"
              block
              id="name"
              name="name"
              required
            />
          </div>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <TextInput
              autoComplete="email"
              block
              id="email"
              name="email"
              required
              type="email"
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <TextInput
              autoComplete="new-password"
              block
              id="password"
              name="password"
              required
              type="password"
            />
            <span className="form-hint">At least 8 characters.</span>
          </div>
          <div className="form-field">
            <label htmlFor="confirmPassword">Confirm password</label>
            <TextInput
              autoComplete="new-password"
              block
              id="confirmPassword"
              name="confirmPassword"
              required
              type="password"
            />
          </div>
          {state.error ? <p className="form-error">{state.error}</p> : null}
          <div className="form-actions">
            <Button block disabled={pending} type="submit" variant="primary">
              {pending ? "Creating account…" : "Create account"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
