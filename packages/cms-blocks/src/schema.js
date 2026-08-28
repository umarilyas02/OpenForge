import { z } from "zod";

export const CMS_BLOCK_SCHEMA_VERSION = 1;

const selectOptionSchema = z
  .object({
    value: z.string().min(1),
    label: z.string().min(1),
  })
  .strict();

const editableFieldSchema = z
  .object({
    path: z.string().min(1),
    label: z.string().min(1),
    control: z.enum(["text", "textarea", "url", "image", "boolean", "select"]),
    required: z.boolean().default(false),
    options: z.array(selectOptionSchema).min(1).optional(),
  })
  .strict()
  .refine(
    (field) => field.control !== "select" || (field.options?.length ?? 0) > 0,
    {
      message: "A select control requires at least one option.",
    },
  );

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

export const cmsBlockMigrationSchema = z
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

export const cmsBlockDefinitionSchema = z
  .object({
    schemaVersion: z.literal(CMS_BLOCK_SCHEMA_VERSION),
    id: z.string().regex(/^openforge-cms\.[a-z][a-z0-9-]*$/u),
    version: z.number().int().positive(),
    name: z.string().min(1),
    description: z.string().min(1),
    tags: z.array(z.string().min(1)).min(1),
    defaultProps: z.record(z.string(), z.unknown()),
    editableFields: z.array(editableFieldSchema),
    slots: z.array(slotSchema),
    accessibility: z.array(z.string().min(1)).min(1),
    migrations: z.array(cmsBlockMigrationSchema),
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
 * @param {unknown} value
 */
export function parseCmsBlockDefinition(value) {
  return cmsBlockDefinitionSchema.parse(value);
}
