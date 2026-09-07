export {
  LIBRARY_SCHEMA_VERSION,
  libraryCategories,
  libraryComponentSchema,
  parseLibraryComponent,
} from "./schema.js";
export { LibraryRegistryError, createLibraryRegistry } from "./registry.js";

export { navComponents } from "./nav.js";
export { footerComponents } from "./footer.js";
export { heroComponents } from "./hero.js";
export { blogComponents } from "./blog.js";
export { productComponents } from "./product.js";
export { gridComponents } from "./grid.js";
export { customComponents } from "./custom.js";

import { navComponents } from "./nav.js";
import { footerComponents } from "./footer.js";
import { heroComponents } from "./hero.js";
import { blogComponents } from "./blog.js";
import { productComponents } from "./product.js";
import { gridComponents } from "./grid.js";
import { customComponents } from "./custom.js";
import { createLibraryRegistry } from "./registry.js";

export const allLibraryComponents = [
  ...navComponents,
  ...footerComponents,
  ...heroComponents,
  ...blogComponents,
  ...productComponents,
  ...gridComponents,
  ...customComponents,
];

export const libraryRegistry = createLibraryRegistry(allLibraryComponents);
