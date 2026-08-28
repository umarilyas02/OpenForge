import { ConfigError } from "./errors.js";

/**
 * Validate a raw environment-variable source against a zod schema and
 * return a frozen, parsed config object. On failure, throws a single
 * `ConfigError` listing every missing/invalid variable so a service fails
 * safely with one actionable startup error instead of one field at a time.
 *
 * @param {{ schema: import("zod").ZodType, source?: Record<string, string | undefined> }} options
 */
export function loadEnv({ schema, source = process.env }) {
  const result = schema.safeParse(source);

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
