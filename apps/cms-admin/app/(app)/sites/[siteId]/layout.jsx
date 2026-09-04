import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { AppShell } from "../../../../src/components/AppShell.jsx";
import { getDb } from "../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../src/lib/session.js";
import { buildSiteUrl } from "../../../../src/lib/site-url.js";
import { logout } from "../../actions.js";

function navGroupsFor(siteId) {
  const base = `/sites/${siteId}`;
  return [
    {
      key: "content",
      label: "Content",
      description: "Pages, posts, and site navigation.",
      defaultOpen: true,
      items: [
        {
          href: base,
          label: "Pages & posts",
          icon: (
            <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
              <path
                d="M4 2h5l3 3v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path d="M9 2v3h3" stroke="currentColor" strokeWidth="1.3" />
            </svg>
          ),
        },
        {
          href: `${base}/menus`,
          label: "Menus",
          icon: (
            <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
              <path
                d="M2 4h12M2 8h12M2 12h8"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.3"
              />
            </svg>
          ),
        },
      ],
    },
    {
      key: "design",
      label: "Design",
      description: "Colors and theme tokens for this site.",
      items: [
        {
          href: `${base}/appearance`,
          label: "Appearance",
          icon: (
            <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
              <circle
                cx="8"
                cy="8"
                r="6"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M8 2v3M8 11v3M2 8h3M11 8h3"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.3"
              />
            </svg>
          ),
        },
      ],
    },
    {
      key: "site",
      label: "Site",
      description: "Name, domain, and publish status.",
      items: [
        {
          href: `${base}/settings`,
          label: "Settings",
          icon: (
            <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
              <circle
                cx="8"
                cy="8"
                r="2.2"
                stroke="currentColor"
                strokeWidth="1.3"
              />
              <path
                d="M8 1.5v2M8 12.5v2M2.6 4.6l1.4 1.4M12 10l1.4 1.4M1.5 8h2M12.5 8h2M2.6 11.4l1.4-1.4M12 6l1.4-1.4"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.3"
              />
            </svg>
          ),
        },
      ],
    },
  ];
}

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

  const allSites = await db
    .select()
    .from(schema.sites)
    .where(eq(schema.sites.organizationId, site.organizationId));

  return (
    <AppShell
      logout={logout}
      navGroups={navGroupsFor(site.id)}
      siteSwitcher={{
        current: { id: site.id, name: site.name },
        sites: allSites.map((entry) => ({
          id: entry.id,
          name: entry.name,
          href: `/sites/${entry.id}`,
        })),
        manageSitesHref: "/sites",
      }}
      user={user}
      viewSiteHref={buildSiteUrl(site)}
    >
      {children}
    </AppShell>
  );
}
