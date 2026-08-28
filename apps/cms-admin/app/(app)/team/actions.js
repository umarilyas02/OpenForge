"use server";

import { assertOrgMembership, assertRole } from "@openforge/auth";
import { schema } from "@openforge/db";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

import { getDb } from "../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../src/lib/session.js";

const ROLES = ["owner", "admin", "member"];

async function loadManagingMembership(user) {
  const memberships = await getMemberships(user.id);
  const membership = memberships.find((entry) => entry.status === "active");
  if (!membership) {
    throw new Error("No active organization membership.");
  }
  assertOrgMembership(
    { userId: user.id },
    membership.organizationId,
    memberships,
  );
  assertRole(membership, ["owner", "admin"]);
  return membership;
}

/**
 * @param {{ error: string | null }} _prevState
 * @param {FormData} formData
 */
export async function addMember(_prevState, formData) {
  const user = await requireUser();
  const membership = await loadManagingMembership(user);

  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const role = String(formData.get("role") ?? "member");

  if (!email) return { error: "Email is required." };
  if (!ROLES.includes(role)) return { error: "Invalid role." };

  const db = getDb();
  const [targetUser] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email));

  if (!targetUser) {
    return {
      error: `No account found for "${email}". User registration isn't built yet — create their account via tooling/scripts first.`,
    };
  }

  try {
    await db.insert(schema.organizationMembers).values({
      organizationId: membership.organizationId,
      userId: targetUser.id,
      role,
      invitedBy: user.id,
    });
  } catch {
    return { error: `"${email}" is already a member of this organization.` };
  }

  revalidatePath("/team");
  return { error: null };
}

/**
 * @param {string} targetUserId
 * @param {string} role
 */
export async function changeMemberRole(targetUserId, role) {
  const user = await requireUser();
  const membership = await loadManagingMembership(user);

  if (!ROLES.includes(role)) {
    throw new Error("Invalid role.");
  }

  const db = getDb();
  await db
    .update(schema.organizationMembers)
    .set({ role })
    .where(
      and(
        eq(
          schema.organizationMembers.organizationId,
          membership.organizationId,
        ),
        eq(schema.organizationMembers.userId, targetUserId),
      ),
    );

  revalidatePath("/team");
  return { ok: true };
}

/**
 * @param {string} targetUserId
 */
export async function removeMember(targetUserId) {
  const user = await requireUser();
  const membership = await loadManagingMembership(user);

  const db = getDb();
  await db
    .delete(schema.organizationMembers)
    .where(
      and(
        eq(
          schema.organizationMembers.organizationId,
          membership.organizationId,
        ),
        eq(schema.organizationMembers.userId, targetUserId),
      ),
    );

  revalidatePath("/team");
  return { ok: true };
}
