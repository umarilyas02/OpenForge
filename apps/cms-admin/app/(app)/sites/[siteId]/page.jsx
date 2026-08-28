import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { Button, Heading } from "@primer/react";
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

  return (
    <div className="stack">
      <Link className="muted" href="/sites">
        ← Sites
      </Link>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div>
          <Heading as="h1">{site.name}</Heading>
          <p className="muted">
            /{site.slug} · {site.status}
          </p>
        </div>
        <Link href={`/sites/${site.id}/content/new`}>
          <Button variant="primary">New page</Button>
        </Link>
      </div>

      <div className="card">
        {contentItems.length === 0 ? (
          <p className="muted">No content yet.</p>
        ) : (
          contentItems.map((item) => (
            <div className="list-row" key={item.id}>
              <div>
                <Link href={`/sites/${site.id}/content/${item.id}`}>
                  <strong>{item.title}</strong>
                </Link>
                <div className="muted">
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
            </div>
          ))
        )}
      </div>
    </div>
  );
}
