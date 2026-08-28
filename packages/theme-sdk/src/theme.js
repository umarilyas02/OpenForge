import { invariant } from "./errors.js";
import { parseThemeManifest } from "./schema.js";

/**
 * Build a validated theme: a manifest plus its real template components and
 * the real block components it registers per region. Every declared
 * template and every block referenced by a region must actually be
 * provided, so a broken theme fails at registration time, not at render
 * time for some random visitor.
 *
 * @param {{ manifest: unknown, templates: Record<string, Function>, blockComponents: Record<string, Function> }} options
 */
export function createTheme({ manifest, templates, blockComponents }) {
  const parsedManifest = parseThemeManifest(manifest);

  for (const templateName of parsedManifest.templateNames) {
    invariant(
      typeof templates[templateName] === "function",
      "OF_THEME_TEMPLATE_MISSING",
      `Theme "${parsedManifest.id}" is missing its "${templateName}" template component.`,
      { themeId: parsedManifest.id, templateName },
    );
  }

  for (const region of parsedManifest.regions) {
    for (const blockId of region.allowedBlockIds) {
      invariant(
        typeof blockComponents[blockId] === "function",
        "OF_THEME_BLOCK_COMPONENT_MISSING",
        `Theme "${parsedManifest.id}" region "${region.key}" references unknown block component "${blockId}".`,
        { themeId: parsedManifest.id, region: region.key, blockId },
      );
    }
  }

  const regionsByKey = new Map(
    parsedManifest.regions.map((region) => [region.key, region]),
  );

  return Object.freeze({
    manifest: parsedManifest,

    getTemplate(name) {
      invariant(
        typeof templates[name] === "function",
        "OF_THEME_TEMPLATE_MISSING",
        `Unknown template "${name}".`,
        { themeId: parsedManifest.id, templateName: name },
      );
      return templates[name];
    },

    getRegion(key) {
      const region = regionsByKey.get(key);
      invariant(region, "OF_THEME_REGION_UNKNOWN", `Unknown region "${key}".`, {
        themeId: parsedManifest.id,
        region: key,
      });
      return region;
    },

    isBlockAllowedInRegion(regionKey, blockId) {
      return (
        regionsByKey.get(regionKey)?.allowedBlockIds.includes(blockId) ?? false
      );
    },

    getBlockComponent(blockId) {
      const component = blockComponents[blockId];
      invariant(
        component,
        "OF_THEME_BLOCK_COMPONENT_MISSING",
        `Unknown block component "${blockId}".`,
        { themeId: parsedManifest.id, blockId },
      );
      return component;
    },
  });
}
