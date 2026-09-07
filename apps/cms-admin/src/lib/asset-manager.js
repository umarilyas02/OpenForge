import { randomBytes } from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  createAssetManager,
  createAssetUrlSigner,
  createPythonAssetAnalyzer,
} from "@openforge/storage";

import { getAssetBlobStorage } from "./asset-blob-storage.js";
import { createDbAssetStorage } from "./asset-db-storage.js";
import { getDb } from "./db.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ANALYZE_SCRIPT_PATH = path.resolve(
  __dirname,
  "../../../../services/python-analysis/app/processors/analyze_image.py",
);

// Generated once per process start, not from persisted config. Signed asset
// URLs are only ever handed out with a short TTL and re-derived fresh on
// every page render, so a restart just invalidates in-flight links (the
// next render re-signs them) — this keeps the signer free of secret
// management for what is otherwise an internal, same-process HMAC. This is
// an intentional MVP tradeoff, not a bug.
const SIGNING_SECRET = randomBytes(32);

// The signed URL's path is what apps/assets/[...key]/route.js matches
// against (a catch-all mounted at /assets/...), so the base URL carries an
// "/assets/" prefix purely so the resulting pathname lines up with that
// route. The origin itself is never dialed — callers only ever use the
// signed URL's path + query (see getSignedAccess usage in media/page.jsx).
const SIGNER_BASE_URL = "http://asset-signing.internal/assets/";

let cachedSigner;
function getSigner() {
  if (!cachedSigner) {
    cachedSigner = createAssetUrlSigner({
      secret: SIGNING_SECRET,
      baseUrl: SIGNER_BASE_URL,
    });
  }
  return cachedSigner;
}

let cachedAnalyzer;
function getAnalyzer() {
  if (!cachedAnalyzer) {
    cachedAnalyzer = createPythonAssetAnalyzer({
      command: "python",
      scriptPath: ANALYZE_SCRIPT_PATH,
    });
  }
  return cachedAnalyzer;
}

/** Used by apps/assets/[...key]/route.js to verify signed request URLs. */
export function getAssetSigner() {
  return getSigner();
}

/**
 * Build an asset manager for the current request. This is intentionally
 * NOT a true cached singleton like `getDb()`/`getWorkspaceManager()`: the
 * DB storage adapter needs the current user's id to stamp `assets.created_by`
 * on upload, and `@openforge/storage`'s `createAssetManager().upload()` has
 * no way to accept or forward a per-call createdBy field. Rebuilding this
 * (cheap object wiring, no new connections — `getDb()`, `getAssetBlobStorage()`,
 * the signer, and the analyzer are all already cached below it) per request
 * is simpler and safer than threading a mutable "current user" callback
 * through a cached instance, at a negligible cost for this low-traffic
 * admin tool.
 *
 * @param {{ userId?: string | null }} [options]
 */
export function getAssetManager({ userId = null } = {}) {
  const storage = createDbAssetStorage({
    db: getDb(),
    blobStorage: getAssetBlobStorage(),
    createdBy: userId,
  });
  return createAssetManager({
    storage,
    analyze: getAnalyzer(),
    signer: getSigner(),
  });
}
