"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  {
    href: "/sites",
    label: "Sites",
    icon: (
      <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
        <path
          d="M2 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4Z"
          stroke="currentColor"
          strokeWidth="1.3"
        />
        <path d="M2 6.5h12" stroke="currentColor" strokeWidth="1.3" />
      </svg>
    ),
  },
];

function initialsFor(user) {
  const source = user.displayName || user.email || "?";
  return source
    .split(/\s+/u)
    .map((part) => part[0])
    .slice(0, 2)
    .join("");
}

/**
 * @param {{ user: object, logout: Function, children: import("react").ReactNode }} props
 */
export function AppShell({ user, logout, children }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

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

      <nav
        aria-label="Primary"
        className="app-sidebar"
        data-collapsed={collapsed}
        data-open={mobileOpen}
      >
        <div className="app-sidebar-header">
          <span className="app-brand">
            <span className="app-brand-mark">OF</span>
            <span className="app-brand-label">OpenForge CMS</span>
          </span>
          <button
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="icon-button"
            onClick={() => setCollapsed((value) => !value)}
            type="button"
          >
            <svg fill="none" height="14" viewBox="0 0 16 16" width="14">
              <path
                d="M2 3h12M2 8h12M2 13h12"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="1.4"
              />
            </svg>
          </button>
        </div>

        <div className="app-nav">
          {NAV_ITEMS.map((item) => (
            <Link
              className="app-nav-link"
              data-active={pathname?.startsWith(item.href)}
              href={item.href}
              key={item.href}
              onClick={() => setMobileOpen(false)}
            >
              {item.icon}
              <span className="app-nav-label">{item.label}</span>
            </Link>
          ))}
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
        <div className="app-topbar">
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
        <div className="page">{children}</div>
      </div>
    </div>
  );
}
