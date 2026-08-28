import {
  SESSION_COOKIE_NAME,
  createDrizzleSessionStore,
  createSessionManager,
} from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDb } from "./db.js";

export function getSessionManager() {
  const db = getDb();
  return createSessionManager({ store: createDrizzleSessionStore({ db }) });
}

/**
 * Read the session cookie, verify it, and load the current user. Returns
 * `null` for any failure (no cookie, invalid/expired/revoked session,
 * deleted user) rather than throwing, since "not logged in" is an expected
 * state, not an error.
 */
export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  try {
    const session = await getSessionManager().verify(token);
    const db = getDb();
    const [user] = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.id, session.userId));
    return user ?? null;
  } catch {
    return null;
  }
}

/**
 * Same as `getCurrentUser`, but redirects to `/login` when there is no
 * valid session, for use at the top of an auth-gated layout/page.
 */
export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

/**
 * @param {string} userId
 */
export async function getMemberships(userId) {
  const db = getDb();
  return db
    .select()
    .from(schema.organizationMembers)
    .where(eq(schema.organizationMembers.userId, userId));
}
