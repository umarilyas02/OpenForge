import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { getDb } from "../../../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../../../src/lib/session.js";

function formatBytes(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function MediaLibraryPage({ params }) {
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

  const assets = await db
    .select()
    .from(schema.assets)
    .where(eq(schema.assets.siteId, site.id));

  const sorted = [...assets].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
  );

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Media</p>
          <h1 className="page-title">Library</h1>
          <p className="page-subtitle">
            Images and files uploaded to this site.
          </p>
        </div>
        <button className="btn btn-ghost" disabled type="button">
          Add new (coming soon)
        </button>
      </div>

      {sorted.length === 0 ? (
        <div className="empty-state">
          <span className="empty-state-icon" aria-hidden="true">
            <svg fill="none" height="20" viewBox="0 0 16 16" width="20">
              <rect height="11" rx="1.5" stroke="currentColor" strokeWidth="1.3" width="12" x="2" y="2.5" />
              <circle cx="5.5" cy="6" r="1.2" stroke="currentColor" strokeWidth="1.2" />
              <path d="M3 11.5l3.2-3.2a1 1 0 0 1 1.4 0L11 11.5M9 9.5l1-1a1 1 0 0 1 1.4 0L13 10.5" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.3" />
            </svg>
          </span>
          <p className="empty-state-title">No media yet</p>
          <p className="empty-state-body">
            Files uploaded from the block editor will appear here.
          </p>
        </div>
      ) : (
        <div className="card">
          {sorted.map((asset) => (
            <div className="list-row" key={asset.id}>
              <div>
                <div className="list-row-title">{asset.originalName}</div>
                <div className="list-row-meta">
                  {asset.mimeType} · {formatBytes(asset.sizeBytes)}
                  {asset.width && asset.height
                    ? ` · ${asset.width}×${asset.height}`
                    : ""}
                </div>
              </div>
              <span className="muted" style={{ fontSize: "var(--text-xs)" }}>
                {asset.altStatus === "missing" ? "No alt text" : "Alt text set"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
