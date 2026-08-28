import { invariant } from "./errors.js";
import { parseCmsBlockDefinition } from "./schema.js";

/**
 * Pair a validated block definition with its real, importable React
 * component.
 *
 * @param {{ definition: unknown, component: Function }} options
 */
export function createCmsBlock({ definition, component }) {
  const parsed = parseCmsBlockDefinition(definition);

  invariant(
    typeof component === "function",
    "OF_CMS_BLOCK_COMPONENT_INVALID",
    `Block "${parsed.id}" component must be a function.`,
    { blockId: parsed.id },
  );

  return Object.freeze({ definition: parsed, component });
}
