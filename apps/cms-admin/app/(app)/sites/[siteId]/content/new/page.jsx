"use client";

import { Button, TextInput } from "@primer/react";
import Link from "next/link";
import { use, useActionState, useState } from "react";

import { templatesForType } from "../../../../../../src/lib/page-templates.js";
import { createContent } from "../actions.js";

const initialState = { error: null };

export default function NewContentPage({ params }) {
  const { siteId } = use(params);
  const [type, setType] = useState("page");
  const [templateId, setTemplateId] = useState("blank");
  const action = createContent.bind(null, siteId);
  const [state, formAction, pending] = useActionState(action, initialState);
  const templates = templatesForType(type);

  return (
    <div className="stack">
      <Link className="breadcrumb" href={`/sites/${siteId}`}>
        ← Back
      </Link>
      <div className="page-header">
        <div>
          <h1 className="page-title">New content</h1>
          <p className="page-subtitle">
            Start from a template, then name and publish your page.
          </p>
        </div>
      </div>

      <form action={formAction} className="stack">
        <input name="templateId" type="hidden" value={templateId} />

        <div className="stack-sm">
          <p className="editor-rail-label">Type</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[
              { value: "page", label: "Page" },
              { value: "post", label: "Post" },
            ].map((option) => (
              <button
                className="btn btn-ghost"
                key={option.value}
                onClick={() => {
                  setType(option.value);
                  setTemplateId("blank");
                }}
                style={
                  type === option.value
                    ? { borderColor: "var(--accent)", color: "var(--accent)" }
                    : undefined
                }
                type="button"
              >
                {option.label}
              </button>
            ))}
            <input name="type" type="hidden" value={type} />
          </div>
        </div>

        <div className="stack-sm">
          <p className="editor-rail-label">Template</p>
          <div className="grid-responsive">
            {templates.map((template) => (
              <button
                className="choice-card"
                data-selected={templateId === template.id}
                key={template.id}
                onClick={() => setTemplateId(template.id)}
                type="button"
              >
                <div className="choice-card-preview">
                  {template.build().length === 0 ? (
                    <i style={{ width: "40%" }} />
                  ) : (
                    template
                      .build()
                      .map((_, index) => (
                        <i
                          key={index}
                          style={{ width: `${70 - index * 15}%` }}
                        />
                      ))
                  )}
                </div>
                <span className="choice-card-title">{template.name}</span>
                <span className="choice-card-desc">{template.description}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="card stack prose-width">
          <div className="form-field">
            <label htmlFor="title">Title</label>
            <TextInput block id="title" name="title" required />
          </div>
          <div className="form-field">
            <label htmlFor="slug">Slug</label>
            <TextInput
              block
              id="slug"
              name="slug"
              placeholder="home"
              required
            />
          </div>
          {state.error ? <p className="form-error">{state.error}</p> : null}
          <div className="form-actions">
            <Button disabled={pending} type="submit" variant="primary">
              {pending ? "Creating…" : "Create"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
