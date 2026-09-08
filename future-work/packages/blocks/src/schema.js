import { z } from "zod";

export const BLOCK_SCHEMA_VERSION = 1;

const editableFieldSchema = z
  .object({
    path: z.string().min(1),
    label: z.string().min(1),
    control: z.enum(["text", "textarea", "url", "image", "boolean"]),
    required: z.boolean().default(false),
  })
  .strict();

const slotSchema = z
  .object({
    name: z.string().min(1),
    label: z.string().min(1),
    acceptedTypes: z.array(z.string().min(1)).min(1),
    min: z.number().int().nonnegative(),
    max: z.number().int().positive().nullable(),
  })
  .strict()
  .refine((slot) => slot.max === null || slot.max >= slot.min, {
    message: "Slot maximum must be null or greater than its minimum.",
  });

const migrationChangeSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("rename-prop"),
      from: z.string().min(1),
      to: z.string().min(1),
    })
    .strict(),
  z
    .object({
      type: z.literal("set-default"),
      path: z.string().min(1),
      value: z.unknown(),
    })
    .strict(),
  z
    .object({
      type: z.literal("remove-prop"),
      path: z.string().min(1),
    })
    .strict(),
]);

export const blockMigrationSchema = z
  .object({
    fromVersion: z.number().int().positive(),
    toVersion: z.number().int().positive(),
    description: z.string().min(1),
    changes: z.array(migrationChangeSchema).min(1),
  })
  .strict()
  .refine(
    ({ fromVersion, toVersion }) => toVersion === fromVersion + 1,
    "Block migrations must advance exactly one version.",
  );

export const blockDefinitionSchema = z
  .object({
    schemaVersion: z.literal(BLOCK_SCHEMA_VERSION),
    id: z.string().regex(/^openforge\.[a-z][a-z0-9-]*$/u),
    version: z.number().int().positive(),
    name: z.string().min(1),
    description: z.string().min(1),
    category: z.enum([
      "navigation",
      "hero",
      "social-proof",
      "content",
      "conversion",
      "pricing",
      "footer",
    ]),
    tags: z.array(z.string().min(1)).min(1),
    exportName: z.string().regex(/^[A-Z][A-Za-z0-9]*$/u),
    fileName: z.string().regex(/^[A-Z][A-Za-z0-9]*\.jsx$/u),
    dependencies: z.array(z.string().min(1)),
    defaultProps: z.record(z.string(), z.unknown()),
    editableFields: z.array(editableFieldSchema),
    slots: z.array(slotSchema),
    accessibility: z.array(z.string().min(1)).min(1),
    migrations: z.array(blockMigrationSchema),
    preview: z
      .object({
        label: z.string().min(1),
        viewport: z.enum(["full", "wide", "compact"]),
        tone: z.enum(["light", "dark", "brand"]),
      })
      .strict(),
    source: z.string().min(1),
    styles: z.string().min(1),
  })
  .strict()
  .superRefine((block, context) => {
    const migrationVersions = new Set(
      block.migrations.map(({ fromVersion }) => fromVersion),
    );

    if (
      block.version > 1 &&
      !Array.from({ length: block.version - 1 }, (_, index) => index + 1).every(
        (version) => migrationVersions.has(version),
      )
    ) {
      context.addIssue({
        code: "custom",
        message: "Every prior block version requires a contiguous migration.",
        path: ["migrations"],
      });
    }
  });

/**
 * Validate and clone a public block definition.
 *
 * @param {unknown} value
 */
export function parseBlockDefinition(value) {
  return blockDefinitionSchema.parse(value);
}
