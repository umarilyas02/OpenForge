import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { GitHubConnectionPanel } from "../../../../../../src/components/GitHubConnectionPanel.jsx";
import { SiteSettingsForm } from "../../../../../../src/components/SiteSettingsForm.jsx";
import { getDb } from "../../../../../../src/lib/db.js";
import {
  getMemberships,
  requireUser,
} from "../../../../../../src/lib/session.js";
import { listSiteCommits } from "../../../../../../src/lib/site-git.js";
import { getWorkspaceManager } from "../../../../../../src/lib/site-workspace.js";
import {
  connectGitHub,
  disconnectGitHub,
  getSiteGitConnection,
  pushToGitHub,
  updateSiteSettings,
} from "./actions.js";

export default async function SiteSettingsPage({ params }) {
  const { siteId } = await params;
  const user = await requireUser();

  const db = getDb();
  const [site] = await db
    .select()
    .from(schema.sites)
    .where(eq(schema.sites.id, siteId));
  if (!site) notFound();

  const memberships = await getMemberships(user.id);
  try {
    assertSiteAccess({ userId: user.id }, site, memberships);
  } catch {
    notFound();
  }

  let commits = [];
  try {
    const { rootPath } = await getWorkspaceManager().describe(site.slug);
    commits = await listSiteCommits(rootPath);
  } catch {
    // No workspace yet, or not a git repository — an empty history.
  }

  const gitConnection = await getSiteGitConnection(site.id);

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Name, domain, and publish status.</p>
        </div>
      </div>

      <SiteSettingsForm site={site} updateSiteSettings={updateSiteSettings} />

      <div className="stack">
        <div className="page-header">
          <div>
            <h2 className="page-title">GitHub</h2>
            <p className="page-subtitle">
              Push this site's real project files to a repository you own,
              then deploy it anywhere yourself.
            </p>
          </div>
        </div>
        <GitHubConnectionPanel
          connectGitHub={connectGitHub}
          connection={gitConnection}
          disconnectGitHub={disconnectGitHub}
          pushToGitHub={pushToGitHub}
          siteId={site.id}
        />
      </div>

      <div className="stack">
        <div className="page-header">
          <div>
            <h2 className="page-title">History</h2>
            <p className="page-subtitle">
              Every save to this site's files, oldest changes at the bottom.
            </p>
          </div>
        </div>
        {commits.length === 0 ? (
          <p className="muted">No history yet.</p>
        ) : (
          <div className="card">
            {commits.map((commit) => (
              <div className="list-row" key={commit.hash}>
                <div>
                  <div className="list-row-title">{commit.message}</div>
                  <div className="list-row-meta">
                    {commit.hash} · {commit.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
