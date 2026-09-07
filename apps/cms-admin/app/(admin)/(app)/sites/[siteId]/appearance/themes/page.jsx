import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDb } from "../../../../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../../../../src/lib/session.js";

export default async function ThemesPage({ params }) {
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

  const [installation] = await db
    .select()
    .from(schema.themeInstallations)
    .where(eq(schema.themeInstallations.siteId, site.id));

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Appearance / Themes</p>
          <h1 className="page-title">Themes</h1>
          <p className="page-subtitle">
            The theme controls layout and rendering for /{site.slug}.
          </p>
        </div>
      </div>

      <div className="grid-responsive">
        <div className="card stack-sm">
          <div
            style={{
              aspectRatio: "16 / 10",
              background: "var(--surface-raised)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius)",
            }}
          />
          <div className="quick-link-title">
            {installation?.themeId || "Default theme"}
          </div>
          <div className="quick-link-body">
            {installation
              ? `v${installation.themeVersion} · Active`
              : "No theme installed yet"}
          </div>
          <Link
            className="btn btn-ghost"
            href={`/sites/${site.id}/appearance/customize`}
          >
            Customize
          </Link>
        </div>
      </div>

      <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
        A theme marketplace for installing and switching themes is coming
        soon.
      </p>
    </div>
  );
}
