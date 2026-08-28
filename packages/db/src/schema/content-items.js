import { randomUUID } from "node:crypto";

import {
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { sites } from "./sites.js";
import { users } from "./users.js";

export const CONTENT_TYPES = Object.freeze(["page", "post"]);
export const CONTENT_STATUSES = Object.freeze([
  "draft",
  "published",
  "scheduled",
  "trashed",
]);

export const contentItems = pgTable(
  "content_items",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    type: varchar("type", { length: 20 }).notNull(),
    status: varchar("status", { length: 20 }).notNull().default("draft"),
    slug: varchar("slug", { length: 200 }).notNull(),
    title: varchar("title", { length: 300 }).notNull(),
    excerpt: text("excerpt"),
    blockTree: jsonb("block_tree").notNull().default([]),
    featuredAssetId: uuid("featured_asset_id"),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    uniqueIndex("content_items_site_slug_idx").on(table.siteId, table.slug),
  ],
);
