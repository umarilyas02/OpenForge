import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";

import { AddMemberForm } from "../../../src/components/AddMemberForm.jsx";
import { TeamMemberList } from "../../../src/components/TeamMemberList.jsx";
import { getDb } from "../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../src/lib/session.js";
import { addMember, changeMemberRole, removeMember } from "./actions.js";

export default async function TeamPage() {
  const user = await requireUser();
  const memberships = await getMemberships(user.id);
  const membership = memberships.find((entry) => entry.status === "active");

  if (!membership) {
    return (
      <div className="stack">
        <h1 className="page-title">Team</h1>
        <p className="muted">
          You don&apos;t belong to an active organization yet.
        </p>
      </div>
    );
  }

  const canManage = ["owner", "admin"].includes(membership.role);

  const db = getDb();
  const rows = await db
    .select({
      userId: schema.users.id,
      email: schema.users.email,
      displayName: schema.users.displayName,
      role: schema.organizationMembers.role,
      status: schema.organizationMembers.status,
    })
    .from(schema.organizationMembers)
    .innerJoin(
      schema.users,
      eq(schema.organizationMembers.userId, schema.users.id),
    )
    .where(
      eq(schema.organizationMembers.organizationId, membership.organizationId),
    );

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <h1 className="page-title">Team</h1>
          <p className="page-subtitle">
            {rows.length} {rows.length === 1 ? "member" : "members"}
          </p>
        </div>
      </div>

      <TeamMemberList
        canManage={canManage}
        changeMemberRole={changeMemberRole}
        currentUserId={user.id}
        members={rows}
        removeMember={removeMember}
      />

      {canManage ? <AddMemberForm addMember={addMember} /> : null}
    </div>
  );
}
