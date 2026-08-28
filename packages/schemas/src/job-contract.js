import { z } from "zod";

export const JOB_CONTRACT_SCHEMA_VERSION = 1;

export const JOB_STATUSES = Object.freeze([
  "queued",
  "active",
  "completed",
  "failed",
  "cancelled",
]);

export const jobPayloadSchema = z
  .object({
    schemaVersion: z.literal(JOB_CONTRACT_SCHEMA_VERSION),
    id: z.string().min(1),
    queue: z.string().regex(/^[a-z][a-z0-9-]*$/u),
    type: z.string().regex(/^[a-z][a-z0-9.]*$/u),
    payload: z.record(z.string(), z.unknown()),
    attempts: z.number().int().nonnegative().default(0),
    maxAttempts: z.number().int().positive().default(3),
    enqueuedAt: z.string().datetime(),
  })
  .strict();

export const jobResultSchema = z
  .object({
    schemaVersion: z.literal(JOB_CONTRACT_SCHEMA_VERSION),
    jobId: z.string().min(1),
    status: z.enum(JOB_STATUSES),
    progress: z.number().min(0).max(100).default(0),
    result: z.record(z.string(), z.unknown()).nullable().default(null),
    errorCode: z
      .string()
      .regex(/^OF_[A-Z0-9_]+$/u)
      .nullable()
      .default(null),
    startedAt: z.string().datetime().nullable().default(null),
    completedAt: z.string().datetime().nullable().default(null),
  })
  .strict()
  .refine(
    (result) => result.status !== "failed" || result.errorCode !== null,
    "A failed job result must include an errorCode.",
  );

/**
 * @param {unknown} value
 */
export function parseJobPayload(value) {
  return jobPayloadSchema.parse(value);
}

/**
 * @param {unknown} value
 */
export function parseJobResult(value) {
  return jobResultSchema.parse(value);
}
