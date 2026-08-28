import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { Button } from "@primer/react";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDb } from "../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../src/lib/session.js";

export default async function SiteOverviewPage({ params }) {
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

  const contentItems = await db
    .select()
    .from(schema.contentItems)
    .where(eq(schema.contentItems.siteId, site.id));

  const stats = {
    total: contentItems.length,
    pages: contentItems.filter((item) => item.type === "page").length,
    posts: contentItems.filter((item) => item.type === "post").length,
    published: contentItems.filter((item) => item.status === "published")
      .length,
    draft: contentItems.filter((item) => item.status === "draft").length,
  };

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <h1 className="page-title">Overview</h1>
          <p className="page-subtitle">
            /{site.slug} ·{" "}
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
        <Link href={`/sites/${site.id}/content/new`}>
          <Button variant="primary">New page</Button>
        </Link>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <span className="stat-card-value">{stats.pages}</span>
          <span className="stat-card-label">Pages</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-value">{stats.posts}</span>
          <span className="stat-card-label">Posts</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-value">{stats.published}</span>
          <span className="stat-card-label">Published</span>
        </div>
        <div className="stat-card">
          <span className="stat-card-value">{stats.draft}</span>
          <span className="stat-card-label">Draft</span>
        </div>
      </div>

      <div className="quick-links">
        <Link className="quick-link" href={`/sites/${site.id}/appearance`}>
          <span className="quick-link-title">Appearance</span>
          <span className="quick-link-body">Theme, colors, and layout</span>
        </Link>
        <Link className="quick-link" href={`/sites/${site.id}/menus`}>
          <span className="quick-link-title">Menus</span>
          <span className="quick-link-body">Navigation for this site</span>
        </Link>
        <Link className="quick-link" href={`/sites/${site.id}/settings`}>
          <span className="quick-link-title">Settings</span>
          <span className="quick-link-body">Name, domain, and status</span>
        </Link>
      </div>

      {contentItems.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">
            <svg fill="none" height="20" viewBox="0 0 16 16" width="20">
              <path
                d="M4 2h5l3 3v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path d="M9 2v3h3" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          </span>
          <p className="empty-state-title">No content yet</p>
          <p className="empty-state-body">
            Start from a blank page or a starter template.
          </p>
          <Link href={`/sites/${site.id}/content/new`}>
            <Button variant="primary">New page</Button>
          </Link>
        </div>
      ) : (
        <div className="card">
          {contentItems.map((item) => (
            <Link
              className="list-row"
              href={`/sites/${site.id}/content/${item.id}`}
              key={item.id}
            >
              <div>
                <div className="list-row-title">{item.title}</div>
                <div className="list-row-meta">
                  /{item.slug} · {item.type}
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
  );
}
