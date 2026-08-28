"use server";

import { SESSION_COOKIE_NAME } from "@openforge/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getSessionManager } from "../../src/lib/session.js";

export async function logout() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await getSessionManager().revoke(token);
  }
  cookieStore.delete(SESSION_COOKIE_NAME);
  redirect("/login");
}
