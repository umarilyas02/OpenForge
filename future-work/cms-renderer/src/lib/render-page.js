import { schema } from "@openforge/db";
import { createRenderer } from "@openforge/renderer";
import {
  defaultTheme,
  defaultThemeBlockRegistry,
} from "@openforge/theme-default";
import { eq } from "drizzle-orm";

import { getDb } from "./db.js";

const renderer = createRenderer({
  theme: defaultTheme,
  blockRegistry: defaultThemeBlockRegistry,
});

/**
 * @param {string} siteId
 */
export async function getSiteTokenOverrides(siteId) {
  const db = getDb();

  const [installation] = await db
    .select()
    .from(schema.themeInstallations)
    .where(eq(schema.themeInstallations.siteId, siteId));

  return installation?.config ?? {};
}

/**
 * @param {{ blockTree: unknown }} contentItem
 */
export function renderContentBody(contentItem) {
  return renderer.renderTree(contentItem.blockTree);
}
