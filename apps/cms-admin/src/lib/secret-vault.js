import { createSecretVault } from "@openforge/integration-security";

import { getDb } from "./db.js";
import { createDbSecretStorage } from "./secret-db-storage.js";

const ACTIVE_KEY_ID = "primary";

let cachedVault;

/**
 * Lazily create the process-wide secret vault, same caching approach as
 * getWorkspaceManager()/getAssetBlobStorage(). Throws a specific, actionable
 * error the first time a feature that needs it (currently: GitHub connect)
 * actually runs without ENCRYPTION_MASTER_KEY configured, rather than
 * failing every unrelated page — see the ENCRYPTION_MASTER_KEY comment in
 * @openforge/config's cmsAdminEnvSchema.
 */
export function getSecretVault() {
  if (!cachedVault) {
    const raw = process.env.ENCRYPTION_MASTER_KEY;
    if (!raw) {
      throw new Error(
        "ENCRYPTION_MASTER_KEY is not set. Generate one with `openssl rand -base64 32` and add it to your cms-admin environment to use this feature.",
      );
    }
    const key = Buffer.from(raw, "base64");
    if (key.length !== 32) {
      throw new Error(
        "ENCRYPTION_MASTER_KEY must decode to exactly 32 bytes (a base64-encoded value from `openssl rand -base64 32`).",
      );
    }
    cachedVault = createSecretVault({
      keys: { [ACTIVE_KEY_ID]: key },
      activeKeyId: ACTIVE_KEY_ID,
      storage: createDbSecretStorage({ db: getDb() }),
    });
  }
  return cachedVault;
}
