import { z } from "zod";

export const DESIGN_TOKEN_SCHEMA_VERSION = 1;

export const TOKEN_TYPES = Object.freeze([
  "color",
  "dimension",
  "font-family",
  "font-size",
  "font-weight",
  "line-height",
  "radius",
  "shadow",
]);

export const TOKEN_TIERS = Object.freeze(["global", "semantic", "component"]);

export const designTokenSchema = z
  .object({
    schemaVersion: z.literal(DESIGN_TOKEN_SCHEMA_VERSION),
    name: z
      .string()
      .regex(
        /^[a-z][a-z0-9-]*(?:\.[a-z0-9][a-z0-9-]*)+$/u,
        "Token names use dot-separated lowercase segments.",
      ),
    cssVariable: z
      .string()
      .regex(/^--of-[a-z0-9-]+$/u, "Invalid OpenForge CSS variable."),
    type: z.enum(TOKEN_TYPES),
    tier: z.enum(TOKEN_TIERS),
    value: z.string().min(1),
    description: z.string().min(1),
  })
  .strict();

export const designTokenCollectionSchema = z
  .object({
    schemaVersion: z.literal(DESIGN_TOKEN_SCHEMA_VERSION),
    tokens: z.array(designTokenSchema).min(1),
  })
  .strict();

export function parseDesignTokenCollection(value) {
  return designTokenCollectionSchema.parse(value);
}
