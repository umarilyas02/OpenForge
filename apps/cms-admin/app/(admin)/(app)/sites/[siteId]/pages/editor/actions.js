"use server";

import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { getDb } from "../../../../../../../src/lib/db.js";
import {
  getMemberships,
  requireUser,
} from "../../../../../../../src/lib/session.js";
import { getWorkspaceManager } from "../../../../../../../src/lib/site-workspace.js";
import * as sourceContentActions from "../../../../../../../src/lib/source-content-actions.js";
import {
  findPageRootNodeId,
  parsePageToBlockTree,
} from "../../../../../../../src/lib/source-content-tree.js";

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

export async function getPageEditorState(siteId, pagePath) {
  const user = await requireUser();
  const site = await loadAuthorizedSite(siteId, user);
  const files = await getWorkspaceManager().readFiles(site.slug);

  return {
    tree: parsePageToBlockTree(files, pagePath),
    pageRootNodeId: findPageRootNodeId(files, pagePath),
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

export async function removeBlockAction(siteId, pagePath, nodeId) {
  const user = await requireUser();
  const site = await loadAuthorizedSite(siteId, user);
  await sourceContentActions.removeBlock(site.slug, pagePath, nodeId);
  return getPageEditorState(siteId, pagePath);
}
