import { describe, expect, it } from "vitest";

import { parseAuditEvent } from "../src/audit-event.js";

const BASE_EVENT = {
  schemaVersion: 1,
  id: "audit_00000000000000000000000000000000",
  actorId: "11111111-1111-4111-8111-111111111111",
  organizationId: "22222222-2222-4222-8222-222222222222",
  projectId: null,
  action: "session.login",
  targetType: "session",
  targetId: null,
  outcome: "success",
  ipAddress: "127.0.0.1",
  userAgent: "vitest",
  traceId: "trace-1",
  metadata: {},
  occurredAt: "2026-08-28T00:00:00.000Z",
};

describe("audit event schema", () => {
  it("accepts a well-formed event", () => {
    expect(parseAuditEvent(BASE_EVENT)).toMatchObject({
      action: "session.login",
    });
  });

  it("rejects an invalid action format", () => {
    expect(() =>
      parseAuditEvent({ ...BASE_EVENT, action: "Bad Action!" }),
    ).toThrow();
  });

  it("rejects an unknown outcome", () => {
    expect(() =>
      parseAuditEvent({ ...BASE_EVENT, outcome: "maybe" }),
    ).toThrow();
  });

  it("rejects unexpected extra fields", () => {
    expect(() => parseAuditEvent({ ...BASE_EVENT, extra: true })).toThrow();
  });
});
