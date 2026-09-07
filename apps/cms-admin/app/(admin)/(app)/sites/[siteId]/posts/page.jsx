import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { EmptyIllustration } from "../../../../../../src/components/EmptyIllustration.jsx";
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
          <EmptyIllustration variant="pages" />
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
