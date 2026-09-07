import { describe, expect, it } from "vitest";

import {
  LibraryRegistryError,
  allLibraryComponents,
  createLibraryRegistry,
  libraryCategories,
  libraryRegistry,
} from "../src/index.js";

describe("component library registry", () => {
  it("publishes only valid, uniquely identified components", () => {
    const components = libraryRegistry.list();

    expect(components.length).toBe(allLibraryComponents.length);
    expect(new Set(components.map(({ id }) => id)).size).toBe(
      components.length,
    );
    expect(
      components.every(({ category }) => libraryCategories.includes(category)),
    ).toBe(true);
    expect(
      components.every(({ accessibility }) => accessibility.length > 0),
    ).toBe(true);
  });

  it("has no filename collisions within a category", () => {
    const components = libraryRegistry.list();

    for (const category of libraryCategories) {
      const fileNames = components
        .filter((component) => component.category === category)
        .map(({ fileName }) => fileName);
      expect(new Set(fileNames).size).toBe(fileNames.length);
    }
  });

  it("filters by category", () => {
    for (const category of libraryCategories) {
      const results = libraryRegistry.byCategory(category);
      expect(results.every((component) => component.category === category)).toBe(
        true,
      );
    }
  });

  it("creates portable component and stylesheet insertion artifacts", () => {
    const [first] = libraryRegistry.list();
    if (!first) return;

    const insertion = libraryRegistry.createInsertion(first.id);
    expect(insertion.files.map(({ path }) => path)).toEqual([
      `components/openforge-library/${first.fileName}`,
      `components/openforge-library/${first.fileName.replace(/\.jsx$/u, "")}.css`,
    ]);
  });

  it("rejects duplicate definitions and unknown ids", () => {
    const [first] = allLibraryComponents;
    if (!first) return;

    expect(() => createLibraryRegistry([first, first])).toThrowError(
      LibraryRegistryError,
    );
    expect(() => libraryRegistry.get("nav.missing")).toThrowError(
      expect.objectContaining({ code: "OF_LIBRARY_NOT_FOUND" }),
    );
  });
});
