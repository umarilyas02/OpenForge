import { schema } from "@openforge/db";
import { and, eq } from "drizzle-orm";

import { getDb } from "./db.js";

/**
 * @param {{ siteId: string, slug: string }} params
 */
export async function getPublishedPageBySlug({ siteId, slug }) {
  const db = getDb();

  const [item] = await db
    .select()
    .from(schema.contentItems)
    .where(
      and(
        eq(schema.contentItems.siteId, siteId),
        eq(schema.contentItems.slug, slug),
        eq(schema.contentItems.status, "published"),
      ),
    );

  return item ?? null;
}
