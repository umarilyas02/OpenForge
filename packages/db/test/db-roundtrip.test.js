import { eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { createDbClient } from "../src/client.js";
import {
  contentItems,
  organizations,
  sites,
  users,
} from "../src/schema/index.js";

const connectionString =
  process.env.DATABASE_URL ??
  "postgres://openforge:openforge_dev_only@localhost:5432/openforge";

async function probeDatabase() {
  const client = createDbClient({ connectionString });
  try {
    await client.db.execute("select 1");
    return true;
  } catch {
    return false;
  } finally {
    await client.close();
  }
}

const available = await probeDatabase();

describe.skipIf(!available)("db round trip", () => {
  it("creates an organization, a site, and a page, then reads them back", async () => {
    const { db, close } = createDbClient({ connectionString });

    try {
      const [user] = await db
        .insert(users)
        .values({
          email: `test-${Date.now()}@example.test`,
          displayName: "Test User",
        })
        .returning();

      const [organization] = await db
        .insert(organizations)
        .values({
          name: "Demo Org",
          slug: `demo-org-${Date.now()}`,
          createdBy: user.id,
        })
        .returning();

      const [site] = await db
        .insert(sites)
        .values({
          organizationId: organization.id,
          name: "Demo Site",
          slug: `demo-site-${Date.now()}`,
          createdBy: user.id,
        })
        .returning();

      const [page] = await db
        .insert(contentItems)
        .values({
          siteId: site.id,
          type: "page",
          slug: "home",
          title: "Home",
          blockTree: [
            { blockId: "openforge.hero", props: { heading: "Hello" } },
          ],
          authorId: user.id,
        })
        .returning();

      const [readBack] = await db
        .select()
        .from(contentItems)
        .where(eq(contentItems.id, page.id));

      expect(readBack.title).toBe("Home");
      expect(readBack.blockTree).toEqual([
        { blockId: "openforge.hero", props: { heading: "Hello" } },
      ]);
    } finally {
      await close();
    }
  });
});
