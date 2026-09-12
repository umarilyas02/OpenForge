"use server";

import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { notFound } from "next/navigation";

import { getDb } from "../../../../../../src/lib/db.js";
import {
  buildMenuTree,
  flattenMenuTree,
} from "../../../../../../src/lib/menu-tree.js";
import {
  getMemberships,
  requireUser,
} from "../../../../../../src/lib/session.js";

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
  const topLevelCount = existing.filter((item) => !item.parentId).length;

  // New items always land at the end of the top level — nesting an item
  // under another is a deliberate drag, done afterward from the list.
  await db.insert(schema.menuItems).values({
    menuId: menu.id,
    label,
    url,
    parentId: null,
    position: topLevelCount,
  });

  revalidatePath(`/sites/${menu.siteId}/menus/${menu.id}`);
  return { error: null };
}

/**
 * Remove one item. If it's a top-level item with children of its own,
 * those children are promoted to top level in its place rather than left
 * behind with a dangling `parentId` (there's no DB-level FK/cascade on
 * `parent_id` — see `packages/db/src/schema/menus.js` — so this is
 * application-enforced, mirroring how WordPress handles deleting a parent
 * menu item).
 *
 * @param {string} menuId
 * @param {string} itemId
 */
export async function removeMenuItem(menuId, itemId) {
  const user = await requireUser();
  const { menu } = await loadAuthorizedMenu(menuId, user);

  const db = getDb();
  const items = await db
    .select()
    .from(schema.menuItems)
    .where(eq(schema.menuItems.menuId, menu.id));

  const tree = buildMenuTree(items);
  const topLevelIndex = tree.findIndex((node) => node.id === itemId);

  if (topLevelIndex !== -1) {
    const promotedChildren = tree[topLevelIndex].children.map((child) => ({
      ...child,
      children: [],
    }));
    tree.splice(topLevelIndex, 1, ...promotedChildren);
  } else {
    for (const node of tree) {
      node.children = node.children.filter((child) => child.id !== itemId);
    }
  }

  const updates = flattenMenuTree(tree).filter(
    (update) => update.id !== itemId,
  );

  await db
    .delete(schema.menuItems)
    .where(
      and(
        eq(schema.menuItems.id, itemId),
        eq(schema.menuItems.menuId, menu.id),
      ),
    );

  await Promise.all(
    updates.map(({ id, parentId, position }) =>
      db
        .update(schema.menuItems)
        .set({ parentId, position })
        .where(
          and(
            eq(schema.menuItems.id, id),
            eq(schema.menuItems.menuId, menu.id),
          ),
        ),
    ),
  );

  revalidatePath(`/sites/${menu.siteId}/menus/${menu.id}`);
  return { ok: true };
}

/**
 * Persist a full reorder/renest of a menu's items in one go.
 *
 * `tree` is the nested shape `buildMenuTree` produces and the
 * `MenuItemList` UI edits client-side: an ordered array of top-level items,
 * each optionally carrying a `children` array of its direct nested items
 * (one level deep — the UI never produces more, though this just flattens
 * whatever shape it's given). It's flattened back into `{id, parentId,
 * position}` triples and written in one pass, so a drag that both moves an
 * item under a different parent *and* reorders siblings persists
 * atomically from the caller's point of view.
 *
 * @param {string} menuId
 * @param {Array<{ id: string, children?: { id: string }[] }>} tree
 */
export async function reorderMenuItems(menuId, tree) {
  const user = await requireUser();
  const { menu } = await loadAuthorizedMenu(menuId, user);

  const updates = flattenMenuTree(tree);
  const db = getDb();
  await Promise.all(
    updates.map(({ id, parentId, position }) =>
      db
        .update(schema.menuItems)
        .set({ parentId, position })
        .where(
          and(
            eq(schema.menuItems.id, id),
            eq(schema.menuItems.menuId, menu.id),
          ),
        ),
    ),
  );

  revalidatePath(`/sites/${menu.siteId}/menus/${menu.id}`);
  return { ok: true };
}
