import { z } from "zod";

export const AUDIT_EVENT_SCHEMA_VERSION = 1;

const uuid = () => z.string().uuid();

export const auditEventSchema = z
  .object({
    schemaVersion: z.literal(AUDIT_EVENT_SCHEMA_VERSION),
    id: z.string().regex(/^audit_[a-f0-9]{32}$/u),
    actorId: uuid().nullable(),
    organizationId: uuid().nullable(),
    projectId: uuid().nullable(),
    action: z.string().regex(/^[a-z][a-z0-9._:-]{2,100}$/u),
    targetType: z.string().min(1),
    targetId: z.string().min(1).nullable(),
    outcome: z.enum(["success", "denied", "failed"]),
    ipAddress: z.string().min(1).nullable(),
    userAgent: z.string().min(1).nullable(),
    traceId: z.string().min(1).nullable(),
    metadata: z.record(z.string(), z.unknown()).default({}),
    occurredAt: z.string().datetime(),
  })
  .strict();

/**
 * @param {unknown} value
 */
export function parseAuditEvent(value) {
  return auditEventSchema.parse(value);
}
