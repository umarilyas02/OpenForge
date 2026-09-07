import { z } from "zod";

export const LIBRARY_SCHEMA_VERSION = 1;

export const libraryCategories = [
  "nav",
  "footer",
  "hero",
  "blog",
  "product",
  "grid",
  "custom",
];

export const libraryComponentSchema = z
  .object({
    schemaVersion: z.literal(LIBRARY_SCHEMA_VERSION),
    id: z.string().regex(/^[a-z][a-z0-9-]*\.[a-z][a-z0-9-]*$/u),
    name: z.string().min(1),
    category: z.enum(libraryCategories),
    description: z.string().min(1),
    tags: z.array(z.string().min(1)).min(1),
    sourceProject: z.string().min(1),
    exportName: z.string().regex(/^[A-Z][A-Za-z0-9]*$/u),
    fileName: z.string().regex(/^[A-Z][A-Za-z0-9]*\.jsx$/u),
    dependencies: z.array(z.string().min(1)),
    defaultProps: z.record(z.string(), z.unknown()),
    accessibility: z.array(z.string().min(1)).min(1),
    source: z.string().min(1),
    styles: z.string().min(1),
  })
  .strict();

/**
 * Validate and clone a public library component definition.
 *
 * @param {unknown} value
 */
export function parseLibraryComponent(value) {
  return libraryComponentSchema.parse(value);
}
