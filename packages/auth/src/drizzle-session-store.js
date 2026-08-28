import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";

/**
 * Drizzle-backed session store implementing the same interface as
 * `createMemorySessionStore`, against the real `sessions` table.
 *
 * @param {{ db: import("drizzle-orm/node-postgres").NodePgDatabase }} options
 */
export function createDrizzleSessionStore({ db }) {
  return {
    async create({ userId, tokenHash, deviceMetadata, expiresAt }) {
      const [record] = await db
        .insert(schema.sessions)
        .values({ userId, tokenHash, deviceMetadata, expiresAt })
        .returning();
      return record;
    },
    async findByTokenHash(tokenHash) {
      const [record] = await db
        .select()
        .from(schema.sessions)
        .where(eq(schema.sessions.tokenHash, tokenHash));
      return record ?? null;
    },
    async revoke(tokenHash, revokedAt) {
      await db
        .update(schema.sessions)
        .set({ revokedAt })
        .where(eq(schema.sessions.tokenHash, tokenHash));
    },
  };
}
