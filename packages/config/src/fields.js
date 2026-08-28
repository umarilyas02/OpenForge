import { z } from "zod";

function blankToUndefined(value) {
  return value === "" || value === undefined ? undefined : value;
}

export const nodeEnvField = z
  .enum(["development", "test", "production"])
  .default("development");

export const portField = z.preprocess(
  (value) => (typeof value === "string" ? Number(value) : value),
  z.number().int().min(1).max(65535),
);

export const optionalPortField = z.preprocess(
  (value) => blankToUndefined(value),
  z.preprocess(
    (value) => (typeof value === "string" ? Number(value) : value),
    z.number().int().min(1).max(65535).optional(),
  ),
);

export function requiredString(message = "This value is required.") {
  return z.string().min(1, message);
}

export function optionalString() {
  return z.preprocess(
    (value) => blankToUndefined(value),
    z.string().optional(),
  );
}

export function requiredUrl(message = "This value must be a valid URL.") {
  return z.string().url(message);
}

export function optionalUrl(message = "This value must be a valid URL.") {
  return z.preprocess(
    (value) => blankToUndefined(value),
    z.string().url(message).optional(),
  );
}

export function requiredSecret(minLength = 32) {
  return z
    .string()
    .min(
      minLength,
      `This secret must be at least ${minLength} characters long.`,
    );
}
