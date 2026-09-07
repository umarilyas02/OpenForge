"use server";

import { assertSiteAccess, hashPassword } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

import { getDb } from "../../../../../../src/lib/db.js";
import {
  getMemberships,
  requireUser,
} from "../../../../../../src/lib/session.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const ROLES = new Set(["owner", "editor", "member"]);

/**
 * Adds a person to this site's organization. If no account exists yet for
 * the given email, one is created with the supplied temporary password —
 * there's no outbound email in this install, so the password is handed
 * back to the caller once instead of mailed.
 *
 * @param {string} siteId
 * @param {{ error: string | null, addedEmail?: string, tempPassword?: string | null }} _prevState
 * @param {FormData} formData
 */
export async function addUser(siteId, _prevState, formData) {
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

  const displayName = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const role = String(formData.get("role") ?? "member");
  const password = String(formData.get("password") ?? "");

  if (!displayName) return { error: "Name is required." };
  if (!EMAIL_PATTERN.test(email)) {
    return { error: "Enter a valid email address." };
  }
  if (!ROLES.has(role)) return { error: "Invalid role." };

  const [existing] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email));

  let targetUser = existing;
  let createdNewUser = false;

  if (!targetUser) {
    if (password.length < 8) {
      return {
        error: "Password must be at least 8 characters for a new account.",
      };
    }
    [targetUser] = await db
      .insert(schema.users)
      .values({ email, displayName, passwordHash: hashPassword(password) })
      .returning();
    createdNewUser = true;
  }

  const existingMemberships = await getMemberships(targetUser.id);
  const alreadyMember = existingMemberships.some(
    (membership) => membership.organizationId === site.organizationId,
  );

  if (alreadyMember) {
    return { error: `${email} is already part of this organization.` };
  }

  await db.insert(schema.organizationMembers).values({
    organizationId: site.organizationId,
    userId: targetUser.id,
    role,
    invitedBy: user.id,
  });

  revalidatePath(`/sites/${site.id}/users`);

  return {
    error: null,
    addedEmail: email,
    tempPassword: createdNewUser ? password : null,
  };
}
