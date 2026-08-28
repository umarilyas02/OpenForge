import { createDbClient, schema } from "@openforge/db";
import { describe, expect, it } from "vitest";

import { createDrizzleSessionStore } from "../src/drizzle-session-store.js";
import { createSessionManager } from "../src/session.js";

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

describe.skipIf(!available)("drizzle-backed session store", () => {
  it("issues, verifies, and revokes a real session against Postgres", async () => {
    const { db, close } = createDbClient({ connectionString });

    try {
      const [user] = await db
        .insert(schema.users)
        .values({
          email: `session-test-${Date.now()}@example.test`,
          displayName: "Session Test User",
        })
        .returning();

      const manager = createSessionManager({
        store: createDrizzleSessionStore({ db }),
      });

      const { token } = await manager.issue({ userId: user.id });
      const verified = await manager.verify(token);
      expect(verified.userId).toBe(user.id);

      await manager.revoke(token);
      await expect(manager.verify(token)).rejects.toMatchObject({
        code: "OF_AUTH_SESSION_REVOKED",
      });
    } finally {
      await close();
    }
  });
});
