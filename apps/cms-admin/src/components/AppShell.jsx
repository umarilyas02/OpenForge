"use client";

import { ChevronDown, LogOut, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import { PageChromeProvider, usePageChrome } from "./PageChromeContext.jsx";

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
 * WordPress-style left sidebar (flat top-level items, with one collapsible
 * "Appearance" section) plus a light topbar carrying "View site" and the
 * signed-in user menu. Presentational only — every layout that renders this
 * decides its own `navGroups` for its context.
 *
 * A `navGroups` entry with a single item renders as a flat top-level link;
 * an entry with multiple items renders as a collapsible section (used for
 * Appearance's Themes / Site Editor / Customize / Menus / Design Tokens).
 *
 * @param {{
 *   user: object,
 *   logout: Function,
 *   navGroups: { key: string, label: string, defaultOpen?: boolean, items: { href: string, label: string, icon: import("react").ReactNode }[] }[],
 *   siteSwitcher?: { current: { id: string, name: string, domain?: string }, sites: { id: string, name: string, href: string }[], manageSitesHref: string },
 *   viewSiteHref?: string,
 *   previewHref?: string,
 *   children: import("react").ReactNode,
 * }} props
 */
export function AppShell(props) {
  return (
    <PageChromeProvider>
      <AppShellBody {...props} />
    </PageChromeProvider>
  );
}

function AppShellBody({
  user,
  logout,
  navGroups,
  siteSwitcher,
  viewSiteHref,
  previewHref,
  children,
}) {
  const { hideTopbar } = usePageChrome();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const userMenuRef = useRef(null);

  const [openGroups, setOpenGroups] = useState(() => new Set());

  useEffect(() => {
    setOpenGroups((current) => {
      const next = new Set(current);
      for (const group of navGroups) {
        if (group.items.length < 2) continue;
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
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!userMenuOpen) return undefined;
    function onClick(event) {
      if (!userMenuRef.current?.contains(event.target)) setUserMenuOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [userMenuOpen]);

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

      <nav aria-label="Primary" className="app-sidebar" data-open={mobileOpen}>
        <div className="app-brand-block">
          <span className="app-brand-word">OpenForge</span>
          <span className="app-brand-tagline">Build without limits</span>
        </div>

        {siteSwitcher ? (
          <div className="site-switcher">
            <button
              aria-expanded={switcherOpen}
              className="site-switcher-trigger"
              onClick={() => setSwitcherOpen((value) => !value)}
              type="button"
            >
              <span className="site-switcher-text">
                <span className="site-switcher-name">
                  {siteSwitcher.current.name}
                </span>
                <span className="site-switcher-domain">
                  {siteSwitcher.current.domain || " "}
                </span>
              </span>
              <ChevronDown className="site-switcher-chevron" size={14} />
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
        ) : null}

        <div className="app-nav">
          {navGroups.map((group) => {
            if (group.items.length < 2) {
              const item = group.items[0];
              if (!item) return null;
              return (
                <Link
                  className="app-nav-link app-nav-link-flat"
                  data-active={isItemActive(pathname, item.href)}
                  href={item.href}
                  key={group.key}
                >
                  {item.icon}
                  <span className="app-nav-label">{item.label}</span>
                </Link>
              );
            }

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
                  <ChevronDown
                    className="app-nav-group-chevron"
                    data-open={isOpen}
                    size={14}
                  />
                </button>
                {isOpen ? (
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
                ) : null}
              </div>
            );
          })}
        </div>

        <div className="app-sidebar-footer">
          <p className="app-sidebar-footer-text">
            A more open web
            <br />
            built to last.
          </p>
        </div>
      </nav>

      <div className="app-main">
        {hideTopbar ? null : (
          <div className="app-topbar">
            <button
              aria-label="Open navigation"
              className="icon-button app-topbar-menu-button"
              onClick={() => setMobileOpen(true)}
              type="button"
            >
              <Menu size={18} strokeWidth={1.75} />
            </button>
            <div className="app-topbar-spacer" />
            <div className="app-topbar-actions">
              {previewHref ? (
                <a
                  className="btn btn-ghost app-preview-site"
                  href={previewHref}
                  rel="noreferrer"
                  target="_blank"
                >
                  Preview ↗
                </a>
              ) : null}
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
              <div className="user-menu" ref={userMenuRef}>
                <button
                  aria-expanded={userMenuOpen}
                  className="user-menu-trigger"
                  onClick={() => setUserMenuOpen((value) => !value)}
                  type="button"
                >
                  <span className="app-user-avatar">{initialsFor(user)}</span>
                  <span className="user-menu-name">
                    {user.displayName || user.email}
                  </span>
                  <ChevronDown size={14} />
                </button>
                {userMenuOpen ? (
                  <div className="user-menu-panel">
                    <div className="user-menu-email">
                      {user.displayName || user.email}
                    </div>
                    <form action={logout}>
                      <button className="user-menu-logout" type="submit">
                        <LogOut size={14} strokeWidth={1.75} />
                        Sign out
                      </button>
                    </form>
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        )}
        <div className="page" data-full-bleed={hideTopbar}>
          {children}
        </div>
      </div>
    </div>
  );
}
