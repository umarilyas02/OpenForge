"use server";

import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { defaultThemeBlockRegistry } from "@openforge/theme-default";
import { and, eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { getDb } from "../../../../../../src/lib/db.js";
import { prepareContentTreeForSave } from "../../../../../../src/lib/content-tree-ops.js";
import {
  getMemberships,
  requireUser,
} from "../../../../../../src/lib/session.js";

const SLUG_PATTERN = /^[a-z0-9][a-z0-9-]*$/u;

async function loadAuthorizedContentItem(siteId, contentId, user) {
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

  const [item] = await db
    .select()
    .from(schema.contentItems)
    .where(
      and(
        eq(schema.contentItems.id, contentId),
        eq(schema.contentItems.siteId, site.id),
      ),
    );
  if (!item) notFound();

  return { site, item };
}

/**
 * @param {string} siteId
 * @param {string} contentId
 * @param {{ title: string, slug: string, status: string, blockTree: unknown }} payload
 */
export async function saveContent(siteId, contentId, payload) {
  const user = await requireUser();
  const { item } = await loadAuthorizedContentItem(siteId, contentId, user);

  const title = String(payload.title ?? "").trim();
  const slug = String(payload.slug ?? "")
    .trim()
    .toLowerCase();
  const status = payload.status === "published" ? "published" : "draft";

  if (!title) return { ok: false, error: "Title is required." };
  if (!SLUG_PATTERN.test(slug)) return { ok: false, error: "Invalid slug." };

  let preparedTree;
  try {
    preparedTree = prepareContentTreeForSave(
      payload.blockTree ?? [],
      defaultThemeBlockRegistry,
    );
  } catch (error) {
    return { ok: false, error: error.message };
  }

  const db = getDb();

  try {
    await db
      .update(schema.contentItems)
      .set({
        title,
        slug,
        status,
        blockTree: preparedTree,
        publishedAt:
          status === "published"
            ? (item.publishedAt ?? new Date())
            : item.publishedAt,
        updatedAt: new Date(),
      })
      .where(eq(schema.contentItems.id, item.id));
  } catch {
    return {
      ok: false,
      error: `A page with slug "${slug}" already exists on this site.`,
    };
  }

  await db.insert(schema.contentRevisions).values({
    contentItemId: item.id,
    blockTree: preparedTree,
    title,
    createdBy: user.id,
  });

  return { ok: true };
}
