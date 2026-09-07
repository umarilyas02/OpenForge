import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { AddUserForm } from "../../../../../../src/components/AddUserForm.jsx";
import { getDb } from "../../../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../../../src/lib/session.js";
import { addUser } from "./actions.js";

export default async function UsersPage({ params }) {
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

  const rows = await db
    .select({
      role: schema.organizationMembers.role,
      status: schema.organizationMembers.status,
      userId: schema.users.id,
      displayName: schema.users.displayName,
      email: schema.users.email,
    })
    .from(schema.organizationMembers)
    .innerJoin(
      schema.users,
      eq(schema.organizationMembers.userId, schema.users.id),
    )
    .where(eq(schema.organizationMembers.organizationId, site.organizationId));

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Users</p>
          <h1 className="page-title">All Users</h1>
          <p className="page-subtitle">
            People with access to this organization&apos;s sites.
          </p>
        </div>
      </div>

      <div className="card">
        {rows.map((row) => (
          <div className="list-row" key={row.userId}>
            <div>
              <div className="list-row-title">{row.displayName}</div>
              <div className="list-row-meta">{row.email}</div>
            </div>
            <span className="badge badge-draft" style={{ textTransform: "capitalize" }}>
              {row.role}
            </span>
          </div>
        ))}
      </div>

      <AddUserForm addUser={addUser} siteId={site.id} />
    </div>
  );
}
