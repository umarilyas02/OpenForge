"use client";

import { TextInput } from "@primer/react";
import { useActionState } from "react";

const connectInitialState = { error: null, ok: false };
const pushInitialState = { error: null, ok: false };

/**
 * @param {{
 *   siteId: string,
 *   connection: { repoOwner: string, repoName: string, defaultBranch: string } | null,
 *   connectGitHub: Function,
 *   disconnectGitHub: Function,
 *   pushToGitHub: Function,
 * }} props
 */
export function GitHubConnectionPanel({
  siteId,
  connection,
  connectGitHub,
  disconnectGitHub,
  pushToGitHub,
}) {
  const connectAction = connectGitHub.bind(null, siteId);
  const [connectState, connectFormAction, connecting] = useActionState(
    connectAction,
    connectInitialState,
  );

  const pushAction = pushToGitHub.bind(null, siteId);
  const [pushState, pushFormAction, pushing] = useActionState(
    pushAction,
    pushInitialState,
  );

  if (connection) {
    return (
      <div className="card stack-sm">
        <div className="list-row">
          <div>
            <div className="list-row-title">
              {connection.repoOwner}/{connection.repoName}
            </div>
            <div className="list-row-meta">
              Branch: {connection.defaultBranch}
            </div>
          </div>
          <form action={disconnectGitHub.bind(null, siteId)}>
            <button className="btn btn-ghost" type="submit">
              Disconnect
            </button>
          </form>
        </div>
        <form action={pushFormAction} className="form-actions">
          <button className="btn btn-primary" disabled={pushing} type="submit">
            {pushing ? "Pushing…" : "Push to GitHub"}
          </button>
        </form>
        {pushState.error ? <p className="form-error">{pushState.error}</p> : null}
        {pushState.ok ? (
          <p className="form-success">Pushed to {connection.defaultBranch}.</p>
        ) : null}
      </div>
    );
  }

  return (
    <form action={connectFormAction} className="card stack-sm prose-width">
      <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
        Connect a GitHub repository this site can push its real project
        files to. Use a personal access token (fine-grained, scoped to this
        one repo, with "Contents: Read and write") rather than a
        password.
      </p>
      <div className="form-field">
        <label htmlFor="owner">Owner</label>
        <TextInput block id="owner" name="owner" placeholder="your-username" required />
      </div>
      <div className="form-field">
        <label htmlFor="repo">Repository</label>
        <TextInput block id="repo" name="repo" placeholder="my-site" required />
      </div>
      <div className="form-field">
        <label htmlFor="token">Personal access token</label>
        <TextInput block id="token" name="token" required type="password" />
      </div>
      {connectState.error ? <p className="form-error">{connectState.error}</p> : null}
      {connectState.ok ? <p className="form-success">Connected.</p> : null}
      <div className="form-actions">
        <button className="btn btn-primary" disabled={connecting} type="submit">
          {connecting ? "Connecting…" : "Connect"}
        </button>
      </div>
    </form>
  );
}
