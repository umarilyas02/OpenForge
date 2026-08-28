import { z } from "zod";

export const THEME_SCHEMA_VERSION = 1;

export const THEME_TEMPLATE_NAMES = Object.freeze([
  "page",
  "post",
  "archive",
  "notFound",
]);

export const themeRegionSchema = z
  .object({
    key: z.string().regex(/^[a-z][a-z0-9-]*$/u),
    label: z.string().min(1),
    allowedBlockIds: z.array(z.string().min(1)).min(1),
  })
  .strict();

export const themeManifestSchema = z
  .object({
    schemaVersion: z.literal(THEME_SCHEMA_VERSION),
    id: z.string().regex(/^openforge-theme\.[a-z][a-z0-9-]*$/u),
    name: z.string().min(1),
    version: z.string().regex(/^\d+\.\d+\.\d+$/u),
    description: z.string().min(1),
    regions: z.array(themeRegionSchema).min(1),
    templateNames: z.array(z.enum(THEME_TEMPLATE_NAMES)).min(1),
    defaultTokenOverrides: z.record(z.string(), z.string()).default({}),
  })
  .strict();

/**
 * @param {unknown} value
 */
export function parseThemeManifest(value) {
  return themeManifestSchema.parse(value);
}
