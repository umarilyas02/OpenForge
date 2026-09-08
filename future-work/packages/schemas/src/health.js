import { z } from "zod";

export const HEALTH_SCHEMA_VERSION = 1;

export const HEALTH_STATUSES = Object.freeze(["ok", "degraded", "down"]);

export const healthReportSchema = z
  .object({
    schemaVersion: z.literal(HEALTH_SCHEMA_VERSION),
    status: z.enum(HEALTH_STATUSES),
    checkedAt: z.string().datetime(),
    checks: z.array(
      z
        .object({
          name: z.string().min(1),
          status: z.enum(HEALTH_STATUSES),
          message: z.string().min(1).optional(),
          durationMs: z.number().nonnegative(),
        })
        .strict(),
    ),
  })
  .strict();

function worstStatus(statuses) {
  if (statuses.includes("down")) return "down";
  if (statuses.includes("degraded")) return "degraded";
  return "ok";
}

/**
 * Build a framework-agnostic health-check runner from a set of named probes.
 * Each probe is an async function returning nothing (ok), or throwing/
 * resolving `{ status, message }` to report degradation.
 *
 * @param {{ checks: Record<string, () => Promise<void|{status: 'degraded'|'down', message?: string}>>, clock?: () => Date }} options
 */
export function createHealthCheck({ checks, clock = () => new Date() }) {
  const names = Object.keys(checks);

  return async function runHealthCheck() {
    const results = await Promise.all(
      names.map(async (name) => {
        const startedAt = Date.now();
        try {
          const outcome = await checks[name]();
          return {
            name,
            status: outcome?.status ?? "ok",
            ...(outcome?.message ? { message: outcome.message } : {}),
            durationMs: Date.now() - startedAt,
          };
        } catch (error) {
          return {
            name,
            status: "down",
            message: error instanceof Error ? error.message : String(error),
            durationMs: Date.now() - startedAt,
          };
        }
      }),
    );

    return healthReportSchema.parse({
      schemaVersion: HEALTH_SCHEMA_VERSION,
      status: worstStatus(results.map((result) => result.status)),
      checkedAt: clock().toISOString(),
      checks: results,
    });
  };
}
