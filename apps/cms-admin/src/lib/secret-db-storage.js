import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";

/**
 * Drizzle-backed storage for @openforge/integration-security's secret
 * vault (see secret-vault.js in this directory). Column names mirror the
 * vault's own record shape exactly (see packages/db/src/schema/secrets.js),
 * so this is a straight pass-through with no field mapping.
 *
 * @param {{ db: import("drizzle-orm/node-postgres").NodePgDatabase }} options
 */
export function createDbSecretStorage({ db }) {
  return {
    async put(record) {
      const values = {
        ref: record.ref,
        version: record.version,
        algorithm: record.algorithm,
        keyId: record.keyId,
        metadata: record.metadata,
        createdAt: new Date(record.createdAt),
        rotatedAt: record.rotatedAt ? new Date(record.rotatedAt) : null,
        iv: record.iv,
        tag: record.tag,
        ciphertext: record.ciphertext,
        wrappedKeyIv: record.wrappedKeyIv,
        wrappedKeyTag: record.wrappedKeyTag,
        wrappedKey: record.wrappedKey,
      };
      await db
        .insert(schema.secrets)
        .values(values)
        .onConflictDoUpdate({ target: schema.secrets.ref, set: values });
    },

    async get(ref) {
      const [row] = await db
        .select()
        .from(schema.secrets)
        .where(eq(schema.secrets.ref, ref));
      if (!row) return null;
      return {
        ref: row.ref,
        version: row.version,
        algorithm: row.algorithm,
        keyId: row.keyId,
        metadata: row.metadata,
        createdAt: row.createdAt.toISOString(),
        rotatedAt: row.rotatedAt ? row.rotatedAt.toISOString() : null,
        iv: row.iv,
        tag: row.tag,
        ciphertext: row.ciphertext,
        wrappedKeyIv: row.wrappedKeyIv,
        wrappedKeyTag: row.wrappedKeyTag,
        wrappedKey: row.wrappedKey,
      };
    },

    async delete(ref) {
      const deleted = await db
        .delete(schema.secrets)
        .where(eq(schema.secrets.ref, ref))
        .returning({ ref: schema.secrets.ref });
      return deleted.length > 0;
    },
  };
}
