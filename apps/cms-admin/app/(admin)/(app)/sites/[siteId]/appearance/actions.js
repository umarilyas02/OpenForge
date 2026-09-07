"use server";

import { assertSiteAccess } from "@openforge/auth";
import { defaultDesignTokens, validateTokenValue } from "@openforge/design-tokens";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

import { getDb } from "../../../../../../src/lib/db.js";
import {
  getMemberships,
  requireUser,
} from "../../../../../../src/lib/session.js";

const TOKENS_BY_NAME = new Map(
  defaultDesignTokens.tokens.map((token) => [token.name, token]),
);

/**
 * Saves user-supplied overrides for any design token (color, spacing,
 * radius, typography, shadow) on a site's theme installation. Every
 * editable field on the Design Tokens page shares this one action.
 *
 * @param {string} siteId
 * @param {{ error: string | null }} _prevState
 * @param {FormData} formData
 */
export async function saveDesignTokens(siteId, _prevState, formData) {
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

  for (const [name, token] of TOKENS_BY_NAME) {
    const value = formData.get(name);
    if (typeof value !== "string" || value === "") continue;

    try {
      validateTokenValue({
        type: token.type,
        value,
        tokens: defaultDesignTokens.tokens,
      });
    } catch {
      return {
        error: `"${value}" is not a valid ${token.type} value for ${token.cssVariable}.`,
      };
    }
    overrides[name] = value;
  }

  await db
    .update(schema.themeInstallations)
    .set({ config: overrides })
    .where(eq(schema.themeInstallations.siteId, site.id));

  redirect(`/sites/${site.id}/appearance/design-tokens?saved=1`);
}
