import { z } from "zod";

import { CompilerOperationError } from "./operation-schema.js";

export const VISUAL_OPERATION_SCHEMA_VERSION = 1;

const base = {
  schemaVersion: z.literal(VISUAL_OPERATION_SCHEMA_VERSION),
  baseRevision: z.number().int().nonnegative(),
};

const fileBase = {
  ...base,
  filePath: z.string().min(1),
};

const nodeTarget = z
  .object({
    nodeId: z.string().regex(/^node_[a-f0-9]{16}$/u),
  })
  .strict();

const insertPosition = z.enum([
  "inside-start",
  "inside-end",
  "before",
  "after",
]);
const destinationPosition = z.enum([
  "inside-start",
  "inside-end",
  "before",
  "after",
]);

const insertJsx = z
  .object({
    ...fileBase,
    type: z.literal("insert-jsx"),
    target: nodeTarget,
    payload: z
      .object({
        jsx: z.string().min(1),
        position: insertPosition,
      })
      .strict(),
  })
  .strict();

const nodeOnly = (type) =>
  z
    .object({
      ...fileBase,
      type: z.literal(type),
      target: nodeTarget,
    })
    .strict();

const moveJsx = z
  .object({
    ...fileBase,
    type: z.literal("move-jsx"),
    target: nodeTarget,
    payload: z
      .object({
        destinationNodeId: z.string().regex(/^node_[a-f0-9]{16}$/u),
        position: destinationPosition,
      })
      .strict(),
  })
  .strict();

const attributeValue = z.union([
  z.string(),
  z.number().finite(),
  z.boolean(),
  z.null(),
]);
const attributeName = z
  .string()
  .regex(/^[A-Za-z_$][\w$.-]*$/u, "Invalid JSX attribute name.");

const wrapJsx = z
  .object({
    ...fileBase,
    type: z.literal("wrap-jsx"),
    target: nodeTarget,
    payload: z
      .object({
        element: z.string().regex(/^[A-Za-z_$][\w$.-]*$/u),
        attributes: z.record(attributeName, attributeValue).default({}),
      })
      .strict(),
  })
  .strict();

const replaceAsset = z
  .object({
    ...fileBase,
    type: z.literal("replace-asset"),
    target: nodeTarget,
    payload: z
      .object({
        src: z.string().min(1),
        alt: z.string(),
      })
      .strict(),
  })
  .strict();

const changeLink = z
  .object({
    ...fileBase,
    type: z.literal("change-link"),
    target: nodeTarget,
    payload: z
      .object({
        href: z.string().min(1),
        label: z.string().optional(),
      })
      .strict(),
  })
  .strict();

const route = z
  .string()
  .regex(
    /^\/(?:[a-z0-9][a-z0-9-]*(?:\/[a-z0-9][a-z0-9-]*)*)?$/u,
    "Route must be / or lowercase URL segments.",
  );

const addPage = z
  .object({
    ...base,
    type: z.literal("add-page"),
    payload: z
      .object({
        route,
        title: z.string().min(1),
        description: z.string().default(""),
      })
      .strict(),
  })
  .strict();

const renamePage = z
  .object({
    ...fileBase,
    type: z.literal("rename-page"),
    payload: z.object({ route }).strict(),
  })
  .strict();

const deletePage = z
  .object({
    ...fileBase,
    type: z.literal("delete-page"),
  })
  .strict();

const updatePageMetadata = z
  .object({
    ...fileBase,
    type: z.literal("update-page-metadata"),
    payload: z
      .object({
        title: z.string().min(1),
        description: z.string(),
      })
      .strict(),
  })
  .strict();

export const visualOperationSchema = z.discriminatedUnion("type", [
  insertJsx,
  nodeOnly("remove-jsx"),
  moveJsx,
  wrapJsx,
  nodeOnly("unwrap-jsx"),
  nodeOnly("duplicate-jsx"),
  replaceAsset,
  changeLink,
  addPage,
  renamePage,
  deletePage,
  updatePageMetadata,
]);

export function parseVisualOperation(operation) {
  const result = visualOperationSchema.safeParse(operation);
  if (!result.success) {
    throw new CompilerOperationError(
      "OF_VISUAL_OPERATION_INVALID",
      "Visual operation validation failed.",
      { issues: result.error.issues },
    );
  }
  return result.data;
}
