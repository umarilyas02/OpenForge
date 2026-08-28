"use client";

import { Button, Heading, TextInput } from "@primer/react";
import { useActionState } from "react";

import { createSite } from "../actions.js";

const initialState = { error: null };

export default function NewSitePage() {
  const [state, formAction, pending] = useActionState(createSite, initialState);

  return (
    <div className="stack">
      <Heading as="h1">New site</Heading>
      <div className="card">
        <form action={formAction} className="stack">
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <TextInput id="name" name="name" required />
          </div>
          <div className="form-field">
            <label htmlFor="slug">Slug</label>
            <TextInput id="slug" name="slug" required placeholder="my-site" />
            <span className="muted">
              Used to reach the site locally: Host header{" "}
              <code>&lt;slug&gt;.localhost:&lt;port&gt;</code>.
            </span>
          </div>
          {state.error ? <p className="form-error">{state.error}</p> : null}
          <div className="form-actions">
            <Button type="submit" disabled={pending} variant="primary">
              {pending ? "Creating…" : "Create site"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
