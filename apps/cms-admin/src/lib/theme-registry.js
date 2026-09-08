import { OFFICIAL_CMS_BLOCKS, createCmsBlockRegistry } from "@openforge/cms-blocks";
import { createThemeRegistry } from "@openforge/theme-sdk";
import { agencyTheme } from "@openforge/theme-agency";
import { defaultTheme } from "@openforge/theme-default";
import { ecommerceTheme } from "@openforge/theme-ecommerce";
import { educationTheme } from "@openforge/theme-education";
import { healthcareTheme } from "@openforge/theme-healthcare";
import { magazineTheme } from "@openforge/theme-magazine";
import { nonprofitTheme } from "@openforge/theme-nonprofit";
import { portfolioTheme } from "@openforge/theme-portfolio";
import { realestateTheme } from "@openforge/theme-realestate";
import { restaurantTheme } from "@openforge/theme-restaurant";
import { saasTheme } from "@openforge/theme-saas";

export const DEFAULT_THEME_ID = "openforge-theme.default";

/**
 * Every theme registers its own block components, but they're always the
 * same full official set (see each theme's src/index.js) -- so a single
 * shared CMS block registry (migrate/validate) works for rendering with
 * any of them. Only `theme` itself (manifest, templates, token overrides)
 * actually varies per site.
 */
export const cmsBlockRegistry = createCmsBlockRegistry(OFFICIAL_CMS_BLOCKS);

export const themeRegistry = createThemeRegistry();

for (const theme of [
  defaultTheme,
  saasTheme,
  portfolioTheme,
  ecommerceTheme,
  restaurantTheme,
  agencyTheme,
  healthcareTheme,
  educationTheme,
  nonprofitTheme,
  realestateTheme,
  magazineTheme,
]) {
  themeRegistry.register(theme);
}

/**
 * @param {string | null | undefined} themeId
 */
export function getTheme(themeId) {
  if (themeId && themeId !== DEFAULT_THEME_ID) {
    try {
      return themeRegistry.get(themeId);
    } catch {
      // Falls through to the default theme below -- an uninstalled/removed
      // theme id should degrade gracefully, not break the site.
    }
  }
  return themeRegistry.get(DEFAULT_THEME_ID);
}
