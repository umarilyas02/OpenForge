import { ConfigError } from "./errors.js";

/**
 * `source` is usually the real `process.env`, which always carries dozens
 * of ambient OS/tooling variables no schema declares. Since every schema
 * here is `.strict()`, validating the raw object would always fail on
 * "unrecognized keys" — so only the keys the schema actually declares are
 * picked out before parsing.
 *
 * @param {import("zod").ZodType} schema
 * @param {Record<string, unknown>} source
 */
function pickDeclaredKeys(schema, source) {
  const shape = schema.shape;
  if (!shape) return source;

  const picked = {};
  for (const key of Object.keys(shape)) {
    if (Object.hasOwn(source, key)) picked[key] = source[key];
  }
  return picked;
}

/**
 * Validate a raw environment-variable source against a zod schema and
 * return a frozen, parsed config object. On failure, throws a single
 * `ConfigError` listing every missing/invalid variable so a service fails
 * safely with one actionable startup error instead of one field at a time.
 *
 * @param {{ schema: import("zod").ZodType, source?: Record<string, string | undefined> }} options
 */
export function loadEnv({ schema, source = process.env }) {
  const result = schema.safeParse(pickDeclaredKeys(schema, source));

  if (!result.success) {
    const issues = result.error.issues.map((issue) => ({
      path: issue.path.join("."),
      message: issue.message,
    }));
    throw new ConfigError(
      "OF_CONFIG_INVALID",
      `Configuration is invalid: ${issues
        .map((issue) => `${issue.path} (${issue.message})`)
        .join("; ")}`,
      { issues },
    );
  }

  return Object.freeze(result.data);
}
