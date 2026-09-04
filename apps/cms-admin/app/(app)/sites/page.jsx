import { schema } from "@openforge/db";
import { Button } from "@primer/react";
import { eq } from "drizzle-orm";
import Link from "next/link";

import { AppShell } from "../../../src/components/AppShell.jsx";
import { getDb } from "../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../src/lib/session.js";
import { logout } from "../actions.js";

const NAV_GROUPS = [
  {
    key: "sites",
    label: "Sites",
    description: "Every site you run through this install.",
    defaultOpen: true,
    items: [
      {
        href: "/sites",
        label: "All sites",
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
      {
        href: "/sites/new",
        label: "New site",
        icon: (
          <svg fill="none" height="16" viewBox="0 0 16 16" width="16">
            <path
              d="M8 3v10M3 8h10"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="1.4"
            />
          </svg>
        ),
      },
    ],
  },
];

export default async function SitesPage() {
  const user = await requireUser();
  const memberships = await getMemberships(user.id);
  const membership = memberships.find((entry) => entry.status === "active");

  if (!membership) {
    return (
      <AppShell logout={logout} navGroups={NAV_GROUPS} user={user}>
        <div className="stack">
          <div className="page-header">
            <div>
              <h1 className="page-title">Sites</h1>
            </div>
          </div>
          <div className="empty-state">
            <span className="empty-state-icon" aria-hidden="true">
              <svg fill="none" height="20" viewBox="0 0 16 16" width="20">
                <circle
                  cx="8"
                  cy="8"
                  r="6"
                  stroke="currentColor"
                  strokeWidth="1.3"
                />
                <path
                  d="M8 5v3l2 2"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="1.3"
                />
              </svg>
            </span>
            <p className="empty-state-title">Account setup incomplete</p>
            <p className="empty-state-body">
              Your account isn&apos;t fully set up yet. Run{" "}
              <code>node tooling/scripts/create-user.js</code> to finish setup,
              then reload this page.
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  const db = getDb();
  const sites = await db
    .select()
    .from(schema.sites)
    .where(eq(schema.sites.organizationId, membership.organizationId));

  return (
    <AppShell logout={logout} navGroups={NAV_GROUPS} user={user}>
      <div className="stack">
        <div className="page-header">
          <div>
            <h1 className="page-title">Sites</h1>
            <p className="page-subtitle">
              {sites.length} {sites.length === 1 ? "site" : "sites"}
            </p>
          </div>
          <Link href="/sites/new">
            <Button variant="primary">New site</Button>
          </Link>
        </div>

        {sites.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state-icon" aria-hidden="true">
              <svg fill="none" height="20" viewBox="0 0 16 16" width="20">
                <rect
                  height="10"
                  rx="1.5"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  width="12"
                  x="2"
                  y="3"
                />
                <path d="M2 6.5h12" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </span>
            <p className="empty-state-title">Create your first site</p>
            <p className="empty-state-body">
              A site gets a theme, its own pages and posts, and a domain or
              subdomain visitors can reach it at.
            </p>
            <Link href="/sites/new">
              <Button variant="primary">New site</Button>
            </Link>
          </div>
        ) : (
          <div className="card">
            {sites.map((site) => (
              <Link
                className="list-row"
                href={`/sites/${site.id}`}
                key={site.id}
              >
                <div>
                  <div className="list-row-title">{site.name}</div>
                  <div className="list-row-meta">/{site.slug}</div>
                </div>
                <span
                  className={
                    site.status === "published"
                      ? "badge badge-published"
                      : "badge badge-draft"
                  }
                >
                  {site.status}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
