import { parseBlockDefinition } from "./schema.js";

export class BlockRegistryError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "BlockRegistryError";
    this.code = code;
    this.details = details;
  }
}

function clone(value) {
  return structuredClone(value);
}

function setAtPath(target, path, value) {
  if (!(path in target)) {
    target[path] = clone(value);
  }
}

function applyMigration(props, migration) {
  const next = clone(props);

  for (const change of migration.changes) {
    if (change.type === "rename-prop" && change.from in next) {
      next[change.to] = next[change.from];
      delete next[change.from];
    } else if (change.type === "set-default") {
      setAtPath(next, change.path, change.value);
    } else if (change.type === "remove-prop") {
      delete next[change.path];
    }
  }

  return next;
}

/**
 * Create a deterministic, read-only registry facade.
 *
 * @param {unknown[]} definitions
 */
export function createBlockRegistry(definitions) {
  const blocks = definitions
    .map(parseBlockDefinition)
    .sort((left, right) => left.id.localeCompare(right.id));
  const byId = new Map();

  for (const block of blocks) {
    if (byId.has(block.id)) {
      throw new BlockRegistryError(
        "OF_BLOCK_DUPLICATE",
        `Duplicate block id: ${block.id}`,
      );
    }
    byId.set(block.id, block);
  }

  function requireBlock(id) {
    const block = byId.get(id);
    if (!block) {
      throw new BlockRegistryError(
        "OF_BLOCK_NOT_FOUND",
        `Unknown block: ${id}`,
        { id },
      );
    }
    return block;
  }

  return Object.freeze({
    list() {
      return blocks.map(clone);
    },

    get(id) {
      return clone(requireBlock(id));
    },

    search(query = "") {
      const terms = query
        .trim()
        .toLocaleLowerCase()
        .split(/\s+/u)
        .filter(Boolean);

      if (terms.length === 0) {
        return blocks.map(clone);
      }

      return blocks
        .filter((block) => {
          const haystack = [
            block.id,
            block.name,
            block.description,
            block.category,
            ...block.tags,
          ]
            .join(" ")
            .toLocaleLowerCase();
          return terms.every((term) => haystack.includes(term));
        })
        .map(clone);
    },

    preview(id) {
      const block = requireBlock(id);
      return clone({
        id: block.id,
        version: block.version,
        name: block.name,
        description: block.description,
        category: block.category,
        ...block.preview,
        defaultProps: block.defaultProps,
        accessibility: block.accessibility,
      });
    },

    createInsertion(id) {
      const block = requireBlock(id);
      const componentPath = `components/openforge/${block.fileName}`;

      return clone({
        schemaVersion: 1,
        blockId: block.id,
        blockVersion: block.version,
        import: {
          source: `@/${componentPath.replace(/\.jsx$/u, "")}`,
          imported: block.exportName,
        },
        jsx: `<${block.exportName} />`,
        defaultProps: block.defaultProps,
        files: [
          { path: componentPath, content: block.source },
          {
            path: "components/openforge/openforge-blocks.css",
            content: block.styles,
          },
        ],
      });
    },

    migrateInstance(instance) {
      if (
        !instance ||
        typeof instance !== "object" ||
        typeof instance.blockId !== "string" ||
        !Number.isInteger(instance.blockVersion) ||
        instance.blockVersion < 1 ||
        !instance.props ||
        typeof instance.props !== "object" ||
        Array.isArray(instance.props)
      ) {
        throw new BlockRegistryError(
          "OF_BLOCK_INSTANCE_INVALID",
          "Block instance is invalid.",
        );
      }

      const block = requireBlock(instance.blockId);
      if (instance.blockVersion > block.version) {
        throw new BlockRegistryError(
          "OF_BLOCK_VERSION_UNSUPPORTED",
          "Block instance is newer than this registry.",
          { current: block.version, received: instance.blockVersion },
        );
      }

      let props = clone(instance.props);
      let version = instance.blockVersion;
      while (version < block.version) {
        const migration = block.migrations.find(
          ({ fromVersion }) => fromVersion === version,
        );
        if (!migration) {
          throw new BlockRegistryError(
            "OF_BLOCK_MIGRATION_MISSING",
            `Missing migration for ${block.id} version ${version}.`,
          );
        }
        props = applyMigration(props, migration);
        version = migration.toVersion;
      }

      return { blockId: block.id, blockVersion: version, props };
    },
  });
}
