import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import {
  LayoutDashboard,
  Newspaper,
  Image,
  FileText,
  LayoutList,
  Palette,
  Plug,
  Users as UsersIcon,
  Wrench,
  Settings as SettingsIcon,
} from "lucide-react";
import { notFound } from "next/navigation";

import { AppShell } from "../../../../../src/components/AppShell.jsx";
import { getDb } from "../../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../../src/lib/session.js";
import { buildSiteUrl } from "../../../../../src/lib/site-url.js";
import { logout } from "../../actions.js";

const ICON_PROPS = { size: 16, strokeWidth: 1.75 };

const ICONS = {
  dashboard: <LayoutDashboard {...ICON_PROPS} />,
  posts: <Newspaper {...ICON_PROPS} />,
  media: <Image {...ICON_PROPS} />,
  pages: <FileText {...ICON_PROPS} />,
  content: <LayoutList {...ICON_PROPS} />,
  appearance: <Palette {...ICON_PROPS} />,
  extensions: <Plug {...ICON_PROPS} />,
  users: <UsersIcon {...ICON_PROPS} />,
  tools: <Wrench {...ICON_PROPS} />,
  settings: <SettingsIcon {...ICON_PROPS} />,
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
      previewHref={`/preview/${site.id}`}
      user={user}
      viewSiteHref={siteUrl}
    >
      {children}
    </AppShell>
  );
}
