const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/iu;

/**
 * Every id-lookup route in this app takes a route param straight from the
 * URL and queries a Postgres `uuid` column with it. Postgres rejects a
 * non-UUID value at the driver level (a thrown query error, not an empty
 * result), which without this check surfaces as a raw 500/dev-overlay
 * crash instead of a clean 404 for something as ordinary as a mistyped or
 * stale URL.
 *
 * @param {string} value
 */
export function isUuid(value) {
  return typeof value === "string" && UUID_PATTERN.test(value);
}
