import { z } from "zod";

export const CONTENT_TREE_SCHEMA_VERSION = 1;

/** @type {import("zod").ZodType} */
export const contentNodeSchema = z.lazy(() =>
  z
    .object({
      blockId: z.string().min(1),
      blockVersion: z.number().int().positive(),
      props: z.record(z.string(), z.unknown()).default({}),
      slots: z.record(z.string(), z.array(contentNodeSchema)).default({}),
    })
    .strict(),
);

export const contentTreeSchema = z.array(contentNodeSchema);

/**
 * @param {unknown} value
 */
export function parseContentTree(value) {
  return contentTreeSchema.parse(value);
}
