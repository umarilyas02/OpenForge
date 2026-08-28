"use server";

import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { getDb } from "../../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../../src/lib/session.js";

const SLUG_PATTERN = /^[a-z][a-z0-9-]*$/u;
const DOMAIN_PATTERN =
  /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/iu;

/**
 * @param {string} siteId
 * @param {{ error: string | null, ok?: boolean }} _prevState
 * @param {FormData} formData
 */
export async function updateSiteSettings(siteId, _prevState, formData) {
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

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const customDomain = String(formData.get("customDomain") ?? "")
    .trim()
    .toLowerCase();
  const status = String(formData.get("status") ?? "draft");

  if (!name) return { error: "Name is required.", ok: false };
  if (!SLUG_PATTERN.test(slug)) {
    return {
      error: "Slug must be lowercase letters, numbers, and hyphens.",
      ok: false,
    };
  }
  if (customDomain && !DOMAIN_PATTERN.test(customDomain)) {
    return { error: "Custom domain is not a valid hostname.", ok: false };
  }
  if (!schema.SITE_STATUSES.includes(status)) {
    return { error: "Invalid status.", ok: false };
  }

  try {
    await db
      .update(schema.sites)
      .set({
        name,
        slug,
        customDomain: customDomain || null,
        status,
        updatedAt: new Date(),
      })
      .where(eq(schema.sites.id, site.id));
  } catch {
    return {
      error: "That slug or custom domain is already in use by another site.",
      ok: false,
    };
  }

  return { error: null, ok: true };
}
