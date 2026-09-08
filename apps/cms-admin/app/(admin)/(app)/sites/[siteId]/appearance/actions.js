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
import { commitSiteChanges, initSiteGit } from "../../../../../../src/lib/site-git.js";
import { buildStarterFiles } from "../../../../../../src/lib/starter-template.js";
import { buildThemeSiteFiles } from "../../../../../../src/lib/theme-site-generator.js";
import {
  DEFAULT_THEME_ID,
  getExampleSiteFor,
  themeRegistry,
} from "../../../../../../src/lib/theme-registry.js";
import { getWorkspaceManager } from "../../../../../../src/lib/site-workspace.js";

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
 * Installs/activates a theme on a site: WordPress-style, this replaces the
 * site's actual pages, navigation, and footer with the theme's real
 * example content (see theme-site-generator.js) -- not just a token/color
 * change. This is destructive: any hand-edited page content is overwritten
 * and the site's local git history is reset to one fresh "Activate <theme>"
 * commit, same as a WordPress theme's one-click demo-content import. The
 * UI must confirm with the user before calling this.
 *
 * Generates every file in memory first and only touches the real workspace
 * or the database once that fully succeeds, so a failure here never leaves
 * the site half-migrated.
 *
 * Switching to a *different* theme also resets any saved custom token
 * overrides, since they were tuned against the old theme's base palette;
 * re-activating the theme that's already active is a no-op.
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

  const exampleSite = getExampleSiteFor(theme.manifest.id);
  const files = exampleSite
    ? await buildThemeSiteFiles(theme, exampleSite, site)
    : await buildStarterFiles(site);

  const manager = getWorkspaceManager();
  await manager.cleanup(site.slug).catch(() => {});
  await manager.create(site.slug, files);
  const { rootPath } = await manager.describe(site.slug);
  await initSiteGit(rootPath);
  await commitSiteChanges(rootPath, `Activate ${theme.manifest.name} theme`);

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
