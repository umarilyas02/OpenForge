"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

function initialsFor(user) {
  const source = user.displayName || user.email || "?";
  return source
    .split(/\s+/u)
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

function isItemActive(pathname, href) {
  if (!pathname) return false;
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * WordPress-style grouped left sidebar: collapsible sections (each with a
 * one-line description), pill-shaped active state, and an optional site
 * switcher in the header. Presentational only — every layout that renders
 * this decides its own `navGroups` for its context (the site list has a
 * minimal one; a site's own pages have the full Content/Design/Site set).
 *
 * @param {{
 *   user: object,
 *   logout: Function,
 *   navGroups: { key: string, label: string, description?: string, defaultOpen?: boolean, items: { href: string, label: string, icon: import("react").ReactNode }[] }[],
 *   siteSwitcher?: { current: { id: string, name: string }, sites: { id: string, name: string, href: string }[], manageSitesHref: string },
 *   viewSiteHref?: string,
 *   children: import("react").ReactNode,
 * }} props
 */
export function AppShell({
  user,
  logout,
  navGroups,
  siteSwitcher,
  viewSiteHref,
  children,
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const pathname = usePathname();

  const [openGroups, setOpenGroups] = useState(() => new Set());

  useEffect(() => {
    setOpenGroups((current) => {
      const next = new Set(current);
      for (const group of navGroups) {
        if (group.defaultOpen) next.add(group.key);
        if (group.items.some((item) => isItemActive(pathname, item.href))) {
          next.add(group.key);
        }
      }
      return next;
    });
  }, [navGroups, pathname]);

  useEffect(() => {
    setMobileOpen(false);
    setSwitcherOpen(false);
  }, [pathname]);

  function toggleGroup(key) {
    setOpenGroups((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  const otherSites = useMemo(
    () =>
      siteSwitcher
        ? siteSwitcher.sites.filter(
            (site) => site.id !== siteSwitcher.current.id,
          )
        : [],
    [siteSwitcher],
  );

  return (
    <div className="app-shell">
      {mobileOpen ? (
        <button
          aria-label="Close navigation"
          className="app-sidebar-backdrop"
          onClick={() => setMobileOpen(false)}
          type="button"
        />
      ) : null}

      <div className="app-topbar-mobile">
        <button
          aria-label="Open navigation"
          className="icon-button"
          onClick={() => setMobileOpen(true)}
          type="button"
        >
          <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
            <path
              d="M2 4h12M2 8h12M2 12h12"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.4"
            />
          </svg>
        </button>
        <span className="app-brand-mark">OF</span>
      </div>

      <nav aria-label="Primary" className="app-sidebar" data-open={mobileOpen}>
        <div className="app-sidebar-header">
          {siteSwitcher ? (
            <div className="site-switcher">
              <button
                aria-expanded={switcherOpen}
                className="site-switcher-trigger"
                onClick={() => setSwitcherOpen((value) => !value)}
                type="button"
              >
                <span className="app-brand-mark">OF</span>
                <span className="site-switcher-name">
                  {siteSwitcher.current.name}
                </span>
                <svg
                  className="site-switcher-chevron"
                  fill="none"
                  height="12"
                  viewBox="0 0 16 16"
                  width="12"
                >
                  <path
                    d="M4 6l4 4 4-4"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                  />
                </svg>
              </button>
              {switcherOpen ? (
                <div className="site-switcher-menu">
                  {otherSites.map((site) => (
                    <Link
                      className="site-switcher-item"
                      href={site.href}
                      key={site.id}
                    >
                      {site.name}
                    </Link>
                  ))}
                  <Link
                    className="site-switcher-item site-switcher-manage"
                    href={siteSwitcher.manageSitesHref}
                  >
                    Manage sites
                  </Link>
                </div>
              ) : null}
            </div>
          ) : (
            <span className="app-brand">
              <span className="app-brand-mark">OF</span>
              <span className="app-brand-label">OpenForge CMS</span>
            </span>
          )}
          {viewSiteHref ? (
            <a
              className="btn btn-ghost app-view-site"
              href={viewSiteHref}
              rel="noreferrer"
              target="_blank"
            >
              View site ↗
            </a>
          ) : null}
        </div>

        <div className="app-nav">
          {navGroups.map((group) => {
            const isOpen = openGroups.has(group.key);
            const groupHasActive = group.items.some((item) =>
              isItemActive(pathname, item.href),
            );

            return (
              <div className="app-nav-group" key={group.key}>
                <button
                  aria-expanded={isOpen}
                  className="app-nav-group-header"
                  data-active={groupHasActive}
                  onClick={() => toggleGroup(group.key)}
                  type="button"
                >
                  <span className="app-nav-group-label">{group.label}</span>
                  <svg
                    className="app-nav-group-chevron"
                    data-open={isOpen}
                    fill="none"
                    height="12"
                    viewBox="0 0 16 16"
                    width="12"
                  >
                    <path
                      d="M4 6l4 4 4-4"
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </svg>
                </button>
                {isOpen ? (
                  <>
                    {group.description ? (
                      <p className="app-nav-group-desc">{group.description}</p>
                    ) : null}
                    <ul className="app-nav-list">
                      {group.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            className="app-nav-link"
                            data-active={isItemActive(pathname, item.href)}
                            href={item.href}
                          >
                            {item.icon}
                            <span className="app-nav-label">{item.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="app-sidebar-footer">
          <div className="app-user-row">
            <span className="app-user-avatar">{initialsFor(user)}</span>
            <div className="app-user-info">
              <span className="app-user-email">
                {user.displayName || user.email}
              </span>
            </div>
          </div>
          <form action={logout}>
            <button className="app-nav-logout" type="submit">
              <svg fill="none" height="14" viewBox="0 0 16 16" width="14">
                <path
                  d="M6 2H4a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2M10.5 11l3-3-3-3M13 8H6"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.3"
                />
              </svg>
              <span className="app-nav-label">Sign out</span>
            </button>
          </form>
        </div>
      </nav>

      <div className="app-main">
        <div className="page">{children}</div>
      </div>
    </div>
  );
}
