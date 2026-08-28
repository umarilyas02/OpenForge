"use server";

import { assertSiteAccess } from "@openforge/auth";
import {
  defaultDesignTokens,
  validateTokenValue,
} from "@openforge/design-tokens";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

import { getDb } from "../../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../../src/lib/session.js";

const COLOR_TOKEN_NAMES = new Set(
  defaultDesignTokens.tokens
    .filter((token) => token.type === "color")
    .map((token) => token.name),
);

/**
 * @param {string} siteId
 * @param {{ error: string | null }} _prevState
 * @param {FormData} formData
 */
export async function saveAppearance(siteId, _prevState, formData) {
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

  const [installation] = await db
    .select()
    .from(schema.themeInstallations)
    .where(eq(schema.themeInstallations.siteId, site.id));
  if (!installation) notFound();

  const overrides = { ...(installation.config ?? {}) };

  for (const name of COLOR_TOKEN_NAMES) {
    const value = formData.get(name);
    if (typeof value !== "string" || value === "") continue;

    try {
      validateTokenValue({ type: "color", value, tokens: [] });
    } catch {
      return { error: `"${value}" is not a valid color for ${name}.` };
    }
    overrides[name] = value;
  }

  await db
    .update(schema.themeInstallations)
    .set({ config: overrides })
    .where(eq(schema.themeInstallations.siteId, site.id));

  redirect(`/sites/${site.id}/appearance?saved=1`);
}
