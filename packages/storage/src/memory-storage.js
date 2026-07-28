import { AssetError } from "./asset-policy.js";

export function createMemoryAssetStorage() {
  const assets = new Map();
  const objects = new Map();

  return {
    async putObject(key, bytes, metadata = {}) {
      objects.set(key, {
        bytes: Buffer.from(bytes),
        metadata: structuredClone(metadata),
      });
    },

    async getObject(key) {
      const object = objects.get(key);
      return object
        ? {
            bytes: Buffer.from(object.bytes),
            metadata: structuredClone(object.metadata),
          }
        : null;
    },

    async putAsset(asset) {
      assets.set(assetKey(asset.projectId, asset.id), structuredClone(asset));
    },

    async getAsset(projectId, assetId) {
      const asset = assets.get(assetKey(projectId, assetId));
      return asset ? structuredClone(asset) : null;
    },

    async findAssetByHash(projectId, hash) {
      const asset = [...assets.values()].find(
        (candidate) =>
          candidate.projectId === projectId && candidate.sha256 === hash,
      );
      return asset ? structuredClone(asset) : null;
    },

    async listAssets(projectId) {
      return [...assets.values()]
        .filter((asset) => asset.projectId === projectId)
        .sort((left, right) => left.id.localeCompare(right.id))
        .map((asset) => structuredClone(asset));
    },

    async updateAsset(projectId, assetId, patch) {
      const key = assetKey(projectId, assetId);
      const asset = assets.get(key);
      if (!asset) {
        throw new AssetError(
          "OF_ASSET_NOT_FOUND",
          `Unknown asset: "${assetId}".`,
        );
      }
      const updated = { ...asset, ...structuredClone(patch) };
      assets.set(key, updated);
      return structuredClone(updated);
    },
  };
}

function assetKey(projectId, assetId) {
  return `${projectId}:${assetId}`;
}
