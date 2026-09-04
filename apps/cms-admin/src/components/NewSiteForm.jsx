"use client";

import { Button, TextInput } from "@primer/react";
import Link from "next/link";
import { useActionState } from "react";

const initialState = { error: null };

/**
 * @param {{ createSite: Function }} props
 */
export function NewSiteForm({ createSite }) {
  const [state, formAction, pending] = useActionState(createSite, initialState);

  return (
    <div className="stack prose-width">
      <Link className="breadcrumb" href="/sites">
        ← Sites
      </Link>
      <div className="page-header">
        <div>
          <h1 className="page-title">New site</h1>
          <p className="page-subtitle">
            Creates a real Next.js project for this site, seeded with a starter
            page.
          </p>
        </div>
      </div>
      <div className="card">
        <form action={formAction} className="stack">
          <div className="form-field">
            <label htmlFor="name">Name</label>
            <TextInput block id="name" name="name" required />
          </div>
          <div className="form-field">
            <label htmlFor="slug">Slug</label>
            <TextInput
              block
              id="slug"
              name="slug"
              placeholder="my-site"
              required
            />
            <span className="form-hint">
              Used to reach the site locally: Host header{" "}
              <code>&lt;slug&gt;.localhost:&lt;port&gt;</code>.
            </span>
          </div>
          {state.error ? <p className="form-error">{state.error}</p> : null}
          <div className="form-actions">
            <Button disabled={pending} type="submit" variant="primary">
              {pending ? "Creating…" : "Create site"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
