"use client";

import { Button, Textarea, TextInput } from "@primer/react";
import { useActionState, useRef } from "react";

const initialState = { error: null };

/**
 * The dashboard's "Quick Draft" card. Submits straight to
 * `quickCreatePost` (see dashboard/actions.js) and redirects into the new
 * post's editor — `intent` tells the action whether to publish immediately
 * or leave it as a draft, set by whichever button was actually clicked.
 *
 * @param {{ quickCreatePost: Function }} props
 */
export function QuickDraftForm({ quickCreatePost }) {
  const [state, formAction, pending] = useActionState(
    quickCreatePost,
    initialState,
  );
  const intentRef = useRef("draft");

  return (
    <form action={formAction} className="stack-sm">
      <input name="intent" type="hidden" value={intentRef.current} />
      <TextInput
        aria-label="Title"
        block
        disabled={pending}
        name="title"
        placeholder="What's on your mind?"
        required
      />
      <Textarea
        aria-label="Body"
        block
        disabled={pending}
        name="body"
        placeholder="Start writing…"
        resize="vertical"
        rows={4}
      />
      {state.error ? <p className="form-error">{state.error}</p> : null}
      <div className="form-actions">
        <Button
          disabled={pending}
          onClick={() => {
            intentRef.current = "draft";
          }}
          type="submit"
        >
          Save Draft
        </Button>
        <Button
          disabled={pending}
          onClick={() => {
            intentRef.current = "publish";
          }}
          type="submit"
          variant="primary"
        >
          {pending ? "Publishing…" : "Publish →"}
        </Button>
      </div>
    </form>
  );
}
