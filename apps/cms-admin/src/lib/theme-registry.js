import { OFFICIAL_CMS_BLOCKS, createCmsBlockRegistry } from "@openforge/cms-blocks";
import { createThemeRegistry } from "@openforge/theme-sdk";
import { agencyTheme, exampleSite as agencyExampleSite } from "@openforge/theme-agency";
import {
  automotiveTheme,
  exampleSite as automotiveExampleSite,
} from "@openforge/theme-automotive";
import { beautyTheme, exampleSite as beautyExampleSite } from "@openforge/theme-beauty";
import {
  constructionTheme,
  exampleSite as constructionExampleSite,
} from "@openforge/theme-construction";
import { defaultTheme } from "@openforge/theme-default";
import {
  ecommerceTheme,
  exampleSite as ecommerceExampleSite,
} from "@openforge/theme-ecommerce";
import {
  educationTheme,
  exampleSite as educationExampleSite,
} from "@openforge/theme-education";
import { eventsTheme, exampleSite as eventsExampleSite } from "@openforge/theme-events";
import { exampleSite as financeExampleSite, financeTheme } from "@openforge/theme-finance";
import { exampleSite as fitnessExampleSite, fitnessTheme } from "@openforge/theme-fitness";
import {
  exampleSite as healthcareExampleSite,
  healthcareTheme,
} from "@openforge/theme-healthcare";
import { exampleSite as legalExampleSite, legalTheme } from "@openforge/theme-legal";
import {
  exampleSite as magazineExampleSite,
  magazineTheme,
} from "@openforge/theme-magazine";
import { exampleSite as musicExampleSite, musicTheme } from "@openforge/theme-music";
import {
  exampleSite as nonprofitExampleSite,
  nonprofitTheme,
} from "@openforge/theme-nonprofit";
import {
  exampleSite as photographyExampleSite,
  photographyTheme,
} from "@openforge/theme-photography";
import {
  exampleSite as portfolioExampleSite,
  portfolioTheme,
} from "@openforge/theme-portfolio";
import {
  exampleSite as realestateExampleSite,
  realestateTheme,
} from "@openforge/theme-realestate";
import {
  exampleSite as restaurantExampleSite,
  restaurantTheme,
} from "@openforge/theme-restaurant";
import { exampleSite as saasExampleSite, saasTheme } from "@openforge/theme-saas";
import { exampleSite as travelExampleSite, travelTheme } from "@openforge/theme-travel";

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

/**
 * `theme.exampleSite` isn't a thing -- `createTheme()`'s return value has
 * no such field, and `exampleSite` is a separate named export per theme
 * package. Tracked here, alongside the theme, keyed by manifest id. The
 * default theme has none (it predates the example-site kits and is the
 * "start from a blank starter" option); every other theme has one built
 * for it -- see each theme's own src/example-site.js.
 */
const EXAMPLE_SITES_BY_THEME_ID = {
  "openforge-theme.saas": saasExampleSite,
  "openforge-theme.portfolio": portfolioExampleSite,
  "openforge-theme.ecommerce": ecommerceExampleSite,
  "openforge-theme.restaurant": restaurantExampleSite,
  "openforge-theme.agency": agencyExampleSite,
  "openforge-theme.healthcare": healthcareExampleSite,
  "openforge-theme.education": educationExampleSite,
  "openforge-theme.nonprofit": nonprofitExampleSite,
  "openforge-theme.realestate": realestateExampleSite,
  "openforge-theme.magazine": magazineExampleSite,
  "openforge-theme.fitness": fitnessExampleSite,
  "openforge-theme.legal": legalExampleSite,
  "openforge-theme.photography": photographyExampleSite,
  "openforge-theme.finance": financeExampleSite,
  "openforge-theme.travel": travelExampleSite,
  "openforge-theme.events": eventsExampleSite,
  "openforge-theme.construction": constructionExampleSite,
  "openforge-theme.beauty": beautyExampleSite,
  "openforge-theme.automotive": automotiveExampleSite,
  "openforge-theme.music": musicExampleSite,
};

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
  fitnessTheme,
  legalTheme,
  photographyTheme,
  financeTheme,
  travelTheme,
  eventsTheme,
  constructionTheme,
  beautyTheme,
  automotiveTheme,
  musicTheme,
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

/**
 * @param {string} themeId
 * @returns {unknown | null} the theme's raw exampleSite export, or null if
 *   it doesn't have one (currently just the Default theme).
 */
export function getExampleSiteFor(themeId) {
  return EXAMPLE_SITES_BY_THEME_ID[themeId] ?? null;
}
