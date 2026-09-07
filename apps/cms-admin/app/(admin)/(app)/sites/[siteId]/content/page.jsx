import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDb } from "../../../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../../../src/lib/session.js";

export default async function AllContentPage({ params }) {
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

  const items = await db
    .select()
    .from(schema.contentItems)
    .where(eq(schema.contentItems.siteId, site.id));

  const sorted = [...items].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  );

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Content</p>
          <h1 className="page-title">All Content</h1>
          <p className="page-subtitle">
            Structured entries stored in the database — pages and posts with
            an editable block tree.
          </p>
        </div>
        <Link className="btn btn-ghost" href={`/sites/${site.id}/content/new`}>
          Add new
        </Link>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">
            <svg fill="none" height="20" viewBox="0 0 16 16" width="20">
              <path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
            </svg>
          </span>
          <p className="empty-state-title">No content yet</p>
          <p className="empty-state-body">
            Create a page or post entry to get started.
          </p>
        </div>
      ) : (
        <div className="card">
          {sorted.map((item) => (
            <Link
              className="list-row"
              href={`/sites/${site.id}/content/${item.id}`}
              key={item.id}
            >
              <div>
                <div className="list-row-title">{item.title}</div>
                <div className="list-row-meta">
                  {item.type} · /{item.slug}
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
