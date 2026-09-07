import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDb } from "../../../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../../../src/lib/session.js";
import {
  getWorkspaceManager,
  listPages,
} from "../../../../../../src/lib/site-workspace.js";

export default async function DashboardPage({ params }) {
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
    // No workspace yet — an empty page list.
  }

  const [contentItems, assets, menus] = await Promise.all([
    db.select().from(schema.contentItems).where(eq(schema.contentItems.siteId, site.id)),
    db.select().from(schema.assets).where(eq(schema.assets.siteId, site.id)),
    db.select().from(schema.menus).where(eq(schema.menus.siteId, site.id)),
  ]);

  const posts = contentItems.filter((item) => item.type === "post");
  const recentContent = [...contentItems]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Dashboard</p>
          <h1 className="page-title">/{site.slug}</h1>
          <p className="page-subtitle">
            <span
              className={
                site.status === "published"
                  ? "badge badge-published"
                  : "badge badge-draft"
              }
            >
              {site.status}
            </span>
          </p>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-card-value">{pages.length}</span>
          <span className="stat-card-label">Pages</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-value">{posts.length}</span>
          <span className="stat-card-label">Posts</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-value">{assets.length}</span>
          <span className="stat-card-label">Media files</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-value">{contentItems.length}</span>
          <span className="stat-card-label">Content entries</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-value">{menus.length}</span>
          <span className="stat-card-label">Menus</span>
        </div>
      </div>

      <div className="quick-links">
        <Link className="quick-link" href={`/sites/${site.id}/pages`}>
          <span className="quick-link-title">Pages</span>
          <span className="quick-link-body">Manage this site&apos;s files</span>
        </Link>
        <Link className="quick-link" href={`/sites/${site.id}/media`}>
          <span className="quick-link-title">Media</span>
          <span className="quick-link-body">Images and other uploads</span>
        </Link>
        <Link className="quick-link" href={`/sites/${site.id}/appearance/design-tokens`}>
          <span className="quick-link-title">Design Tokens</span>
          <span className="quick-link-body">Color, type, spacing, radius</span>
        </Link>
        <Link className="quick-link" href={`/sites/${site.id}/settings`}>
          <span className="quick-link-title">Settings</span>
          <span className="quick-link-body">Name, domain, and status</span>
        </Link>
      </div>

      <div className="stack">
        <div className="page-header">
          <div>
            <h2 className="page-title" style={{ fontSize: "var(--text-lg)" }}>
              Recent activity
            </h2>
            <p className="page-subtitle">
              The latest content edited on this site.
            </p>
          </div>
        </div>
        {recentContent.length === 0 ? (
          <p className="muted">Nothing edited yet.</p>
        ) : (
          <div className="card">
            {recentContent.map((item) => (
              <Link
                className="list-row"
                href={`/sites/${site.id}/content/${item.id}`}
                key={item.id}
              >
                <div>
                  <div className="list-row-title">{item.title}</div>
                  <div className="list-row-meta">
                    {item.type} · {item.status}
                  </div>
                </div>
                <span
                  className={
                    item.status === "published"
                      ? "badge badge-published"
                      : "badge badge-draft"
                  }
                >
                  {item.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
