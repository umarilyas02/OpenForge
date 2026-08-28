"use client";

import { Button, TextInput } from "@primer/react";
import { useActionState } from "react";

import { login } from "./actions.js";

const initialState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="page-narrow">
      <div className="card stack" style={{ width: "100%" }}>
        <div>
          <span className="app-brand-mark">OF</span>
        </div>
        <div>
          <h1 className="page-title">Sign in</h1>
          <p className="page-subtitle">OpenForge CMS admin</p>
        </div>
        <form action={formAction} className="stack">
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
              autoComplete="current-password"
              block
              id="password"
              name="password"
              required
              type="password"
            />
          </div>
          {state.error ? <p className="form-error">{state.error}</p> : null}
          <div className="form-actions">
            <Button block disabled={pending} type="submit" variant="primary">
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
