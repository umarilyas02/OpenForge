"use client";

import { Button, TextInput } from "@primer/react";
import { useActionState } from "react";

const initialState = { error: null, ok: false };

/**
 * @param {{ site: object, updateSiteSettings: Function }} props
 */
export function SiteSettingsForm({ site, updateSiteSettings }) {
  const action = updateSiteSettings.bind(null, site.id);
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="card stack prose-width">
      <p className="editor-rail-label">Site details</p>
      <div className="form-field">
        <label htmlFor="name">Name</label>
        <TextInput
          block
          defaultValue={site.name}
          id="name"
          name="name"
          required
        />
      </div>
      <div className="form-field">
        <label htmlFor="slug">Slug</label>
        <TextInput
          block
          defaultValue={site.slug}
          id="slug"
          name="slug"
          required
        />
        <span className="form-hint">
          Used as the subdomain when no custom domain is set.
        </span>
      </div>
      <div className="form-field">
        <label htmlFor="customDomain">Custom domain</label>
        <TextInput
          block
          defaultValue={site.customDomain ?? ""}
          id="customDomain"
          name="customDomain"
          placeholder="www.example.com"
        />
      </div>
      <div className="form-field">
        <label htmlFor="status">Status</label>
        <select defaultValue={site.status} id="status" name="status">
          <option value="draft">Draft</option>
          <option value="published">Published</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>
      {state.error ? <p className="form-error">{state.error}</p> : null}
      {state.ok ? <p className="form-success">Saved.</p> : null}
      <div className="form-actions">
        <Button disabled={pending} type="submit" variant="primary">
          {pending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
