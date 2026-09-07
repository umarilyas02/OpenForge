import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { AppShell } from "../../../../../src/components/AppShell.jsx";
import { getDb } from "../../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../../src/lib/session.js";
import { buildSiteUrl } from "../../../../../src/lib/site-url.js";
import { logout } from "../../actions.js";

const ICONS = {
  dashboard: (
    <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
      <rect height="6" rx="1" stroke="currentColor" strokeWidth="1.3" width="6" x="2" y="2" />
      <rect height="6" rx="1" stroke="currentColor" strokeWidth="1.3" width="6" x="8" y="2" />
      <rect height="6" rx="1" stroke="currentColor" strokeWidth="1.3" width="6" x="2" y="8" />
      <rect height="6" rx="1" stroke="currentColor" strokeWidth="1.3" width="6" x="8" y="8" />
    </svg>
  ),
  posts: (
    <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path d="M3 3h10M3 3v10h10V3M3 3l4.5 5L3 13M8 13h5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
    </svg>
  ),
  media: (
    <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
      <rect height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" width="12" x="2" y="2.5" />
      <circle cx="5.5" cy="6" r="1.2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3 11.5l3.2-3.2a1 1 0 0 1 1.4 0L11 11.5M9 9.5l1-1a1 1 0 0 1 1.4 0L13 10.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
    </svg>
  ),
  pages: (
    <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path d="M4 2h5l3 3v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1Z" stroke="currentColor" strokeWidth="1.3" />
      <path d="M9 2v3h3" stroke="currentColor" strokeWidth="1.3" />
    </svg>
  ),
  content: (
    <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path d="M2 4h12M2 8h8M2 12h5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
    </svg>
  ),
  appearance: (
    <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.3" />
      <path d="M8 2v3M8 11v3M2 8h3M11 8h3" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
    </svg>
  ),
  extensions: (
    <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path d="M6 2.5h4v2.3a1.2 1.2 0 0 0 1.2 1.2H13.5v4h-2.3a1.2 1.2 0 0 0-1.2 1.2v2.3h-4v-2.3a1.2 1.2 0 0 0-1.2-1.2H2.5v-4h2.3A1.2 1.2 0 0 0 6 4.8V2.5Z" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.3" />
    </svg>
  ),
  users: (
    <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
      <circle cx="6" cy="5.5" r="2.3" stroke="currentColor" strokeWidth="1.3" />
      <path d="M1.8 13.5c.6-2.4 2.2-3.7 4.2-3.7s3.6 1.3 4.2 3.7M10.5 3.2c1.2.3 2 1.4 2 2.7s-.8 2.4-2 2.7M12 9.9c1.6.4 2.6 1.5 3 3.4" stroke="currentColor" strokeLinecap="round" strokeWidth="1.3" />
    </svg>
  ),
  tools: (
    <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
      <path d="M9.5 6.5 12.8 3.2a3 3 0 0 1 1 4l-.3.3-4 4M9.5 6.5 3.2 12.8a1.4 1.4 0 0 0 2 2L11 8.5M9.5 6.5 8 5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
    </svg>
  ),
  settings: (
    <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
      <circle cx="8" cy="8" r="2.2" stroke="currentColor" strokeWidth="1.3" />
      <path
        d="M8 1.5v2M8 12.5v2M2.6 4.6l1.4 1.4M12 10l1.4 1.4M1.5 8h2M12.5 8h2M2.6 11.4l1.4-1.4M12 6l1.4-1.4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="1.3"
      />
    </svg>
  ),
};

function navGroupsFor(siteId) {
  const base = `/sites/${siteId}`;
  return [
    { key: "dashboard", label: "Dashboard", items: [{ href: `${base}/dashboard`, label: "Dashboard", icon: ICONS.dashboard }] },
    { key: "posts", label: "Posts", items: [{ href: `${base}/posts`, label: "Posts", icon: ICONS.posts }] },
    { key: "media", label: "Media", items: [{ href: `${base}/media`, label: "Media", icon: ICONS.media }] },
    { key: "pages", label: "Pages", items: [{ href: `${base}/pages`, label: "Pages", icon: ICONS.pages }] },
    { key: "content", label: "Content", items: [{ href: `${base}/content`, label: "Content", icon: ICONS.content }] },
    {
      key: "appearance",
      label: "Appearance",
      items: [
        { href: `${base}/appearance/themes`, label: "Themes" },
        { href: `${base}/appearance/site-editor`, label: "Site Editor" },
        { href: `${base}/appearance/customize`, label: "Customize" },
        { href: `${base}/menus`, label: "Menus" },
        { href: `${base}/appearance/design-tokens`, label: "Design Tokens" },
      ],
    },
    { key: "extensions", label: "Extensions", items: [{ href: `${base}/extensions`, label: "Extensions", icon: ICONS.extensions }] },
    { key: "users", label: "Users", items: [{ href: `${base}/users`, label: "Users", icon: ICONS.users }] },
    { key: "tools", label: "Tools", items: [{ href: `${base}/tools`, label: "Tools", icon: ICONS.tools }] },
    { key: "settings", label: "Settings", items: [{ href: `${base}/settings`, label: "Settings", icon: ICONS.settings }] },
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

  const siteUrl = buildSiteUrl(site);
  const domain = site.customDomain || new URL(siteUrl).hostname;

  return (
    <AppShell
      logout={logout}
      navGroups={navGroupsFor(site.id)}
      siteSwitcher={{
        current: { id: site.id, name: site.name, domain },
        sites: allSites.map((entry) => ({
          id: entry.id,
          name: entry.name,
          href: `/sites/${entry.id}/dashboard`,
        })),
        manageSitesHref: "/sites",
      }}
      user={user}
      viewSiteHref={siteUrl}
    >
      {children}
    </AppShell>
  );
}
