import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDb } from "../../../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../../../src/lib/session.js";

export default async function AllPostsPage({ params }) {
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

  const posts = await db
    .select()
    .from(schema.contentItems)
    .where(
      and(
        eq(schema.contentItems.siteId, site.id),
        eq(schema.contentItems.type, "post"),
      ),
    );

  const sorted = [...posts].sort(
    (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt),
  );

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Posts</p>
          <h1 className="page-title">All Posts</h1>
          <p className="page-subtitle">
            Blog-style entries, published on their own dated URLs.
          </p>
        </div>
        <Link
          className="btn btn-ghost"
          href={`/sites/${site.id}/content/new?type=post`}
        >
          Add new
        </Link>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">
            <svg fill="none" height="20" viewBox="0 0 16 16" width="20">
              <path d="M3 3h10M3 3v10h10V3M3 3l4.5 5L3 13M8 13h5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
            </svg>
          </span>
          <p className="empty-state-title">No posts yet</p>
          <p className="empty-state-body">
            Posts are content entries of type &quot;post&quot; — write your
            first one.
          </p>
        </div>
      ) : (
        <div className="card">
          {sorted.map((post) => (
            <Link
              className="list-row"
              href={`/sites/${site.id}/content/${post.id}`}
              key={post.id}
            >
              <div>
                <div className="list-row-title">{post.title}</div>
                <div className="list-row-meta">/{post.slug}</div>
              </div>
              <span
                className={
                  post.status === "published"
                    ? "badge badge-published"
                    : "badge badge-draft"
                }
              >
                {post.status}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
