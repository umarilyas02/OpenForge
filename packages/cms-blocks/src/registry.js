import { invariant } from "./errors.js";
import { applyCmsBlockMigration } from "./migration.js";

/**
 * @param {ReturnType<typeof import("./block.js").createCmsBlock>[]} blocks
 */
export function createCmsBlockRegistry(blocks) {
  const byId = new Map();

  for (const block of blocks) {
    invariant(
      !byId.has(block.definition.id),
      "OF_CMS_BLOCK_DUPLICATE",
      `Duplicate CMS block id: ${block.definition.id}`,
      { blockId: block.definition.id },
    );
    byId.set(block.definition.id, block);
  }

  function requireBlock(id) {
    const block = byId.get(id);
    invariant(block, "OF_CMS_BLOCK_NOT_FOUND", `Unknown CMS block: ${id}`, {
      blockId: id,
    });
    return block;
  }

  return Object.freeze({
    list() {
      return [...byId.values()].map((block) => block.definition);
    },

    get(id) {
      return requireBlock(id);
    },

    componentsById() {
      const components = {};
      for (const [id, block] of byId) {
        components[id] = block.component;
      }
      return components;
    },

    validateProps(id, props) {
      const block = requireBlock(id);
      const missing = block.definition.editableFields
        .filter((field) => field.required)
        .filter((field) => {
          const value = props?.[field.path];
          return value === undefined || value === null || value === "";
        })
        .map((field) => field.path);

      invariant(
        missing.length === 0,
        "OF_CMS_BLOCK_PROPS_INVALID",
        `Block "${id}" is missing required props: ${missing.join(", ")}.`,
        { blockId: id, missing },
      );
    },

    migrateInstance(instance) {
      invariant(
        instance &&
          typeof instance === "object" &&
          typeof instance.blockId === "string" &&
          Number.isInteger(instance.blockVersion) &&
          instance.blockVersion >= 1 &&
          instance.props &&
          typeof instance.props === "object" &&
          !Array.isArray(instance.props),
        "OF_CMS_BLOCK_INSTANCE_INVALID",
        "Block instance is invalid.",
      );

      const block = requireBlock(instance.blockId);
      invariant(
        instance.blockVersion <= block.definition.version,
        "OF_CMS_BLOCK_VERSION_UNSUPPORTED",
        "Block instance is newer than this registry.",
        {
          current: block.definition.version,
          received: instance.blockVersion,
        },
      );

      let props = structuredClone(instance.props);
      let version = instance.blockVersion;
      while (version < block.definition.version) {
        const migration = block.definition.migrations.find(
          ({ fromVersion }) => fromVersion === version,
        );
        invariant(
          migration,
          "OF_CMS_BLOCK_MIGRATION_MISSING",
          `Missing migration for ${block.definition.id} version ${version}.`,
          { blockId: block.definition.id, version },
        );
        props = applyCmsBlockMigration(props, migration);
        version = migration.toVersion;
      }

      return { blockId: block.definition.id, blockVersion: version, props };
    },
  });
}
