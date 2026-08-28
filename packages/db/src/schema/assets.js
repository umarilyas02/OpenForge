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
