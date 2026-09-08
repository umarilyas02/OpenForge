export {
  BLOCK_SCHEMA_VERSION,
  blockDefinitionSchema,
  blockMigrationSchema,
  parseBlockDefinition,
} from "./schema.js";
export { BlockRegistryError, createBlockRegistry } from "./registry.js";
export { OFFICIAL_BLOCK_STYLES, officialBlocks } from "./official-blocks.js";

import { officialBlocks } from "./official-blocks.js";
import { createBlockRegistry } from "./registry.js";

export const officialBlockRegistry = createBlockRegistry(officialBlocks);
