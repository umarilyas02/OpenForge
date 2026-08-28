import { randomUUID } from "node:crypto";

import {
  integer,
  pgTable,
  text,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { sites } from "./sites.js";

export const menus = pgTable(
  "menus",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    key: varchar("key", { length: 60 }).notNull(),
    label: varchar("label", { length: 120 }).notNull(),
  },
  (table) => [uniqueIndex("menus_site_key_idx").on(table.siteId, table.key)],
);

export const menuItems = pgTable("menu_items", {
  id: uuid("id")
    .primaryKey()
    .$defaultFn(() => randomUUID()),
  menuId: uuid("menu_id")
    .notNull()
    .references(() => menus.id, { onDelete: "cascade" }),
  parentId: uuid("parent_id"),
  label: varchar("label", { length: 120 }).notNull(),
  url: text("url").notNull(),
  position: integer("position").notNull().default(0),
});
