"use server";

import { assertOrgMembership } from "@openforge/auth";
import { schema } from "@openforge/db";
import { defaultTheme } from "@openforge/theme-default";
import { redirect } from "next/navigation";

import { getDb } from "../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../src/lib/session.js";

const SLUG_PATTERN = /^[a-z][a-z0-9-]*$/u;

/**
 * @param {{ error: string | null }} _prevState
 * @param {FormData} formData
 */
export async function createSite(_prevState, formData) {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();

  if (!name) return { error: "Name is required." };
  if (!SLUG_PATTERN.test(slug)) {
    return {
      error:
        "Slug must be lowercase letters, numbers, and hyphens, starting with a letter.",
    };
  }

  const actor = { userId: user.id };
  const memberships = await getMemberships(user.id);
  const membership = memberships.find((entry) => entry.status === "active");
  if (!membership) {
    return {
      error:
        "You don't belong to an active organization yet — create one via the seed script.",
    };
  }

  assertOrgMembership(actor, membership.organizationId, memberships);

  const db = getDb();

  let site;
  try {
    [site] = await db
      .insert(schema.sites)
      .values({
        organizationId: membership.organizationId,
        name,
        slug,
        status: "draft",
        createdBy: user.id,
      })
      .returning();
  } catch {
    return { error: `A site with slug "${slug}" already exists.` };
  }

  await db.insert(schema.themeInstallations).values({
    siteId: site.id,
    themeId: defaultTheme.manifest.id,
    themeVersion: defaultTheme.manifest.version,
    config: {},
  });

  redirect("/sites");
}
