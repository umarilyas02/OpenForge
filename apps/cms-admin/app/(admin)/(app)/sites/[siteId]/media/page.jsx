import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { EmptyIllustration } from "../../../../../../src/components/EmptyIllustration.jsx";
import { UploadAssetForm } from "../../../../../../src/components/UploadAssetForm.jsx";
import { getAssetManager } from "../../../../../../src/lib/asset-manager.js";
import { getDb } from "../../../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../../../src/lib/session.js";
import { uploadAsset } from "./actions.js";

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

  const assetManager = getAssetManager();
  const withThumbnails = await Promise.all(
    sorted.map(async (asset) => {
      if (!asset.externalId) return { ...asset, thumbnailSrc: null };
      try {
        const signed = await assetManager.getSignedAccess({
          projectId: site.id,
          assetId: asset.externalId,
          variant: "w640",
          ttlSeconds: 300,
        });
        const signedUrl = new URL(signed.url);
        return {
          ...asset,
          thumbnailSrc: `${signedUrl.pathname}${signedUrl.search}`,
        };
      } catch {
        // Older or malformed rows may not have a matching variant yet —
        // fall back to no thumbnail instead of failing the whole page.
        return { ...asset, thumbnailSrc: null };
      }
    }),
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
      </div>

      {withThumbnails.length === 0 ? (
        <div className="empty-state">
          <EmptyIllustration variant="media" />
          <p className="empty-state-title">No media yet</p>
          <p className="empty-state-body">
            Files uploaded from the block editor will appear here.
          </p>
        </div>
      ) : (
        <div className="card">
          {withThumbnails.map((asset) => (
            <div className="list-row" key={asset.id}>
              <div style={{ alignItems: "center", display: "flex", gap: "var(--space-3)" }}>
                {asset.thumbnailSrc ? (
                  <img
                    alt={asset.altText || asset.originalName}
                    src={asset.thumbnailSrc}
                    style={{
                      borderRadius: "var(--radius-sm)",
                      height: 48,
                      objectFit: "cover",
                      width: 48,
                    }}
                  />
                ) : null}
                <div>
                  <div className="list-row-title">{asset.originalName}</div>
                  <div className="list-row-meta">
                    {asset.mimeType} · {formatBytes(asset.sizeBytes)}
                    {asset.width && asset.height
                      ? ` · ${asset.width}×${asset.height}`
                      : ""}
                  </div>
                </div>
              </div>
              <span className="muted" style={{ fontSize: "var(--text-xs)" }}>
                {asset.altStatus === "missing" ? "No alt text" : "Alt text set"}
              </span>
            </div>
          ))}
        </div>
      )}

      <UploadAssetForm addAsset={uploadAsset} siteId={site.id} />
    </div>
  );
}
