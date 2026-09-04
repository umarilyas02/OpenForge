"use server";

import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { defaultThemeBlockRegistry } from "@openforge/theme-default";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

import { prepareContentTreeForSave } from "../../../../../../src/lib/content-tree-ops.js";
import { templatesForType } from "../../../../../../src/lib/page-templates.js";
import { getDb } from "../../../../../../src/lib/db.js";
import {
  getMemberships,
  requireUser,
} from "../../../../../../src/lib/session.js";

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/u;

async function loadAuthorizedSite(siteId, user) {
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
  return site;
}

/**
 * @param {string} siteId
 * @param {{ error: string | null }} _prevState
 * @param {FormData} formData
 */
export async function createContent(siteId, _prevState, formData) {
  const user = await requireUser();
  const site = await loadAuthorizedSite(siteId, user);

  const title = String(formData.get("title") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const type = String(formData.get("type") ?? "page");
  const templateId = String(formData.get("templateId") ?? "blank");

  if (!title) return { error: "Title is required." };
  if (!SLUG_PATTERN.test(slug)) {
    return {
      error: "Slug must be lowercase letters, numbers, and hyphens.",
    };
  }
  if (!["page", "post"].includes(type)) {
    return { error: "Invalid content type." };
  }

  const template = templatesForType(type).find(
    (candidate) => candidate.id === templateId,
  );
  if (!template) return { error: "Unknown template." };

  const blockTree = prepareContentTreeForSave(
    template.build(),
    defaultThemeBlockRegistry,
  );

  const db = getDb();
  let item;
  try {
    [item] = await db
      .insert(schema.contentItems)
      .values({
        siteId: site.id,
        type,
        status: "draft",
        slug,
        title,
        blockTree,
        authorId: user.id,
      })
      .returning();
  } catch {
    return { error: `A page with slug "${slug}" already exists on this site.` };
  }

  redirect(`/sites/${site.id}/content/${item.id}`);
}
