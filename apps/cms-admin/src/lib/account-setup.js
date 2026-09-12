import { hashPassword } from "@openforge/auth";
import { schema } from "@openforge/db";
import { sql } from "drizzle-orm";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/u;
const MIN_PASSWORD_LENGTH = 8;

// Arbitrary fixed key for a Postgres session-level advisory lock scoping
// this install's one-time "create your account" transaction, so two
// concurrent first submissions can't both pass the zero-users check and
// both insert a user.
const SETUP_LOCK_KEY = 8_825_501;

/**
 * True once this install has at least one user — the first-run "create your
 * account" window is over and `/login` should show the normal sign-in form.
 *
 * @param {import("drizzle-orm/node-postgres").NodePgDatabase} db
 */
export async function hasAnyUsers(db) {
  const [existing] = await db
    .select({ id: schema.users.id })
    .from(schema.users)
    .limit(1);
  return Boolean(existing);
}

/**
 * Provision this self-hosted install's one and only user account: the same
 * user row, personal organization, and owner membership
 * `tooling/scripts/create-user.js` provisions from the CLI, so
 * `packages/auth`'s existing org-scoped authorization
 * (`assertOrgMembership`/`assertSiteAccess`) keeps working unchanged.
 *
 * Real validation (email format, password length, required name) runs
 * first. The actual creation happens inside a Postgres transaction guarded
 * by an advisory lock and an in-transaction re-check of `hasAnyUsers`, so
 * this can only ever succeed once for a given install — a second call
 * (concurrent or after the fact) always returns an error instead of
 * creating a second account.
 *
 * @param {import("drizzle-orm/node-postgres").NodePgDatabase} db
 * @param {{ email: string, password: string, displayName: string }} input
 * @returns {Promise<{ error: string | null, user?: object, organization?: object }>}
 */
export async function createInitialAccount(
  db,
  { email, password, displayName },
) {
  const normalizedEmail = String(email ?? "")
    .trim()
    .toLowerCase();
  const trimmedName = String(displayName ?? "").trim();
  const rawPassword = String(password ?? "");

  if (!trimmedName) {
    return { error: "Name is required." };
  }
  if (!EMAIL_PATTERN.test(normalizedEmail)) {
    return { error: "Enter a valid email address." };
  }
  if (rawPassword.length < MIN_PASSWORD_LENGTH) {
    return {
      error: `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }

  try {
    return await db.transaction(async (tx) => {
      await tx.execute(sql`select pg_advisory_xact_lock(${SETUP_LOCK_KEY})`);

      if (await hasAnyUsers(tx)) {
        return {
          error: "Setup has already been completed. Please sign in instead.",
        };
      }

      const [user] = await tx
        .insert(schema.users)
        .values({
          email: normalizedEmail,
          displayName: trimmedName,
          passwordHash: hashPassword(rawPassword),
        })
        .returning();

      const [organization] = await tx
        .insert(schema.organizations)
        .values({
          name: `${trimmedName}'s Workspace`,
          slug: `workspace-${user.id.slice(0, 8)}`,
          createdBy: user.id,
        })
        .returning();

      await tx.insert(schema.organizationMembers).values({
        organizationId: organization.id,
        userId: user.id,
        role: "owner",
      });

      return { error: null, user, organization };
    });
  } catch (error) {
    // Defensive: the advisory lock + in-transaction re-check above should
    // make this unreachable, but never surface a raw driver error for a
    // duplicate-email race.
    if (error?.code === "23505") {
      return { error: "That email is already registered." };
    }
    throw error;
  }
}
