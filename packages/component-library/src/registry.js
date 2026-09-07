import { parseLibraryComponent } from "./schema.js";

export class LibraryRegistryError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "LibraryRegistryError";
    this.code = code;
    this.details = details;
  }
}

function clone(value) {
  return structuredClone(value);
}

/**
 * Create a deterministic, read-only registry facade over harvested
 * component-library definitions.
 *
 * @param {unknown[]} definitions
 */
export function createLibraryRegistry(definitions) {
  const components = definitions
    .map(parseLibraryComponent)
    .sort((left, right) => left.id.localeCompare(right.id));
  const byId = new Map();

  for (const component of components) {
    if (byId.has(component.id)) {
      throw new LibraryRegistryError(
        "OF_LIBRARY_DUPLICATE",
        `Duplicate component id: ${component.id}`,
      );
    }
    byId.set(component.id, component);
  }

  function requireComponent(id) {
    const component = byId.get(id);
    if (!component) {
      throw new LibraryRegistryError(
        "OF_LIBRARY_NOT_FOUND",
        `Unknown component: ${id}`,
        { id },
      );
    }
    return component;
  }

  return Object.freeze({
    list() {
      return components.map(clone);
    },

    get(id) {
      return clone(requireComponent(id));
    },

    byCategory(category) {
      return components.filter((c) => c.category === category).map(clone);
    },

    search(query = "") {
      const terms = query
        .trim()
        .toLocaleLowerCase()
        .split(/\s+/u)
        .filter(Boolean);

      if (terms.length === 0) {
        return components.map(clone);
      }

      return components
        .filter((component) => {
          const haystack = [
            component.id,
            component.name,
            component.description,
            component.category,
            component.sourceProject,
            ...component.tags,
          ]
            .join(" ")
            .toLocaleLowerCase();
          return terms.every((term) => haystack.includes(term));
        })
        .map(clone);
    },

    createInsertion(id) {
      const component = requireComponent(id);
      const componentPath = `components/openforge-library/${component.fileName}`;

      return clone({
        schemaVersion: 1,
        componentId: component.id,
        import: {
          source: `@/${componentPath.replace(/\.jsx$/u, "")}`,
          imported: component.exportName,
        },
        jsx: `<${component.exportName} />`,
        defaultProps: component.defaultProps,
        files: [
          { path: componentPath, content: component.source },
          {
            path: `components/openforge-library/${component.fileName.replace(/\.jsx$/u, "")}.css`,
            content: component.styles,
          },
        ],
      });
    },
  });
}
