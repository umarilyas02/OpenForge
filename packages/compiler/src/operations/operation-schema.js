import { z } from "zod";

export const EDITOR_OPERATION_SCHEMA_VERSION = 1;

const baseOperation = {
  schemaVersion: z.literal(EDITOR_OPERATION_SCHEMA_VERSION),
  baseRevision: z.number().int().nonnegative(),
  filePath: z.string().min(1),
};

const nodeTarget = z
  .object({
    nodeId: z.string().regex(/^node_[a-f0-9]{16}$/u),
  })
  .strict();

const attributeName = z
  .string()
  .regex(/^[A-Za-z_$][\w$.-]*$/u, "Invalid JSX attribute name.");

const setJsxAttributeOperation = z
  .object({
    ...baseOperation,
    type: z.literal("set-jsx-attribute"),
    target: nodeTarget,
    payload: z
      .object({
        name: attributeName,
        value: z.union([
          z.string(),
          z.number().finite(),
          z.boolean(),
          z.null(),
        ]),
      })
      .strict(),
  })
  .strict();

const removeJsxAttributeOperation = z
  .object({
    ...baseOperation,
    type: z.literal("remove-jsx-attribute"),
    target: nodeTarget,
    payload: z
      .object({
        name: attributeName,
      })
      .strict(),
  })
  .strict();

const replaceJsxTextOperation = z
  .object({
    ...baseOperation,
    type: z.literal("replace-jsx-text"),
    target: nodeTarget,
    payload: z
      .object({
        text: z.string(),
      })
      .strict(),
  })
  .strict();

const addImportOperation = z
  .object({
    ...baseOperation,
    type: z.literal("add-import"),
    payload: z
      .object({
        source: z.string().min(1),
        importKind: z.enum(["default", "named", "namespace", "side-effect"]),
        imported: z.string().min(1).optional(),
        local: z
          .string()
          .regex(/^[A-Za-z_$][\w$]*$/u)
          .optional(),
      })
      .strict(),
  })
  .strict()
  .superRefine((operation, context) => {
    const { importKind, imported, local } = operation.payload;

    if (importKind === "named" && !imported) {
      context.addIssue({
        code: "custom",
        message: "Named imports require payload.imported.",
        path: ["payload", "imported"],
      });
    }

    if (["default", "namespace"].includes(importKind) && !local) {
      context.addIssue({
        code: "custom",
        message: `${importKind} imports require payload.local.`,
        path: ["payload", "local"],
      });
    }

    if (importKind === "side-effect" && (imported || local)) {
      context.addIssue({
        code: "custom",
        message: "Side-effect imports cannot declare imported or local names.",
        path: ["payload"],
      });
    }
  });

export const editorOperationSchema = z.discriminatedUnion("type", [
  setJsxAttributeOperation,
  removeJsxAttributeOperation,
  replaceJsxTextOperation,
  addImportOperation,
]);

/**
 * Validate and clone an editor operation at the public compiler boundary.
 *
 * @param {unknown} operation
 * @returns {z.infer<typeof editorOperationSchema>}
 */
export function parseEditorOperation(operation) {
  const result = editorOperationSchema.safeParse(operation);

  if (!result.success) {
    throw new CompilerOperationError(
      "OF_OPERATION_INVALID",
      "Editor operation validation failed.",
      { issues: result.error.issues },
    );
  }

  return result.data;
}

export class CompilerOperationError extends Error {
  /**
   * @param {string} code
   * @param {string} message
   * @param {object} [details]
   */
  constructor(code, message, details = {}) {
    super(message);
    this.name = "CompilerOperationError";
    this.code = code;
    this.details = details;
  }
}
