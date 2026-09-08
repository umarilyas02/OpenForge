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
import {
  DEFAULT_THEME_ID,
  themeRegistry,
} from "../../../../../../src/lib/theme-registry.js";

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

  // Sites created before theme installation rows existed by default have
  // none yet -- fall back to the Default theme rather than 404ing on a
  // page the site owner has every reason to expect works.
  const themeId = installation?.themeId ?? DEFAULT_THEME_ID;
  const themeVersion =
    installation?.themeVersion ?? themeRegistry.get(DEFAULT_THEME_ID).manifest.version;
  const overrides = { ...(installation?.config ?? {}) };

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
    .insert(schema.themeInstallations)
    .values({ siteId: site.id, themeId, themeVersion, config: overrides })
    .onConflictDoUpdate({
      target: schema.themeInstallations.siteId,
      set: { config: overrides },
    });

  redirect(`/sites/${site.id}/appearance/design-tokens?saved=1`);
}

/**
 * Installs/activates a theme on a site (upserting the site's single
 * `theme_installations` row). Switching to a *different* theme resets any
 * saved custom token overrides, since they were tuned against the old
 * theme's base palette and could look broken against the new one;
 * re-activating the theme that's already active is a no-op for `config`.
 *
 * @param {string} siteId
 * @param {string} themeId
 */
export async function installTheme(siteId, themeId) {
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

  const theme = themeRegistry.get(themeId);

  const [existing] = await db
    .select()
    .from(schema.themeInstallations)
    .where(eq(schema.themeInstallations.siteId, site.id));

  if (existing?.themeId === theme.manifest.id) {
    redirect(`/sites/${site.id}/appearance/themes`);
  }

  await db
    .insert(schema.themeInstallations)
    .values({
      siteId: site.id,
      themeId: theme.manifest.id,
      themeVersion: theme.manifest.version,
      config: {},
    })
    .onConflictDoUpdate({
      target: schema.themeInstallations.siteId,
      set: {
        themeId: theme.manifest.id,
        themeVersion: theme.manifest.version,
        config: {},
      },
    });

  redirect(`/sites/${site.id}/appearance/themes`);
}
