import { Button, Heading } from "@primer/react";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import Link from "next/link";

import { getDb } from "../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../src/lib/session.js";

export default async function SitesPage() {
  const user = await requireUser();
  const memberships = await getMemberships(user.id);
  const membership = memberships.find((entry) => entry.status === "active");

  if (!membership) {
    return (
      <div className="stack">
        <Heading as="h1">Sites</Heading>
        <p className="muted">
          You don&apos;t belong to an active organization yet. Create one and
          add yourself as a member via <code>tooling/scripts</code>, then reload
          this page.
        </p>
      </div>
    );
  }

  const db = getDb();
  const sites = await db
    .select()
    .from(schema.sites)
    .where(eq(schema.sites.organizationId, membership.organizationId));

  return (
    <div className="stack">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Heading as="h1">Sites</Heading>
        <Link href="/sites/new">
          <Button variant="primary">New site</Button>
        </Link>
      </div>

      <div className="card">
        {sites.length === 0 ? (
          <p className="muted">No sites yet.</p>
        ) : (
          sites.map((site) => (
            <div className="list-row" key={site.id}>
              <div>
                <Link href={`/sites/${site.id}`}>
                  <strong>{site.name}</strong>
                </Link>
                <div className="muted">/{site.slug}</div>
              </div>
              <span
                className={
                  site.status === "published"
                    ? "badge badge-published"
                    : "badge badge-draft"
                }
              >
                {site.status}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
