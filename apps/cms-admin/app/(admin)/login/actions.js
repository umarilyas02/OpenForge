"use server";

import { SESSION_COOKIE_NAME, verifyPassword } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import {
  createInitialAccount,
  hasAnyUsers,
} from "../../../src/lib/account-setup.js";
import { getDb } from "../../../src/lib/db.js";
import { getSessionManager } from "../../../src/lib/session.js";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

/**
 * @param {string} userId
 */
async function issueSessionAndRedirect(userId) {
  const { token } = await getSessionManager().issue({ userId });

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });

  redirect("/sites");
}

/**
 * @param {{ error: string | null }} _prevState
 * @param {FormData} formData
 */
export async function login(_prevState, formData) {
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const db = getDb();
  const [user] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email));

  if (!user?.passwordHash || !verifyPassword(password, user.passwordHash)) {
    return { error: "Invalid email or password." };
  }

  await issueSessionAndRedirect(user.id);
}

/**
 * First-run "create your account" Server Action, used only while this
 * install has zero users (see `page.jsx`). Creates the real user + personal
 * organization + owner membership via `createInitialAccount` (the same
 * shape `tooling/scripts/create-user.js` provisions from the CLI), then
 * signs the new account in exactly like `login()` does.
 *
 * Re-checks `hasAnyUsers` up front purely to redirect a stale/replayed form
 * straight to `/login` with no error flash; `createInitialAccount` itself
 * is the real guard against a second account ever being created here, via
 * its own transactional re-check.
 *
 * @param {{ error: string | null }} _prevState
 * @param {FormData} formData
 */
export async function setup(_prevState, formData) {
  const db = getDb();

  if (await hasAnyUsers(db)) {
    redirect("/login");
  }

  const displayName = String(formData.get("name") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." };
  }

  const result = await createInitialAccount(db, {
    email,
    password,
    displayName,
  });
  if (result.error) {
    return { error: result.error };
  }

  await issueSessionAndRedirect(result.user.id);
}
