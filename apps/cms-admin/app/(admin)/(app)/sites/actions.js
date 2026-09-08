"use server";

import { assertOrgMembership } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";

import { getDb } from "../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../src/lib/session.js";
import { commitSiteChanges, initSiteGit } from "../../../../src/lib/site-git.js";
import { buildStarterFiles } from "../../../../src/lib/starter-template.js";
import { getWorkspaceManager } from "../../../../src/lib/site-workspace.js";
import { DEFAULT_THEME_ID, themeRegistry } from "../../../../src/lib/theme-registry.js";

const SLUG_PATTERN = /^[a-z][a-z0-9-]*$/u;

/**
 * @param {{ error: string | null }} _prevState
 * @param {FormData} formData
 */
export async function createSite(_prevState, formData) {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();

  if (!name) return { error: "Name is required." };
  if (!SLUG_PATTERN.test(slug)) {
    return {
      error:
        "Slug must be lowercase letters, numbers, and hyphens, starting with a letter.",
    };
  }

  const actor = { userId: user.id };
  const memberships = await getMemberships(user.id);
  const membership = memberships.find((entry) => entry.status === "active");
  if (!membership) {
    return {
      error:
        "Your account isn't fully set up yet — run tooling/scripts/create-user.js to finish setup.",
    };
  }

  assertOrgMembership(actor, membership.organizationId, memberships);

  const db = getDb();

  let site;
  try {
    [site] = await db
      .insert(schema.sites)
      .values({
        organizationId: membership.organizationId,
        name,
        slug,
        status: "draft",
        createdBy: user.id,
      })
      .returning();
  } catch {
    return { error: `A site with slug "${slug}" already exists.` };
  }

  // Every site needs an active theme from the moment it exists -- the
  // Design Tokens and Themes pages both 404 without a theme_installations
  // row. Not worth aborting site creation over if this somehow fails, so
  // it's a best-effort step, not part of the rollback-on-failure block
  // below.
  try {
    const defaultTheme = themeRegistry.get(DEFAULT_THEME_ID);
    await db.insert(schema.themeInstallations).values({
      siteId: site.id,
      themeId: defaultTheme.manifest.id,
      themeVersion: defaultTheme.manifest.version,
      config: {},
    });
  } catch {
    // Best-effort; the Themes page falls back to "Default" either way.
  }

  // The site's real content: a real Next.js project directory, not a
  // database row. If provisioning it fails, don't leave an orphaned
  // sites row with no actual project behind it.
  try {
    const files = await buildStarterFiles(site);
    const manager = getWorkspaceManager();
    await manager.create(site.slug, files);
    const { rootPath } = await manager.describe(site.slug);
    await initSiteGit(rootPath);
    await commitSiteChanges(rootPath, "Initial site files");
  } catch (error) {
    await db.delete(schema.sites).where(eq(schema.sites.id, site.id));
    return {
      error: `Could not create the site's project files: ${error.message}`,
    };
  }

  redirect("/sites");
}
