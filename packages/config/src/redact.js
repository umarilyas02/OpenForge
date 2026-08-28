import { redactAuditValue } from "@openforge/integration-security";

/**
 * Redact secret-shaped values from a config/log payload before it leaves
 * the process. Thin adapter over `@openforge/integration-security` so
 * redaction rules are defined once.
 *
 * @param {unknown} value
 */
export function redactConfigValue(value) {
  return redactAuditValue(value);
}
