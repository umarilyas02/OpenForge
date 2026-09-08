import { cmsRendererEnvSchema, loadEnv } from "@openforge/config";
import { createDbClient } from "@openforge/db";

let cachedClient;

/**
 * Lazily create a single shared Drizzle client for the process, validating
 * the renderer's environment on first use.
 */
export function getDb() {
  if (!cachedClient) {
    const env = loadEnv({ schema: cmsRendererEnvSchema });
    cachedClient = createDbClient({ connectionString: env.DATABASE_URL });
  }
  return cachedClient.db;
}
