import { invariant } from "./errors.js";

/**
 * A registry of installed themes, keyed by theme ID.
 */
export function createThemeRegistry() {
  const themes = new Map();

  return Object.freeze({
    register(theme) {
      invariant(
        !themes.has(theme.manifest.id),
        "OF_THEME_DUPLICATE",
        `Theme "${theme.manifest.id}" is already registered.`,
        { themeId: theme.manifest.id },
      );
      themes.set(theme.manifest.id, theme);
    },

    get(themeId) {
      const theme = themes.get(themeId);
      invariant(theme, "OF_THEME_NOT_FOUND", `Unknown theme "${themeId}".`, {
        themeId,
      });
      return theme;
    },

    list() {
      return [...themes.values()].map((theme) => theme.manifest);
    },
  });
}
