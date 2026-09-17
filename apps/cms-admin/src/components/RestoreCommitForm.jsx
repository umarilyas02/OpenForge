"use client";

import { useActionState } from "react";

const initialState = { error: null, ok: false };

/**
 * Restoring rewrites the site's real files on disk to an earlier commit's
 * content (as a new forward commit, never a history rewrite -- see
 * restoreSiteToCommit's own doc) -- confirms before the form ever submits,
 * matching ActivateThemeForm's pattern for the same class of action.
 *
 * @param {{ restoreSiteCommit: Function, siteId: string, hash: string, message: string }} props
 */
export function RestoreCommitForm({ restoreSiteCommit, siteId, hash, message }) {
  const restoreAction = restoreSiteCommit.bind(null, siteId, hash);
  const [state, formAction, restoring] = useActionState(restoreAction, initialState);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        const confirmed = window.confirm(
          `Restore this site's files to "${message}" (${hash})? This overwrites the site's current files -- any changes made since then are lost from the working files, though this exact restore itself is a new commit, so you can restore forward again afterward.`,
        );
        if (!confirmed) event.preventDefault();
      }}
    >
      <button className="btn btn-ghost" disabled={restoring} type="submit">
        {restoring ? "Restoring…" : "Restore"}
      </button>
      {state.error ? <p className="form-error">{state.error}</p> : null}
    </form>
  );
}
