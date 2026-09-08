import { randomUUID } from "node:crypto";
import { readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";

import { getDb } from "../../../../../../../src/lib/db.js";
import {
  getMemberships,
  requireUser,
} from "../../../../../../../src/lib/session.js";
import { getWorkspaceManager } from "../../../../../../../src/lib/site-workspace.js";

/**
 * Streams a `.tar.gz` of a site's real workspace files (its actual Next.js
 * project — see starter-template.js) back to the browser as a download.
 * Route handlers aren't wrapped by parent layouts in the App Router, so
 * auth is checked explicitly here rather than assumed from folder nesting.
 */
export async function GET(_request, { params }) {
  const { siteId } = await params;
  const user = await requireUser();

  const db = getDb();
  const [site] = await db
    .select()
    .from(schema.sites)
    .where(eq(schema.sites.id, siteId));
  if (!site) {
    return new Response("Not found", { status: 404 });
  }

  const memberships = await getMemberships(user.id);
  try {
    assertSiteAccess({ userId: user.id }, site, memberships);
  } catch {
    return new Response("Not found", { status: 404 });
  }

  const manager = getWorkspaceManager();
  const archivePath = path.join(
    os.tmpdir(),
    `openforge-export-${site.slug}-${randomUUID()}.tar.gz`,
  );

  try {
    await manager.export(site.slug, archivePath);
    const bytes = await readFile(archivePath);
    return new Response(bytes, {
      headers: {
        "content-type": "application/gzip",
        "content-disposition": `attachment; filename="${site.slug}.tar.gz"`,
        "content-length": String(bytes.length),
      },
    });
  } finally {
    await rm(archivePath, { force: true });
  }
}
