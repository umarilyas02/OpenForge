import { z } from "zod";

export const ERROR_ENVELOPE_SCHEMA_VERSION = 1;

export const errorEnvelopeSchema = z
  .object({
    schemaVersion: z.literal(ERROR_ENVELOPE_SCHEMA_VERSION),
    code: z
      .string()
      .regex(/^OF_[A-Z0-9_]+$/u, "Error codes use the OF_ prefix."),
    message: z.string().min(1),
    details: z.record(z.string(), z.unknown()).default({}),
    requestId: z.string().min(1).optional(),
  })
  .strict();

/**
 * Build a stable, serializable error envelope from a thrown error.
 *
 * @param {{ code: string, message: string, details?: object }} error
 * @param {{ requestId?: string }} [context]
 */
export function toErrorEnvelope(error, { requestId } = {}) {
  return errorEnvelopeSchema.parse({
    schemaVersion: ERROR_ENVELOPE_SCHEMA_VERSION,
    code: error.code,
    message: error.message,
    details: error.details ?? {},
    ...(requestId ? { requestId } : {}),
  });
}

export const successEnvelopeSchema = z
  .object({
    schemaVersion: z.literal(ERROR_ENVELOPE_SCHEMA_VERSION),
    data: z.unknown(),
    requestId: z.string().min(1).optional(),
  })
  .strict();

/**
 * @param {unknown} data
 * @param {{ requestId?: string }} [context]
 */
export function toSuccessEnvelope(data, { requestId } = {}) {
  return successEnvelopeSchema.parse({
    schemaVersion: ERROR_ENVELOPE_SCHEMA_VERSION,
    data,
    ...(requestId ? { requestId } : {}),
  });
}
