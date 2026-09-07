import fs from "node:fs/promises";
import path from "node:path";

import { cmsAdminEnvSchema, loadEnv } from "@openforge/config";

let cachedStorage;

/**
 * Resolve the local filesystem root for asset bytes as a sibling directory
 * of SITES_STORAGE_PATH (the same env var `getWorkspaceManager()` reads in
 * site-workspace.js) — e.g. `data/sites` -> `data/assets`. Kept as a
 * sibling rather than nested under the sites root so a site's own project
 * files (which get committed/deployed as real Next.js source) never mix
 * with binary asset blobs.
 */
function resolveRoot() {
  const env = loadEnv({ schema: cmsAdminEnvSchema });
  const sitesRoot = path.resolve(
    /* turbopackIgnore: true */ env.SITES_STORAGE_PATH ?? path.resolve("data/sites"),
  );
  const base = path.basename(sitesRoot);
  const assetsDirName = base === "sites" ? "assets" : `${base}-assets`;
  return path.join(path.dirname(sitesRoot), assetsDirName);
}

/**
 * Resolve an object key onto a path inside `root`, rejecting anything that
 * would escape it. Keys reaching this module are already validated
 * upstream (the signer's `validateObjectKey` and asset-manager's own key
 * construction), but this is cheap defense in depth against a future
 * caller that isn't as careful.
 */
function resolveObjectPath(root, key) {
  if (typeof key !== "string" || key.length === 0) {
    throw new Error("Asset object key must be a non-empty string.");
  }
  const segments = key.split("/");
  if (
    segments.some(
      (segment) => segment === "" || segment === "." || segment === "..",
    )
  ) {
    throw new Error(`Asset object key is unsafe: "${key}".`);
  }
  const resolved = path.resolve(root, ...segments);
  const relative = path.relative(root, resolved);
  if (relative.startsWith("..") || path.isAbsolute(relative)) {
    throw new Error(`Asset object key escapes the storage root: "${key}".`);
  }
  return resolved;
}

function metaPath(objectPath) {
  return `${objectPath}.meta.json`;
}

/**
 * Lazily create a single shared local-filesystem object storage adapter for
 * the process, caching it the same way `getWorkspaceManager()` caches its
 * WorkspaceManager. Bytes are written to disk with a small JSON metadata
 * sidecar file next to them (`<key>.meta.json`) so `getObject` can return
 * both together, matching the `{ bytes, metadata }` shape
 * `createMemoryAssetStorage()` uses in-memory.
 *
 * This is dev/local-disk object storage, not meant for a multi-instance
 * production deployment — swapping in a real object store later only
 * requires a module implementing the same `putObject`/`getObject` contract.
 */
export function getAssetBlobStorage() {
  if (!cachedStorage) {
    const root = resolveRoot();
    cachedStorage = {
      async putObject(key, bytes, metadata = {}) {
        const objectPath = resolveObjectPath(root, key);
        await fs.mkdir(path.dirname(objectPath), { recursive: true });
        await fs.writeFile(objectPath, bytes);
        await fs.writeFile(metaPath(objectPath), JSON.stringify(metadata));
      },

      async getObject(key) {
        const objectPath = resolveObjectPath(root, key);
        try {
          const [bytes, metaRaw] = await Promise.all([
            fs.readFile(objectPath),
            fs.readFile(metaPath(objectPath), "utf8"),
          ]);
          return { bytes, metadata: JSON.parse(metaRaw) };
        } catch (error) {
          if (error.code === "ENOENT") return null;
          throw error;
        }
      },
    };
  }
  return cachedStorage;
}
