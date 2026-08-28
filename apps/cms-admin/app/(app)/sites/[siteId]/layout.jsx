import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteTabNav } from "../../../../src/components/SiteTabNav.jsx";
import { getDb } from "../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../src/lib/session.js";
import { buildSiteUrl } from "../../../../src/lib/site-url.js";

export default async function SiteLayout({ children, params }) {
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
      <div className="site-subnav">
        <div className="site-subnav-heading">
          <Link className="breadcrumb" href="/sites">
            ← Sites
          </Link>
          <span className="site-subnav-name">{site.name}</span>
        </div>
        <a
          className="btn btn-ghost"
          href={buildSiteUrl(site)}
          rel="noreferrer"
          target="_blank"
        >
          View site ↗
        </a>
      </div>
      <SiteTabNav siteId={site.id} />
      {children}
    </div>
  );
}
