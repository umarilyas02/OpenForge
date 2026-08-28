import { randomUUID } from "node:crypto";

import { pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { organizations } from "./organizations.js";
import { users } from "./users.js";

export const SITE_STATUSES = Object.freeze(["draft", "published", "suspended"]);

export const sites = pgTable("sites", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  organizationId: uuid("organization_id")
    .notNull()
    .references(() => organizations.id, { onDelete: "cascade" }),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  customDomain: varchar("custom_domain", { length: 255 }).unique(),
  status: varchar("status", { length: 20 }).notNull().default("draft"),
  createdBy: uuid("created_by")
    .notNull()
    .references(() => users.id),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
