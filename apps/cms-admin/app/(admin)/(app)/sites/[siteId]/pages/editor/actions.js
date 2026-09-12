"use server";

import { assertSiteAccess } from "@openforge/auth";
import { buildProjectIndex } from "@openforge/compiler";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { getDb } from "../../../../../../../src/lib/db.js";
import {
  getMemberships,
  requireUser,
} from "../../../../../../../src/lib/session.js";
import * as libraryContentActions from "../../../../../../../src/lib/library-content-actions.js";
import { getWorkspaceManager } from "../../../../../../../src/lib/site-workspace.js";
import * as sourceContentActions from "../../../../../../../src/lib/source-content-actions.js";
import {
  findPageRootNodeId,
  parsePageToBlockTree,
} from "../../../../../../../src/lib/source-content-tree.js";
import { getTheme } from "../../../../../../../src/lib/theme-registry.js";

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
 * A site's active theme id and resolved token overrides (its theme's own
 * defaults merged with anything saved on the Design Tokens page) — the same
 * computation the read-only /preview route uses. The canvas previously
 * always rendered with the hardcoded default theme and no overrides at all
 * (CanvasEditor.jsx never sent any), so a site on a non-default theme, or
 * with any token customization, saw a different page while editing than
 * what Preview and the real site actually show.
 */
async function loadThemeState(siteId) {
  const db = getDb();
  const [installation] = await db
    .select()
    .from(schema.themeInstallations)
    .where(eq(schema.themeInstallations.siteId, siteId));
  const theme = getTheme(installation?.themeId);
  return {
    themeId: theme.manifest.id,
    tokenOverrides: {
      ...theme.manifest.defaultTokenOverrides,
      ...(installation?.config ?? {}),
    },
  };
}

export async function getPageEditorState(siteId, pagePath) {
  const user = await requireUser();
  const site = await loadAuthorizedSite(siteId, user);
  const [files, themeState] = await Promise.all([
    getWorkspaceManager().readFiles(site.slug),
    loadThemeState(siteId),
  ]);

  // One project-wide AST walk shared by both reads below, instead of each
  // independently re-parsing every file in the workspace — this runs after
  // every single edit, so the saving compounds with site size.
  const index = buildProjectIndex({ files });

  return {
    tree: parsePageToBlockTree(files, pagePath, index),
    pageRootNodeId: findPageRootNodeId(files, pagePath, index),
    source: files.find((file) => file.path === pagePath)?.source ?? "",
    ...themeState,
  };
}

export async function updateBlockProps(siteId, pagePath, nodeId, nextProps) {
  const user = await requireUser();
  const site = await loadAuthorizedSite(siteId, user);
  await sourceContentActions.setBlockProps(
    site.slug,
    pagePath,
    nodeId,
    nextProps,
  );
  return getPageEditorState(siteId, pagePath);
}

export async function moveBlockAction(
  siteId,
  pagePath,
  movedNodeId,
  destinationNodeId,
  position,
) {
  const user = await requireUser();
  const site = await loadAuthorizedSite(siteId, user);
  await sourceContentActions.moveBlock(
    site.slug,
    pagePath,
    movedNodeId,
    destinationNodeId,
    position,
  );
  return getPageEditorState(siteId, pagePath);
}

export async function insertBlockAction(
  siteId,
  pagePath,
  blockId,
  containerNodeId,
) {
  const user = await requireUser();
  const site = await loadAuthorizedSite(siteId, user);
  await sourceContentActions.insertBlock(
    site.slug,
    pagePath,
    blockId,
    containerNodeId,
  );
  return getPageEditorState(siteId, pagePath);
}

export async function insertLibraryComponentAction(siteId, pagePath, componentId) {
  const user = await requireUser();
  const site = await loadAuthorizedSite(siteId, user);
  await libraryContentActions.insertLibraryComponent(
    site.slug,
    pagePath,
    componentId,
  );
  return getPageEditorState(siteId, pagePath);
}

export async function removeBlockAction(siteId, pagePath, nodeId) {
  const user = await requireUser();
  const site = await loadAuthorizedSite(siteId, user);
  await sourceContentActions.removeBlock(site.slug, pagePath, nodeId);
  return getPageEditorState(siteId, pagePath);
}

export async function duplicateBlockAction(siteId, pagePath, nodeId) {
  const user = await requireUser();
  const site = await loadAuthorizedSite(siteId, user);
  await sourceContentActions.duplicateBlock(site.slug, pagePath, nodeId);
  return getPageEditorState(siteId, pagePath);
}

/**
 * Undo/redo: restores the page file to an exact prior source snapshot the
 * client already holds (its own undo/redo stack — see
 * SourceContentEditor.jsx). A full-source snapshot is used rather than
 * replaying an operation's inverse because several operations
 * (insert/remove/move/duplicate-jsx, in @openforge/compiler's
 * apply-visual-operation.js) don't have one — a first-use insert also adds
 * an import as a separate, non-invertible step. A plain source write
 * sidesteps that gap entirely and is exactly as reliable as any other save.
 */
export async function restorePageSourceAction(siteId, pagePath, source) {
  const user = await requireUser();
  const site = await loadAuthorizedSite(siteId, user);
  await sourceContentActions.restorePageSource(site.slug, pagePath, source);
  return getPageEditorState(siteId, pagePath);
}

/**
 * Revision History panel: real prior versions of this page, read from its
 * own git log in the site's git-backed workspace repo (see
 * source-content-actions.js's listPageRevisions) — every save already
 * commits, so this *is* the page's authoritative revision history.
 */
export async function listPageRevisionsAction(siteId, pagePath) {
  const user = await requireUser();
  const site = await loadAuthorizedSite(siteId, user);
  return sourceContentActions.listPageRevisions(site.slug, pagePath);
}

/** The page's exact source at one historical commit, for diff/preview. */
export async function getPageRevisionSourceAction(siteId, pagePath, hash) {
  const user = await requireUser();
  const site = await loadAuthorizedSite(siteId, user);
  return sourceContentActions.getPageRevisionSource(
    site.slug,
    pagePath,
    hash,
  );
}

/**
 * Restores an older revision as the page's current content, through the
 * same real save/commit path as every other edit, then returns the
 * refreshed editor state (tree + source) so the canvas updates immediately.
 */
export async function restorePageRevisionAction(siteId, pagePath, hash) {
  const user = await requireUser();
  const site = await loadAuthorizedSite(siteId, user);
  await sourceContentActions.restorePageRevision(site.slug, pagePath, hash);
  return getPageEditorState(siteId, pagePath);
}
