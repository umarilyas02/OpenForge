export {
  DESIGN_TOKEN_SCHEMA_VERSION,
  TOKEN_TIERS,
  TOKEN_TYPES,
  designTokenCollectionSchema,
  designTokenSchema,
  parseDesignTokenCollection,
} from "./schema.js";
export { defaultDesignTokens } from "./default-tokens.js";
export {
  DesignTokenError,
  collectTokenUsage,
  createDesignTokenRegistry,
  validateStyleValue,
  validateTokenValue,
} from "./registry.js";

import { defaultDesignTokens } from "./default-tokens.js";
import { createDesignTokenRegistry } from "./registry.js";

export const defaultDesignTokenRegistry =
  createDesignTokenRegistry(defaultDesignTokens);
