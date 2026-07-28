import { createHash } from "node:crypto";

import {
  AssetError,
  DEFAULT_ASSET_POLICY,
  normalizeAltText,
  validateAssetUpload,
} from "./asset-policy.js";

export function createAssetManager({
  storage,
  analyze,
  signer,
  policy = DEFAULT_ASSET_POLICY,
  clock = () => new Date(),
}) {
  for (const method of [
    "putObject",
    "putAsset",
    "getAsset",
    "findAssetByHash",
    "listAssets",
    "updateAsset",
  ]) {
    if (typeof storage?.[method] !== "function") {
      throw new TypeError(`Asset storage must implement ${method}().`);
    }
  }
  if (typeof analyze !== "function" || typeof signer?.sign !== "function") {
    throw new TypeError("Asset analyzer and URL signer are required.");
  }

  return Object.freeze({
    async upload({ projectId, originalName, mimeType, bytes, altText = "" }) {
      validateProjectId(projectId);
      const upload = validateAssetUpload(
        { originalName, mimeType, bytes },
        policy,
      );
      const normalizedAlt = normalizeAltText(altText);
      const sha256 = createHash("sha256").update(bytes).digest("hex");
      const duplicate = await storage.findAssetByHash(projectId, sha256);
      if (duplicate) return { asset: duplicate, duplicate: true };

      const analysis = await analyze({
        bytes: Buffer.from(bytes),
        mimeType,
        maxPixels: policy.maxPixels,
        variantWidths: [...policy.variantWidths],
      });
      validateAnalysis(analysis, policy);

      const id = `asset_${sha256.slice(0, 16)}`;
      const originalKey = `projects/${projectId}/assets/${id}/original/${originalName}`;
      await storage.putObject(originalKey, bytes, {
        mimeType,
        sha256,
      });

      const variants = [];
      for (const variant of analysis.variants) {
        const key = `projects/${projectId}/assets/${id}/variants/${variant.name}.webp`;
        await storage.putObject(key, variant.bytes, {
          mimeType: variant.mimeType,
          width: variant.width,
          height: variant.height,
        });
        variants.push({
          name: variant.name,
          key,
          mimeType: variant.mimeType,
          width: variant.width,
          height: variant.height,
          size: variant.bytes.length,
        });
      }

      const asset = {
        schemaVersion: 1,
        id,
        projectId,
        originalName: upload.originalName,
        mimeType,
        size: upload.size,
        sha256,
        width: analysis.width,
        height: analysis.height,
        altText: normalizedAlt,
        altStatus: normalizedAlt ? "provided" : "missing",
        originalKey,
        sourcePath: `/openforge-assets/${id}/${encodeURIComponent(originalName)}`,
        variants,
        createdAt: clock().toISOString(),
      };
      await storage.putAsset(asset);
      return { asset: structuredClone(asset), duplicate: false };
    },

    async updateAltText({ projectId, assetId, altText }) {
      validateProjectId(projectId);
      const value = normalizeAltText(altText);
      return storage.updateAsset(projectId, assetId, {
        altText: value,
        altStatus: value ? "provided" : "missing",
      });
    },

    async getSignedAccess({ projectId, assetId, variant, ttlSeconds }) {
      validateProjectId(projectId);
      const asset = await requireAsset(storage, projectId, assetId);
      const key = variant
        ? asset.variants.find((candidate) => candidate.name === variant)?.key
        : asset.originalKey;
      if (!key) {
        throw new AssetError(
          "OF_ASSET_VARIANT_NOT_FOUND",
          `Unknown asset variant: "${variant}".`,
        );
      }
      return signer.sign({ key, ttlSeconds });
    },

    async getUsageReport({ projectId, files }) {
      validateProjectId(projectId);
      const assets = await storage.listAssets(projectId);
      const usage = assets.map((asset) => {
        const references = collectAssetReferences(asset, files);
        return {
          assetId: asset.id,
          sourcePath: asset.sourcePath,
          references,
          used: references.length > 0,
        };
      });
      return {
        assets: usage,
        unused: usage.filter(({ used }) => !used).map(({ assetId }) => assetId),
      };
    },
  });
}

function collectAssetReferences(asset, files) {
  const references = [];
  for (const file of [...files].sort((left, right) =>
    left.path.localeCompare(right.path),
  )) {
    let offset = file.source.indexOf(asset.sourcePath);
    while (offset !== -1) {
      const before = file.source.slice(0, offset);
      const lines = before.split("\n");
      references.push({
        filePath: file.path,
        line: lines.length,
        column: lines.at(-1).length,
      });
      offset = file.source.indexOf(
        asset.sourcePath,
        offset + asset.sourcePath.length,
      );
    }
  }
  return references;
}

function validateAnalysis(analysis, policy) {
  if (
    !analysis ||
    !Number.isInteger(analysis.width) ||
    !Number.isInteger(analysis.height) ||
    analysis.width <= 0 ||
    analysis.height <= 0 ||
    analysis.width * analysis.height > policy.maxPixels ||
    !Array.isArray(analysis.variants) ||
    analysis.variants.some(
      (variant) =>
        !variant?.name ||
        variant.mimeType !== "image/webp" ||
        !Number.isInteger(variant.width) ||
        !Number.isInteger(variant.height) ||
        variant.width <= 0 ||
        variant.height <= 0 ||
        !Buffer.isBuffer(variant.bytes) ||
        variant.bytes.length === 0,
    )
  ) {
    throw new AssetError(
      "OF_ASSET_ANALYSIS_INVALID",
      "Asset analyzer returned invalid or out-of-policy metadata.",
    );
  }
}

async function requireAsset(storage, projectId, assetId) {
  const asset = await storage.getAsset(projectId, assetId);
  if (!asset) {
    throw new AssetError("OF_ASSET_NOT_FOUND", `Unknown asset: "${assetId}".`);
  }
  return asset;
}

function validateProjectId(projectId) {
  if (
    typeof projectId !== "string" ||
    !/^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/u.test(projectId)
  ) {
    throw new AssetError(
      "OF_ASSET_PROJECT_INVALID",
      "Asset project id is invalid.",
    );
  }
}
