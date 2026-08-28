import {
  index,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const auditEvents = pgTable(
  "audit_events",
  {
    id: varchar("id", { length: 40 }).primaryKey(),
    actorId: uuid("actor_id"),
    organizationId: uuid("organization_id"),
    projectId: uuid("project_id"),
    action: varchar("action", { length: 120 }).notNull(),
    targetType: varchar("target_type", { length: 60 }).notNull(),
    targetId: varchar("target_id", { length: 120 }),
    outcome: varchar("outcome", { length: 20 }).notNull(),
    ipAddress: varchar("ip_address", { length: 64 }),
    userAgent: text("user_agent"),
    traceId: varchar("trace_id", { length: 120 }),
    metadata: jsonb("metadata").notNull().default({}),
    occurredAt: timestamp("occurred_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("audit_events_org_date_idx").on(
      table.organizationId,
      table.occurredAt,
    ),
  ],
);
