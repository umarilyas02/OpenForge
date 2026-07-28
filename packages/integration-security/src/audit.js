import { randomUUID } from "node:crypto";

import { invariant } from "./errors.js";

const SENSITIVE_KEY =
  /authorization|cookie|credential|password|private.?key|secret|token|api.?key/iu;
const SENSITIVE_TEXT = [
  /\bBearer\s+[a-zA-Z0-9._~+/=-]+/giu,
  /\bgh[opsu]_[a-zA-Z0-9]{20,}\b/gu,
  /\b(?:secret|token|password)=([^&\s]+)/giu,
];

export function redactAuditValue(value, ancestors = new Set()) {
  if (typeof value === "string") {
    return SENSITIVE_TEXT.reduce(
      (redacted, pattern) => redacted.replace(pattern, "[REDACTED]"),
      value,
    );
  }
  if (value === null || typeof value !== "object") return value;
  if (ancestors.has(value)) return "[CIRCULAR]";
  ancestors.add(value);
  if (Array.isArray(value)) {
    const result = value.map((entry) => redactAuditValue(entry, ancestors));
    ancestors.delete(value);
    return result;
  }
  const result = {};
  for (const [key, entry] of Object.entries(value)) {
    result[key] = SENSITIVE_KEY.test(key)
      ? "[REDACTED]"
      : redactAuditValue(entry, ancestors);
  }
  ancestors.delete(value);
  return result;
}

export function createAuditEvent(
  { action, actor, target, outcome, requestId, details = {} },
  { clock = () => new Date(), id = () => randomUUID() } = {},
) {
  invariant(
    /^[a-z][a-z0-9._:-]{2,100}$/u.test(action),
    "OF_AUDIT_ACTION_INVALID",
    "The audit action is invalid.",
  );
  invariant(
    ["success", "denied", "failed"].includes(outcome),
    "OF_AUDIT_OUTCOME_INVALID",
    "The audit outcome is invalid.",
  );
  return Object.freeze({
    id: `audit_${id().replaceAll("-", "")}`,
    occurredAt: clock().toISOString(),
    action,
    actor: redactAuditValue(actor),
    target: redactAuditValue(target),
    outcome,
    requestId,
    details: redactAuditValue(details),
  });
}
