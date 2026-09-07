import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDb } from "../../../../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../../../../src/lib/session.js";
import {
  getWorkspaceManager,
  listPages,
} from "../../../../../../../src/lib/site-workspace.js";

export default async function SiteEditorPage({ params }) {
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
  try {
    const files = await manager.readFiles(site.slug);
    pages = listPages(files);
  } catch {
    // No workspace yet.
  }

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Appearance / Site Editor</p>
          <h1 className="page-title">Site Editor</h1>
          <p className="page-subtitle">
            Edit any page visually on the live canvas.
          </p>
        </div>
      </div>

      {pages.length === 0 ? (
        <p className="muted">No pages yet — create one from Pages.</p>
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
              <span className="muted" style={{ fontSize: "var(--text-xs)" }}>
                Edit visually →
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
