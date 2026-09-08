import {
  LayoutGrid,
  LayoutTemplate,
  Menu,
  Newspaper,
  PanelBottom,
  ShoppingBag,
  Sparkles,
} from "lucide-react";

/** Icon + display order for @openforge/component-library's fixed category list (see libraryCategories in packages/component-library/src/schema.js). */
const LIBRARY_CATEGORY_META = {
  nav: { label: "Nav", icon: Menu },
  footer: { label: "Footer", icon: PanelBottom },
  hero: { label: "Hero", icon: LayoutTemplate },
  blog: { label: "Blog", icon: Newspaper },
  product: { label: "Product", icon: ShoppingBag },
  grid: { label: "Grid", icon: LayoutGrid },
  custom: { label: "Custom", icon: Sparkles },
};

const CATEGORY_ORDER = ["nav", "hero", "grid", "product", "blog", "footer", "custom"];

export function getLibraryCategoryMeta(category) {
  return LIBRARY_CATEGORY_META[category] ?? { label: category, icon: Sparkles };
}

/**
 * Group a filtered library catalog into categories, in a fixed display
 * order (falling back to any unmapped category at the end).
 *
 * @param {object[]} components
 */
export function groupLibraryByCategory(components) {
  const byCategory = new Map();
  for (const component of components) {
    if (!byCategory.has(component.category)) byCategory.set(component.category, []);
    byCategory.get(component.category).push(component);
  }

  const order = [
    ...CATEGORY_ORDER.filter((category) => byCategory.has(category)),
    ...[...byCategory.keys()].filter((category) => !CATEGORY_ORDER.includes(category)),
  ];

  return order.map((category) => ({
    category,
    items: byCategory.get(category),
  }));
}
