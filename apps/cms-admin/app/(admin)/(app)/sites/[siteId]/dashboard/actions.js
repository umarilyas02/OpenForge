"use server";

import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { defaultThemeBlockRegistry } from "@openforge/theme-default";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

import { prepareContentTreeForSave } from "../../../../../../src/lib/content-tree-ops.js";
import { getDb } from "../../../../../../src/lib/db.js";
import {
  getMemberships,
  requireUser,
} from "../../../../../../src/lib/session.js";
import { slugify } from "../../../../../../src/lib/slugify.js";

/**
 * The dashboard's "Quick Draft" card: title + a single body paragraph,
 * skipping the template picker and explicit slug field the full
 * `/content/new` flow asks for — the slug is derived from the title, with a
 * short random suffix appended only if that slug is already taken.
 *
 * @param {string} siteId
 * @param {{ error: string | null }} _prevState
 * @param {FormData} formData
 */
export async function quickCreatePost(siteId, _prevState, formData) {
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

  const title = String(formData.get("title") ?? "").trim();
  const body = String(formData.get("body") ?? "").trim();
  const publish = formData.get("intent") === "publish";
  if (!title) return { error: "Title is required." };

  const baseSlug = slugify(title) || "draft";
  const blockTree = prepareContentTreeForSave(
    body.length > 0
      ? [{ blockId: "openforge-cms.rich-text", blockVersion: 1, props: { content: body }, slots: {} }]
      : [],
    defaultThemeBlockRegistry,
  );

  let item;
  try {
    [item] = await db
      .insert(schema.contentItems)
      .values({
        siteId: site.id,
        type: "post",
        status: publish ? "published" : "draft",
        slug: baseSlug,
        title,
        blockTree,
        authorId: user.id,
        publishedAt: publish ? new Date() : null,
      })
      .returning();
  } catch {
    // Slug already taken -- retry once with a short unique suffix.
    const slug = `${baseSlug}-${Date.now().toString(36).slice(-5)}`;
    [item] = await db
      .insert(schema.contentItems)
      .values({
        siteId: site.id,
        type: "post",
        status: publish ? "published" : "draft",
        slug,
        title,
        blockTree,
        authorId: user.id,
        publishedAt: publish ? new Date() : null,
      })
      .returning();
  }

  redirect(`/sites/${site.id}/content/${item.id}`);
}
