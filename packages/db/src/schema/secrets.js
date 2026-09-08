import { integer, jsonb, pgTable, text, timestamp, varchar } from "drizzle-orm/pg-core";

/**
 * Backs @openforge/integration-security's secret vault (see
 * apps/cms-admin/src/lib/secret-db-storage.js): one encrypted envelope per
 * row, addressed by the vault's own `ref` (e.g. "secret_ab12..."), never by
 * a Postgres-generated id. Column names mirror the record shape
 * `createSecretVault` produces exactly, so the storage adapter is a
 * straight pass-through with no field mapping to get wrong.
 */
export const secrets = pgTable("secrets", {
  ref: varchar("ref", { length: 48 }).primaryKey(),
  version: integer("version").notNull(),
  algorithm: varchar("algorithm", { length: 20 }).notNull(),
  keyId: varchar("key_id", { length: 64 }).notNull(),
  metadata: jsonb("metadata").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  rotatedAt: timestamp("rotated_at", { withTimezone: true }),
  iv: text("iv").notNull(),
  tag: text("tag").notNull(),
  ciphertext: text("ciphertext").notNull(),
  wrappedKeyIv: text("wrapped_key_iv").notNull(),
  wrappedKeyTag: text("wrapped_key_tag").notNull(),
  wrappedKey: text("wrapped_key").notNull(),
});
