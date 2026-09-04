import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { asc, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MenuItemAddForm } from "../../../../../../../src/components/MenuItemAddForm.jsx";
import { MenuItemList } from "../../../../../../../src/components/MenuItemList.jsx";
import { getDb } from "../../../../../../../src/lib/db.js";
import {
  getMemberships,
  requireUser,
} from "../../../../../../../src/lib/session.js";
import { addMenuItem, removeMenuItem, reorderMenuItems } from "../actions.js";

export default async function MenuDetailPage({ params }) {
  const { siteId, menuId } = await params;
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

  const [menu] = await db
    .select()
    .from(schema.menus)
    .where(eq(schema.menus.id, menuId));
  if (!menu || menu.siteId !== site.id) notFound();

  const items = await db
    .select()
    .from(schema.menuItems)
    .where(eq(schema.menuItems.menuId, menu.id))
    .orderBy(asc(schema.menuItems.position));

  return (
    <div className="stack">
      <Link className="breadcrumb" href={`/sites/${site.id}/menus`}>
        ← Menus
      </Link>
      <div className="page-header">
        <div>
          <h1 className="page-title">{menu.label}</h1>
          <p className="page-subtitle">{menu.key}</p>
        </div>
      </div>

      <MenuItemList
        initialItems={items}
        menuId={menu.id}
        removeMenuItem={removeMenuItem}
        reorderMenuItems={reorderMenuItems}
      />

      <MenuItemAddForm addMenuItem={addMenuItem} menuId={menu.id} />
    </div>
  );
}
