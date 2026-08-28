import { randomUUID } from "node:crypto";

import { jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { contentItems } from "./content-items.js";
import { users } from "./users.js";

export const contentRevisions = pgTable("content_revisions", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  contentItemId: uuid("content_item_id")
    .notNull()
    .references(() => contentItems.id, { onDelete: "cascade" }),
  blockTree: jsonb("block_tree").notNull(),
  title: varchar("title", { length: 300 }).notNull(),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
