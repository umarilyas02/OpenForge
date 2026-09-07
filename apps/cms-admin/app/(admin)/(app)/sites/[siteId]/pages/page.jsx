import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyIllustration } from "../../../../../../src/components/EmptyIllustration.jsx";
import { NewPageForm } from "../../../../../../src/components/NewPageForm.jsx";
import { getDb } from "../../../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../../../src/lib/session.js";
import {
  getWorkspaceManager,
  listPages,
} from "../../../../../../src/lib/site-workspace.js";
import { createPage } from "./actions.js";

export default async function AllPagesPage({ params }) {
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

  const manager = getWorkspaceManager();
  let pages = [];
  let workspaceError = null;
  try {
    const files = await manager.readFiles(site.slug);
    pages = listPages(files);
  } catch (error) {
    workspaceError = error.message;
  }

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Pages</p>
          <h1 className="page-title">All Pages</h1>
          <p className="page-subtitle">
            The real Next.js files that make up /{site.slug}.
          </p>
        </div>
      </div>

      {workspaceError ? (
        <p className="form-error">
          Could not read this site&apos;s project files: {workspaceError}
        </p>
      ) : pages.length === 0 ? (
        <div className="empty-state">
          <EmptyIllustration variant="pages" />
          <p className="empty-state-title">No pages yet</p>
          <p className="empty-state-body">
            Create the homepage to get started.
          </p>
        </div>
      ) : (
        <div className="card">
          {pages.map((page) => (
            <Link
              className="list-row"
              href={`/sites/${site.id}/pages/editor?file=${encodeURIComponent(page.filePath)}`}
              key={page.filePath}
            >
              <div>
                <div className="list-row-title">{page.urlPath}</div>
                <div className="list-row-meta">{page.filePath}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <NewPageForm createPage={createPage} siteId={site.id} />
    </div>
  );
}
