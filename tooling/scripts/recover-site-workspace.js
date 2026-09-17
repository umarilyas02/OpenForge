import path from "node:path";

import { createDbClient, schema } from "@openforge/db";
import { WorkspaceManager } from "@openforge/workspace";
import { eq } from "drizzle-orm";

const connectionString =
  process.env.DATABASE_URL ??
  "postgres://openforge:openforge_dev_only@localhost:5432/openforge";
const basePath = process.env.SITES_STORAGE_PATH ?? path.resolve("data/sites");

function readArg(flag) {
  const prefix = `--${flag}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

const slugArg = readArg("slug");
const siteIdArg = readArg("site-id");

if (!slugArg && !siteIdArg) {
  process.stderr.write(
    "Usage: node tooling/scripts/recover-site-workspace.js --slug=my-site\n" +
      "   or: node tooling/scripts/recover-site-workspace.js --site-id=<uuid>\n",
  );
  process.exitCode = 1;
  process.exit();
}

/**
 * The operational entry point WorkspaceManager.recover() never had: it's a
 * real, tested method (packages/workspace/test/workspace-manager.test.js)
 * for reconciling a site's workspace after an interrupted save (a crashed
 * process mid-write leaving temp files or a stale revision behind), but
 * nothing in apps/cms-admin's actual UI or Server Actions ever calls it --
 * only cleanup() (full deletion, used by theme activation) is wired up.
 * Until this app gets a real admin-facing "repair this site" action, this
 * script is the only way to actually run it. See
 * docs/cms-operational-runbooks.md's "A site won't load / save keeps
 * failing" runbook for when to reach for this.
 */
async function main() {
  let slug = slugArg;

  if (!slug) {
    const { db, close } = createDbClient({ connectionString });
    try {
      const [site] = await db
        .select()
        .from(schema.sites)
        .where(eq(schema.sites.id, siteIdArg));
      if (!site) {
        process.stderr.write(`No site found with id ${siteIdArg}.\n`);
        process.exitCode = 1;
        return;
      }
      slug = site.slug;
    } finally {
      await close();
    }
  }

  const manager = new WorkspaceManager({ basePath });
  const result = await manager.recover(slug);
  process.stdout.write(
    `Recovered workspace "${slug}": removed ${result.removedTemporaryFiles} stale temp file(s), ` +
      `reconciled to revision ${result.state.revision}, status "${result.state.status}".\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
