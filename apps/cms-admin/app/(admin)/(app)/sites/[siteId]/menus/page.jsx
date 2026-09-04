import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MenuCreateForm } from "../../../../../../src/components/MenuCreateForm.jsx";
import { getDb } from "../../../../../../src/lib/db.js";
import {
  getMemberships,
  requireUser,
} from "../../../../../../src/lib/session.js";
import { createMenu } from "./actions.js";

export default async function MenusPage({ params }) {
  const { siteId } = await params;
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

  const menus = await db
    .select()
    .from(schema.menus)
    .where(eq(schema.menus.siteId, site.id));

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <h1 className="page-title">Menus</h1>
          <p className="page-subtitle">
            Navigation links your theme can render, e.g. a header or footer
            menu.
          </p>
        </div>
      </div>

      {menus.length === 0 ? (
        <p className="muted">No menus yet — create one below.</p>
      ) : (
        <div className="card">
          {menus.map((menu) => (
            <Link
              className="list-row"
              href={`/sites/${site.id}/menus/${menu.id}`}
              key={menu.id}
            >
              <div>
                <div className="list-row-title">{menu.label}</div>
                <div className="list-row-meta">{menu.key}</div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <MenuCreateForm createMenu={createMenu} siteId={site.id} />
    </div>
  );
}
