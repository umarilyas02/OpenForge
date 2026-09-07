import { randomUUID } from "node:crypto";

import {
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { sites } from "./sites.js";
import { users } from "./users.js";

export const assets = pgTable(
  "assets",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    // The asset-manager domain layer (@openforge/storage) generates and
    // looks assets up by its own string id (e.g. "asset_1a2b3c4d5e6f7890"),
    // not a UUID. `id` above stays a real Postgres-generated UUID used only
    // as this table's internal primary key; storage adapters store the
    // asset-manager's logical id here and always look rows up by
    // (siteId, externalId).
    externalId: varchar("external_id", { length: 40 }),
    storageKey: text("storage_key").notNull(),
    originalName: varchar("original_name", { length: 255 }).notNull(),
    mimeType: varchar("mime_type", { length: 120 }).notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    width: integer("width"),
    height: integer("height"),
    sha256: varchar("sha256", { length: 64 }).notNull(),
    altText: text("alt_text"),
    altStatus: varchar("alt_status", { length: 20 })
      .notNull()
      .default("missing"),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("assets_site_sha256_idx").on(table.siteId, table.sha256),
    uniqueIndex("assets_site_external_id_idx").on(
      table.siteId,
      table.externalId,
    ),
  ],
);

export const assetVariants = pgTable("asset_variants", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  assetId: uuid("asset_id")
    .notNull()
    .references(() => assets.id, { onDelete: "cascade" }),
  format: varchar("format", { length: 20 }).notNull(),
  width: integer("width").notNull(),
  height: integer("height").notNull(),
  storageKey: text("storage_key").notNull(),
});
