import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { SiteSettingsForm } from "../../../../../src/components/SiteSettingsForm.jsx";
import { getDb } from "../../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../../src/lib/session.js";
import { updateSiteSettings } from "./actions.js";

export default async function SiteSettingsPage({ params }) {
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
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Name, domain, and publish status.</p>
        </div>
      </div>

      <SiteSettingsForm site={site} updateSiteSettings={updateSiteSettings} />
    </div>
  );
}
