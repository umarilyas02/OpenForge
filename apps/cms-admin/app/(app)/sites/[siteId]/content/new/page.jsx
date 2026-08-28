"use client";

import { Button, Heading, TextInput } from "@primer/react";
import { use, useActionState } from "react";

import { createContent } from "../actions.js";

const initialState = { error: null };

export default function NewContentPage({ params }) {
  const { siteId } = use(params);
  const action = createContent.bind(null, siteId);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <div className="stack">
      <Heading as="h1">New page</Heading>
      <div className="card">
        <form action={formAction} className="stack">
          <div className="form-field">
            <label htmlFor="title">Title</label>
            <TextInput id="title" name="title" required />
          </div>
          <div className="form-field">
            <label htmlFor="slug">Slug</label>
            <TextInput id="slug" name="slug" required placeholder="home" />
          </div>
          <div className="form-field">
            <label htmlFor="type">Type</label>
            <select id="type" name="type" defaultValue="page">
              <option value="page">Page</option>
              <option value="post">Post</option>
            </select>
          </div>
          {state.error ? <p className="form-error">{state.error}</p> : null}
          <div className="form-actions">
            <Button type="submit" disabled={pending} variant="primary">
              {pending ? "Creating…" : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
