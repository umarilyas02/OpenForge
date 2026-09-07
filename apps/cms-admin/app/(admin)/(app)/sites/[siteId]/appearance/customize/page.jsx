import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDb } from "../../../../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../../../../src/lib/session.js";

export default async function CustomizePage({ params }) {
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

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Appearance / Customize</p>
          <h1 className="page-title">Customize</h1>
          <p className="page-subtitle">
            Site identity, header, and footer settings.
          </p>
        </div>
      </div>

      <div className="empty-state">
        <p className="empty-state-title">Built on Design Tokens</p>
        <p className="empty-state-body">
          Colors, type, spacing, and radius already live in Design Tokens —
          dedicated identity/header/footer controls are coming next.
        </p>
        <Link
          className="btn btn-ghost"
          href={`/sites/${site.id}/appearance/design-tokens`}
        >
          Open Design Tokens
        </Link>
      </div>
    </div>
  );
}
