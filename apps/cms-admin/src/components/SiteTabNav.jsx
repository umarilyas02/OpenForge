"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { path: "", label: "Overview" },
  { path: "/appearance", label: "Appearance" },
  { path: "/menus", label: "Menus" },
  { path: "/settings", label: "Settings" },
];

/**
 * @param {{ siteId: string }} props
 */
export function SiteTabNav({ siteId }) {
  const pathname = usePathname();
  const base = `/sites/${siteId}`;

  return (
    <nav className="tab-nav">
      {TABS.map((tab) => {
        const href = `${base}${tab.path}`;
        const active =
          tab.path === "" ? pathname === base : pathname.startsWith(href);

        return (
          <Link
            className="tab-link"
            data-active={active}
            href={href}
            key={tab.path}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
