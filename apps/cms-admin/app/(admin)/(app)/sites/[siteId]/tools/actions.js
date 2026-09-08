"use server";

import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { defaultThemeBlockRegistry } from "@openforge/theme-default";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

import { parseImportFile } from "../../../../../../src/lib/content-import.js";
import { prepareContentTreeForSave } from "../../../../../../src/lib/content-tree-ops.js";
import { getDb } from "../../../../../../src/lib/db.js";
import {
  getMemberships,
  requireUser,
} from "../../../../../../src/lib/session.js";
import { slugify } from "../../../../../../src/lib/slugify.js";

/**
 * Inserts one parsed import entry as a content item, retrying once with a
 * short unique suffix if its slug is already taken on this site — the same
 * pattern as dashboard/actions.js's quickCreatePost.
 */
async function insertEntry(db, { site, user, entry }) {
  const baseSlug = slugify(entry.slug || entry.title) || "import";
  const blockTree = prepareContentTreeForSave(
    entry.body.trim().length > 0
      ? [
          {
            blockId: "openforge-cms.rich-text",
            blockVersion: 1,
            props: { content: entry.body.trim() },
            slots: {},
          },
        ]
      : [],
    defaultThemeBlockRegistry,
  );
  const values = {
    siteId: site.id,
    type: entry.type,
    status: entry.status,
    title: entry.title,
    blockTree,
    authorId: user.id,
    publishedAt: entry.status === "published" ? new Date() : null,
  };

  try {
    await db.insert(schema.contentItems).values({ ...values, slug: baseSlug });
  } catch {
    const slug = `${baseSlug}-${Date.now().toString(36).slice(-5)}`;
    await db.insert(schema.contentItems).values({ ...values, slug });
  }
}

/**
 * Tools > Import: a single Markdown file (one post/page, optional `---`
 * frontmatter) or a JSON file (an array of entries) becomes one or more
 * real content items — see content-import.js for the accepted shapes.
 *
 * @param {string} siteId
 * @param {{ error: string | null, imported?: number, token?: number }} _prevState
 * @param {FormData} formData
 */
export async function importContent(siteId, _prevState, formData) {
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

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { error: "Choose a Markdown or JSON file to import." };
  }

  const text = await file.text();
  let entries;
  try {
    entries = parseImportFile(file.name, text);
  } catch (error) {
    return { error: `Could not parse "${file.name}": ${error.message}` };
  }
  if (entries.length === 0) {
    return { error: "The file didn't contain any importable content." };
  }

  for (const entry of entries) {
    await insertEntry(db, { site, user, entry });
  }

  revalidatePath(`/sites/${site.id}/content`);
  return { error: null, imported: entries.length, token: Date.now() };
}
