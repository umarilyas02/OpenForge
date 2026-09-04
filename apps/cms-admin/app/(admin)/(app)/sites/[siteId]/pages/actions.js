"use server";

import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";

import { getDb } from "../../../../../../src/lib/db.js";
import {
  getMemberships,
  requireUser,
} from "../../../../../../src/lib/session.js";
import { getWorkspaceManager } from "../../../../../../src/lib/site-workspace.js";

const PATH_SEGMENT_PATTERN = /^[a-z0-9][a-z0-9-]*(\/[a-z0-9][a-z0-9-]*)*$/u;

async function loadAuthorizedSite(siteId, user) {
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
  return site;
}

/**
 * Creates a brand-new page file directly (not through the compiler's
 * operation pipeline — that's for editing a node in an already-parsed
 * file; a fresh file has no prior parse to diff against). Starts with one
 * Rich Text block, matching the starter template's own style.
 *
 * @param {string} siteId
 * @param {{ error: string | null }} _prevState
 * @param {FormData} formData
 */
export async function createPage(siteId, _prevState, formData) {
  const user = await requireUser();
  const site = await loadAuthorizedSite(siteId, user);

  const rawPath = String(formData.get("path") ?? "")
    .trim()
    .toLowerCase()
    .replace(/^\/+|\/+$/gu, "");

  if (rawPath && !PATH_SEGMENT_PATTERN.test(rawPath)) {
    return {
      error:
        "Path must be lowercase letters, numbers, and hyphens, with / between segments (e.g. about or blog/first-post).",
    };
  }

  const filePath = rawPath ? `app/${rawPath}/page.jsx` : "app/page.jsx";
  const depth = filePath.split("/").length - 1;
  const importPrefix = "../".repeat(depth);

  const manager = getWorkspaceManager();
  let state;
  try {
    state = await manager.describe(site.slug);
  } catch (error) {
    return { error: `Could not read this site's project: ${error.message}` };
  }

  const existing = await manager.readFiles(site.slug);
  if (existing.some((file) => file.path === filePath)) {
    return { error: `A page already exists at "${rawPath || "/"}".` };
  }

  const source = `import RichText from "${importPrefix}components/openforge/RichText.jsx";

export default function Page() {
  return <RichText content="New page. Edit me from the canvas or right here in the code." />;
}
`;

  try {
    await manager.saveFile(site.slug, {
      baseRevision: state.revision,
      path: filePath,
      source,
    });
  } catch (error) {
    return { error: `Could not create the page: ${error.message}` };
  }

  redirect(`/sites/${site.id}`);
}
