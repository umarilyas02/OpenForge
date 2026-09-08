import { randomUUID } from "node:crypto";

import { pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";

import { sites } from "./sites.js";
import { users } from "./users.js";

/**
 * A site's connection to a remote GitHub repository it can push its real
 * workspace files to (see apps/cms-admin/src/lib/site-git.js). The access
 * token itself is never stored here — `secretRef` points at an encrypted
 * envelope in the `secrets` table (see secrets.js), decrypted only for the
 * duration of a single push.
 */
export const siteGitConnections = pgTable(
  "site_git_connections",
  {
    id: uuid("id")
      .primaryKey()
      .$defaultFn(() => randomUUID()),
    siteId: uuid("site_id")
      .notNull()
      .references(() => sites.id, { onDelete: "cascade" }),
    repoOwner: varchar("repo_owner", { length: 200 }).notNull(),
    repoName: varchar("repo_name", { length: 200 }).notNull(),
    defaultBranch: varchar("default_branch", { length: 200 })
      .notNull()
      .default("main"),
    secretRef: varchar("secret_ref", { length: 48 }).notNull(),
    createdBy: uuid("created_by")
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("site_git_connections_site_id_idx").on(table.siteId)],
);
