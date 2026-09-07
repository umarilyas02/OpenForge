import path from "node:path";

import { schema } from "@openforge/db";
import { AssetError } from "@openforge/storage";
import { and, eq } from "drizzle-orm";

/**
 * Drizzle-backed asset metadata storage satisfying the `@openforge/storage`
 * asset-manager storage contract (see packages/storage/test/asset-manager.test.js
 * and memory-storage.js for the exact shape each method must return).
 * `putObject`/`getObject` are delegated straight through to `blobStorage`
 * (asset-blob-storage.js) — this module owns only the `assets` and
 * `asset_variants` rows.
 *
 * `createdBy` is captured once at construction time rather than accepted
 * per-call, because `createAssetManager().upload()` (in @openforge/storage)
 * builds its internal asset object without a createdBy field and never
 * forwards one to `storage.putAsset()`. See asset-manager.js's
 * `getAssetManager({ userId })` for how a fresh storage instance (and
 * fresh manager) is built per request so the right user id lands here.
 *
 * @param {{ db: import("drizzle-orm/node-postgres").NodePgDatabase, blobStorage: { putObject: Function, getObject: Function }, createdBy?: string | null }} options
 */
export function createDbAssetStorage({ db, blobStorage, createdBy = null }) {
  return {
    async putObject(key, bytes, metadata) {
      return blobStorage.putObject(key, bytes, metadata);
    },

    async getObject(key) {
      return blobStorage.getObject(key);
    },

    async putAsset(asset) {
      await db.transaction(async (tx) => {
        const [row] = await tx
          .insert(schema.assets)
          .values({
            siteId: asset.projectId,
            externalId: asset.id,
            storageKey: asset.originalKey,
            originalName: asset.originalName,
            mimeType: asset.mimeType,
            sizeBytes: asset.size,
            width: asset.width,
            height: asset.height,
            sha256: asset.sha256,
            altText: asset.altText || null,
            altStatus: asset.altStatus,
            createdBy,
          })
          .returning();

        if (asset.variants.length > 0) {
          await tx.insert(schema.assetVariants).values(
            asset.variants.map((variant) => ({
              assetId: row.id,
              format: mimeTypeToFormat(variant.mimeType),
              width: variant.width,
              height: variant.height,
              storageKey: variant.key,
            })),
          );
        }
      });
    },

    async getAsset(projectId, assetId) {
      const [row] = await db
        .select()
        .from(schema.assets)
        .where(
          and(
            eq(schema.assets.siteId, projectId),
            eq(schema.assets.externalId, assetId),
          ),
        );
      return row ? reassemble(db, row) : null;
    },

    async findAssetByHash(projectId, sha256) {
      const [row] = await db
        .select()
        .from(schema.assets)
        .where(
          and(
            eq(schema.assets.siteId, projectId),
            eq(schema.assets.sha256, sha256),
          ),
        );
      return row ? reassemble(db, row) : null;
    },

    async listAssets(projectId) {
      const rows = await db
        .select()
        .from(schema.assets)
        .where(eq(schema.assets.siteId, projectId));
      return Promise.all(rows.map((row) => reassemble(db, row)));
    },

    async updateAsset(projectId, assetId, patch) {
      const [updated] = await db
        .update(schema.assets)
        .set({
          altText: patch.altText ? patch.altText : null,
          altStatus: patch.altStatus,
        })
        .where(
          and(
            eq(schema.assets.siteId, projectId),
            eq(schema.assets.externalId, assetId),
          ),
        )
        .returning();
      if (!updated) {
        throw new AssetError(
          "OF_ASSET_NOT_FOUND",
          `Unknown asset: "${assetId}".`,
        );
      }
      return reassemble(db, updated);
    },
  };
}

/** The `assets.mime_type` / analyzer output always uses "image/<format>". */
function mimeTypeToFormat(mimeType) {
  return mimeType.split("/")[1] ?? mimeType;
}

/**
 * Rebuild the full asset shape `@openforge/storage` expects from a DB row
 * plus its variant rows. The variant's logical `name` (e.g. "w640") isn't
 * a stored column — it's recovered from the variant's storage key, which
 * asset-manager.js always writes as `.../variants/<name>.webp`.
 */
async function reassemble(db, row) {
  const variantRows = await db
    .select()
    .from(schema.assetVariants)
    .where(eq(schema.assetVariants.assetId, row.id));

  return {
    schemaVersion: 1,
    id: row.externalId,
    projectId: row.siteId,
    originalName: row.originalName,
    mimeType: row.mimeType,
    size: row.sizeBytes,
    sha256: row.sha256,
    width: row.width,
    height: row.height,
    altText: row.altText ?? "",
    altStatus: row.altStatus,
    originalKey: row.storageKey,
    sourcePath: `/openforge-assets/${row.externalId}/${encodeURIComponent(row.originalName)}`,
    variants: variantRows.map((variant) => ({
      name: path.basename(variant.storageKey, path.extname(variant.storageKey)),
      key: variant.storageKey,
      mimeType: `image/${variant.format}`,
      width: variant.width,
      height: variant.height,
    })),
    createdAt: row.createdAt instanceof Date ? row.createdAt.toISOString() : row.createdAt,
  };
}
