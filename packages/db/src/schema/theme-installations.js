import { randomUUID } from "node:crypto";

import { jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";

import { sites } from "./sites.js";

export const themeInstallations = pgTable("theme_installations", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  siteId: uuid("site_id")
    .notNull()
    .unique()
    .references(() => sites.id, { onDelete: "cascade" }),
  themeId: varchar("theme_id", { length: 120 }).notNull(),
  themeVersion: varchar("theme_version", { length: 40 }).notNull(),
  config: jsonb("config").notNull().default({}),
  installedAt: timestamp("installed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});
