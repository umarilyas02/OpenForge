import { mkdir } from "node:fs/promises";

import { sql } from "drizzle-orm";

import { getDb } from "../../src/lib/db.js";
import { getWorkspaceManager } from "../../src/lib/site-workspace.js";

/**
 * A deliberately top-level route (outside the `(admin)` route group) so it
 * carries no session/auth gate -- an orchestrator's liveness/readiness
 * probe has no cookie to send. Checks the two things this app cannot run
 * without: a real Postgres connection, and write access to
 * SITES_STORAGE_PATH (every site's real files live there, so a bad mount
 * fails every save, not just health checks).
 */
export async function GET() {
  const checks = { database: await checkDatabase(), sitesStorage: await checkSitesStorage() };
  const ok = Object.values(checks).every((check) => check.ok);

  return Response.json(
    { status: ok ? "ok" : "unhealthy", checks },
    { status: ok ? 200 : 503 },
  );
}

async function checkDatabase() {
  try {
    await getDb().execute(sql`select 1`);
    return { ok: true };
  } catch (error) {
    return { ok: false, error: String(error.message || error) };
  }
}

async function checkSitesStorage() {
  try {
    const { basePath } = getWorkspaceManager();
    await mkdir(basePath, { recursive: true });
    return { ok: true, path: basePath };
  } catch (error) {
    return { ok: false, error: String(error.message || error) };
  }
}
