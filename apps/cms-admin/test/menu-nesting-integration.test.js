import { hashPassword } from "@openforge/auth";
import { createDbClient, schema } from "@openforge/db";
import { and, asc, eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { buildMenuTree, flattenMenuTree } from "../src/lib/menu-tree.js";

const connectionString =
  process.env.DATABASE_URL ??
  "postgres://openforge:openforge_dev_only@localhost:5432/openforge";

async function probeDatabase() {
  const client = createDbClient({ connectionString });
  try {
    await client.db.execute("select 1");
    return true;
  } catch {
    return false;
  } finally {
    await client.close();
  }
}

const available = await probeDatabase();

/**
 * Read every item for a menu and rebuild it as the nested tree the UI
 * would render — the same round trip `[menuId]/page.jsx` and
 * `MenuItemList` do in production.
 */
async function readTree(db, menuId) {
  const items = await db
    .select()
    .from(schema.menuItems)
    .where(eq(schema.menuItems.menuId, menuId))
    .orderBy(asc(schema.menuItems.position));
  return buildMenuTree(items);
}

/**
 * Exactly the write path `reorderMenuItems` (menus/actions.js) runs after
 * auth checks: flatten the edited tree and persist each item's parentId
 * + position.
 */
async function persistTree(db, menuId, tree) {
  const updates = flattenMenuTree(tree);
  await Promise.all(
    updates.map(({ id, parentId, position }) =>
      db
        .update(schema.menuItems)
        .set({ parentId, position })
        .where(
          and(eq(schema.menuItems.id, id), eq(schema.menuItems.menuId, menuId)),
        ),
    ),
  );
}

describe.skipIf(!available)(
  "menu item nesting — same db path the Menus server actions use",
  () => {
    async function seedSiteAndMenu(db, label) {
      const [user] = await db
        .insert(schema.users)
        .values({
          email: `menu-nesting-${label}-${Date.now()}@example.test`,
          displayName: "Menu Nesting Test",
          passwordHash: hashPassword("irrelevant-password"),
        })
        .returning();

      const [organization] = await db
        .insert(schema.organizations)
        .values({
          name: `Menu Nesting Org ${label}`,
          slug: `menu-nesting-org-${label}-${Date.now()}`,
          createdBy: user.id,
        })
        .returning();

      const [site] = await db
        .insert(schema.sites)
        .values({
          organizationId: organization.id,
          name: `Menu Nesting Site ${label}`,
          slug: `menu-nesting-site-${label}-${Date.now()}`,
          createdBy: user.id,
        })
        .returning();

      const [menu] = await db
        .insert(schema.menus)
        .values({ siteId: site.id, key: "primary", label: "Primary" })
        .returning();

      return { user, site, menu };
    }

    it("creates a nested structure, persists it, and reads it back with correct parent/child relationships", async () => {
      const { db, close } = createDbClient({ connectionString });

      try {
        const { menu } = await seedSiteAndMenu(db, "create");

        const [home] = await db
          .insert(schema.menuItems)
          .values({ menuId: menu.id, label: "Home", url: "/", position: 0 })
          .returning();
        const [about] = await db
          .insert(schema.menuItems)
          .values({
            menuId: menu.id,
            label: "About",
            url: "/about",
            position: 1,
          })
          .returning();
        const [team] = await db
          .insert(schema.menuItems)
          .values({
            menuId: menu.id,
            label: "Team",
            url: "/about/team",
            position: 0,
            parentId: about.id,
          })
          .returning();
        const [history] = await db
          .insert(schema.menuItems)
          .values({
            menuId: menu.id,
            label: "History",
            url: "/about/history",
            position: 1,
            parentId: about.id,
          })
          .returning();

        const tree = await readTree(db, menu.id);

        expect(tree.map((node) => node.id)).toEqual([home.id, about.id]);
        const aboutNode = tree.find((node) => node.id === about.id);
        expect(aboutNode.children.map((child) => child.id)).toEqual([
          team.id,
          history.id,
        ]);
        expect(aboutNode.children.map((child) => child.label)).toEqual([
          "Team",
          "History",
        ]);
        // Home has no children — confirmed nesting didn't leak sideways.
        const homeNode = tree.find((node) => node.id === home.id);
        expect(homeNode.children).toEqual([]);
      } finally {
        await close();
      }
    }, 15000);

    it("reorders within a nesting level without disturbing the other level", async () => {
      const { db, close } = createDbClient({ connectionString });

      try {
        const { menu } = await seedSiteAndMenu(db, "reorder");

        const [parent] = await db
          .insert(schema.menuItems)
          .values({
            menuId: menu.id,
            label: "Products",
            url: "/products",
            position: 0,
          })
          .returning();
        const [first] = await db
          .insert(schema.menuItems)
          .values({
            menuId: menu.id,
            label: "Widgets",
            url: "/products/widgets",
            position: 0,
            parentId: parent.id,
          })
          .returning();
        const [second] = await db
          .insert(schema.menuItems)
          .values({
            menuId: menu.id,
            label: "Gadgets",
            url: "/products/gadgets",
            position: 1,
            parentId: parent.id,
          })
          .returning();
        const [sibling] = await db
          .insert(schema.menuItems)
          .values({
            menuId: menu.id,
            label: "Contact",
            url: "/contact",
            position: 1,
          })
          .returning();

        const tree = await readTree(db, menu.id);
        const productsNode = tree.find((node) => node.id === parent.id);
        // Drag "Gadgets" in front of "Widgets" — a same-level reorder.
        productsNode.children = [
          ...productsNode.children.filter((child) => child.id === second.id),
          ...productsNode.children.filter((child) => child.id === first.id),
        ];

        await persistTree(db, menu.id, tree);

        const after = await readTree(db, menu.id);
        const productsAfter = after.find((node) => node.id === parent.id);
        expect(productsAfter.children.map((child) => child.id)).toEqual([
          second.id,
          first.id,
        ]);
        // Top level is untouched by the child-level reorder.
        expect(after.map((node) => node.id)).toEqual([parent.id, sibling.id]);
      } finally {
        await close();
      }
    }, 15000);

    it("moving a top-level item to become a child persists the new parentId", async () => {
      const { db, close } = createDbClient({ connectionString });

      try {
        const { menu } = await seedSiteAndMenu(db, "renest");

        const [company] = await db
          .insert(schema.menuItems)
          .values({
            menuId: menu.id,
            label: "Company",
            url: "/company",
            position: 0,
          })
          .returning();
        const [careers] = await db
          .insert(schema.menuItems)
          .values({
            menuId: menu.id,
            label: "Careers",
            url: "/careers",
            position: 1,
          })
          .returning();

        const tree = await readTree(db, menu.id);
        // Drag the top-level "Careers" item to nest under "Company".
        const [, careersNode] = tree;
        const nextTree = [
          { ...tree[0], children: [{ ...careersNode, children: [] }] },
        ];

        await persistTree(db, menu.id, nextTree);

        const after = await readTree(db, menu.id);
        expect(after.map((node) => node.id)).toEqual([company.id]);
        expect(after[0].children.map((child) => child.id)).toEqual([
          careers.id,
        ]);

        const [careersRow] = await db
          .select()
          .from(schema.menuItems)
          .where(eq(schema.menuItems.id, careers.id));
        expect(careersRow.parentId).toBe(company.id);
        expect(careersRow.position).toBe(0);
      } finally {
        await close();
      }
    }, 15000);

    it("removing a parent promotes its children to top level instead of orphaning them", async () => {
      const { db, close } = createDbClient({ connectionString });

      try {
        const { menu } = await seedSiteAndMenu(db, "remove-parent");

        const [about] = await db
          .insert(schema.menuItems)
          .values({
            menuId: menu.id,
            label: "About",
            url: "/about",
            position: 0,
          })
          .returning();
        const [team] = await db
          .insert(schema.menuItems)
          .values({
            menuId: menu.id,
            label: "Team",
            url: "/about/team",
            position: 0,
            parentId: about.id,
          })
          .returning();
        const [contact] = await db
          .insert(schema.menuItems)
          .values({
            menuId: menu.id,
            label: "Contact",
            url: "/contact",
            position: 1,
          })
          .returning();

        // Mirrors removeMenuItem's own tree surgery in menus/actions.js.
        const items = await db
          .select()
          .from(schema.menuItems)
          .where(eq(schema.menuItems.menuId, menu.id));
        const tree = buildMenuTree(items);
        const topLevelIndex = tree.findIndex((node) => node.id === about.id);
        const promoted = tree[topLevelIndex].children.map((child) => ({
          ...child,
          children: [],
        }));
        tree.splice(topLevelIndex, 1, ...promoted);
        const updates = flattenMenuTree(tree).filter(
          (update) => update.id !== about.id,
        );

        await db
          .delete(schema.menuItems)
          .where(eq(schema.menuItems.id, about.id));
        await Promise.all(
          updates.map(({ id, parentId, position }) =>
            db
              .update(schema.menuItems)
              .set({ parentId, position })
              .where(eq(schema.menuItems.id, id)),
          ),
        );

        const after = await readTree(db, menu.id);
        expect(after.map((node) => node.id)).toEqual([team.id, contact.id]);
        expect(after.every((node) => node.children.length === 0)).toBe(true);

        const [teamRow] = await db
          .select()
          .from(schema.menuItems)
          .where(eq(schema.menuItems.id, team.id));
        expect(teamRow.parentId).toBeNull();
      } finally {
        await close();
      }
    }, 15000);
  },
);
