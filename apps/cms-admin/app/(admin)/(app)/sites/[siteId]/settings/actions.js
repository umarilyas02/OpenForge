"use server";

import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import {
  GitHubConnectionError,
  verifyGitHubRepoAccess,
} from "../../../../../../src/lib/github-connection.js";
import { getDb } from "../../../../../../src/lib/db.js";
import {
  getMemberships,
  requireUser,
} from "../../../../../../src/lib/session.js";
import { getSecretVault } from "../../../../../../src/lib/secret-vault.js";
import {
  buildGitHubRemoteUrl,
  commitSiteChanges,
  pushSiteChanges,
} from "../../../../../../src/lib/site-git.js";
import { getWorkspaceManager } from "../../../../../../src/lib/site-workspace.js";

const SLUG_PATTERN = /^[a-z][a-z0-9-]*$/u;
const DOMAIN_PATTERN =
  /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/iu;

/**
 * @param {string} siteId
 * @param {{ error: string | null, ok?: boolean }} _prevState
 * @param {FormData} formData
 */
export async function updateSiteSettings(siteId, _prevState, formData) {
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

  const name = String(formData.get("name") ?? "").trim();
  const slug = String(formData.get("slug") ?? "")
    .trim()
    .toLowerCase();
  const customDomain = String(formData.get("customDomain") ?? "")
    .trim()
    .toLowerCase();
  const status = String(formData.get("status") ?? "draft");

  if (!name) return { error: "Name is required.", ok: false };
  if (!SLUG_PATTERN.test(slug)) {
    return {
      error: "Slug must be lowercase letters, numbers, and hyphens.",
      ok: false,
    };
  }
  if (customDomain && !DOMAIN_PATTERN.test(customDomain)) {
    return { error: "Custom domain is not a valid hostname.", ok: false };
  }
  if (!schema.SITE_STATUSES.includes(status)) {
    return { error: "Invalid status.", ok: false };
  }

  try {
    await db
      .update(schema.sites)
      .set({
        name,
        slug,
        customDomain: customDomain || null,
        status,
        updatedAt: new Date(),
      })
      .where(eq(schema.sites.id, site.id));
  } catch {
    return {
      error: "That slug or custom domain is already in use by another site.",
      ok: false,
    };
  }

  return { error: null, ok: true };
}

const OWNER_OR_REPO_PATTERN = /^[a-zA-Z0-9._-]{1,100}$/u;
const BRANCH_PATTERN = /^[a-zA-Z0-9._/-]{1,200}$/u;

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
 * @param {string} siteId
 * @returns {Promise<{ id: string, repoOwner: string, repoName: string, defaultBranch: string } | null>}
 */
export async function getSiteGitConnection(siteId) {
  const db = getDb();
  const [connection] = await db
    .select({
      id: schema.siteGitConnections.id,
      repoOwner: schema.siteGitConnections.repoOwner,
      repoName: schema.siteGitConnections.repoName,
      defaultBranch: schema.siteGitConnections.defaultBranch,
    })
    .from(schema.siteGitConnections)
    .where(eq(schema.siteGitConnections.siteId, siteId));
  return connection ?? null;
}

/**
 * Verifies the token can push to the given repo, then stores it encrypted
 * (see secret-vault.js) and records the connection. The plaintext token
 * never reaches the database — only a vault reference does.
 *
 * @param {string} siteId
 * @param {{ error: string | null, ok?: boolean }} _prevState
 * @param {FormData} formData
 */
export async function connectGitHub(siteId, _prevState, formData) {
  const user = await requireUser();
  const site = await loadAuthorizedSite(siteId, user);

  const owner = String(formData.get("owner") ?? "").trim();
  const repo = String(formData.get("repo") ?? "").trim();
  const token = String(formData.get("token") ?? "").trim();

  if (!OWNER_OR_REPO_PATTERN.test(owner) || !OWNER_OR_REPO_PATTERN.test(repo)) {
    return { error: "Enter a valid owner and repository name.", ok: false };
  }
  if (!token) {
    return { error: "A personal access token is required.", ok: false };
  }

  let defaultBranch;
  try {
    ({ defaultBranch } = await verifyGitHubRepoAccess({ token, owner, repo }));
  } catch (error) {
    if (error instanceof GitHubConnectionError) {
      return { error: error.message, ok: false };
    }
    throw error;
  }

  const db = getDb();
  const vault = getSecretVault();
  const existing = await getSiteGitConnection(site.id);
  if (existing) {
    await vault.deleteSecret(existing.secretRef).catch(() => {});
  }

  const secretMetadata = await vault.putSecret({
    provider: "github",
    connectionId: site.id,
    name: "access-token",
    value: token,
  });

  await db
    .insert(schema.siteGitConnections)
    .values({
      siteId: site.id,
      repoOwner: owner,
      repoName: repo,
      defaultBranch,
      secretRef: secretMetadata.ref,
      createdBy: user.id,
    })
    .onConflictDoUpdate({
      target: schema.siteGitConnections.siteId,
      set: {
        repoOwner: owner,
        repoName: repo,
        defaultBranch,
        secretRef: secretMetadata.ref,
        updatedAt: new Date(),
      },
    });

  return { error: null, ok: true };
}

/**
 * @param {string} siteId
 */
export async function disconnectGitHub(siteId) {
  const user = await requireUser();
  const site = await loadAuthorizedSite(siteId, user);

  const db = getDb();
  const [connection] = await db
    .select({
      id: schema.siteGitConnections.id,
      secretRef: schema.siteGitConnections.secretRef,
    })
    .from(schema.siteGitConnections)
    .where(eq(schema.siteGitConnections.siteId, site.id));
  if (!connection) return { error: null, ok: true };

  await getSecretVault()
    .deleteSecret(connection.secretRef)
    .catch(() => {});
  await db
    .delete(schema.siteGitConnections)
    .where(eq(schema.siteGitConnections.id, connection.id));

  return { error: null, ok: true };
}

/**
 * Commits any pending workspace changes, then pushes to the connected
 * GitHub repository.
 *
 * @param {string} siteId
 */
export async function pushToGitHub(siteId) {
  const user = await requireUser();
  const site = await loadAuthorizedSite(siteId, user);

  const db = getDb();
  const [connection] = await db
    .select()
    .from(schema.siteGitConnections)
    .where(eq(schema.siteGitConnections.siteId, site.id));
  if (!connection) {
    return { error: "Connect a GitHub repository first.", ok: false };
  }

  let rootPath;
  try {
    ({ rootPath } = await getWorkspaceManager().describe(site.slug));
  } catch {
    return { error: "This site has no workspace files yet.", ok: false };
  }

  await commitSiteChanges(rootPath, "Update from OpenForge");

  try {
    await getSecretVault().withSecret(
      connection.secretRef,
      { provider: "github", connectionId: site.id, name: "access-token" },
      (token) =>
        pushSiteChanges(rootPath, {
          remoteUrl: buildGitHubRemoteUrl({
            owner: connection.repoOwner,
            repo: connection.repoName,
          }),
          branch: BRANCH_PATTERN.test(connection.defaultBranch)
            ? connection.defaultBranch
            : "main",
          token,
        }),
    );
  } catch (error) {
    const output = String(error.stderr || error.message || "");
    return {
      error: `Push failed: ${output.slice(0, 300) || "unknown error."}`,
      ok: false,
    };
  }

  return { error: null, ok: true };
}
