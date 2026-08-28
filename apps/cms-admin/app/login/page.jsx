"use client";

import { Button, Heading, TextInput } from "@primer/react";
import { useActionState } from "react";

import { login } from "./actions.js";

const initialState = { error: null };

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, initialState);

  return (
    <div className="page-narrow">
      <div className="card stack">
        <Heading as="h1">Sign in</Heading>
        <form action={formAction} className="stack">
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <TextInput
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
            />
          </div>
          <div className="form-field">
            <label htmlFor="password">Password</label>
            <TextInput
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
            />
          </div>
          {state.error ? <p className="form-error">{state.error}</p> : null}
          <div className="form-actions">
            <Button type="submit" disabled={pending} variant="primary">
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
