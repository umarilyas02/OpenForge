"use server";

import { SESSION_COOKIE_NAME, verifyPassword } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getDb } from "../../src/lib/db.js";
import { getSessionManager } from "../../src/lib/session.js";

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

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

  const { token } = await getSessionManager().issue({ userId: user.id });

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
