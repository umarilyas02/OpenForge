"use server";

import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

import { getDb } from "../../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../../src/lib/session.js";

const KEY_PATTERN = /^[a-z][a-z0-9-]*$/u;

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

async function loadAuthorizedMenu(menuId, user) {
  const db = getDb();
  const [menu] = await db
    .select()
    .from(schema.menus)
    .where(eq(schema.menus.id, menuId));
  if (!menu) notFound();

  const site = await loadAuthorizedSite(menu.siteId, user);
  return { site, menu };
}

/**
 * @param {string} siteId
 * @param {{ error: string | null }} _prevState
 * @param {FormData} formData
 */
export async function createMenu(siteId, _prevState, formData) {
  const user = await requireUser();
  const site = await loadAuthorizedSite(siteId, user);

  const key = String(formData.get("key") ?? "")
    .trim()
    .toLowerCase();
  const label = String(formData.get("label") ?? "").trim();

  if (!KEY_PATTERN.test(key)) {
    return { error: "Key must be lowercase letters, numbers, and hyphens." };
  }
  if (!label) return { error: "Label is required." };

  const db = getDb();
  try {
    await db.insert(schema.menus).values({ siteId: site.id, key, label });
  } catch {
    return { error: `A menu with key "${key}" already exists on this site.` };
  }

  revalidatePath(`/sites/${site.id}/menus`);
  return { error: null };
}

/**
 * @param {string} menuId
 * @param {{ error: string | null }} _prevState
 * @param {FormData} formData
 */
export async function addMenuItem(menuId, _prevState, formData) {
  const user = await requireUser();
  const { menu } = await loadAuthorizedMenu(menuId, user);

  const label = String(formData.get("label") ?? "").trim();
  const url = String(formData.get("url") ?? "").trim();
  if (!label) return { error: "Label is required." };
  if (!url) return { error: "URL is required." };

  const db = getDb();
  const existing = await db
    .select()
    .from(schema.menuItems)
    .where(eq(schema.menuItems.menuId, menu.id));

  await db.insert(schema.menuItems).values({
    menuId: menu.id,
    label,
    url,
    position: existing.length,
  });

  revalidatePath(`/sites/${menu.siteId}/menus/${menu.id}`);
  return { error: null };
}

/**
 * @param {string} menuId
 * @param {string} itemId
 */
export async function removeMenuItem(menuId, itemId) {
  const user = await requireUser();
  const { menu } = await loadAuthorizedMenu(menuId, user);

  const db = getDb();
  await db
    .delete(schema.menuItems)
    .where(
      and(
        eq(schema.menuItems.id, itemId),
        eq(schema.menuItems.menuId, menu.id),
      ),
    );

  revalidatePath(`/sites/${menu.siteId}/menus/${menu.id}`);
  return { ok: true };
}

/**
 * @param {string} menuId
 * @param {string[]} orderedItemIds
 */
export async function reorderMenuItems(menuId, orderedItemIds) {
  const user = await requireUser();
  const { menu } = await loadAuthorizedMenu(menuId, user);

  const db = getDb();
  await Promise.all(
    orderedItemIds.map((itemId, index) =>
      db
        .update(schema.menuItems)
        .set({ position: index })
        .where(
          and(
            eq(schema.menuItems.id, itemId),
            eq(schema.menuItems.menuId, menu.id),
          ),
        ),
    ),
  );

  revalidatePath(`/sites/${menu.siteId}/menus/${menu.id}`);
  return { ok: true };
}
