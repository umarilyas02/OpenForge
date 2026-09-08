import {
  OFFICIAL_CMS_BLOCKS,
  createCmsBlockRegistry,
} from "@openforge/cms-blocks";
import { createTheme } from "@openforge/theme-sdk";

import { manifest } from "./manifest.js";
import NotFoundTemplate from "./templates/not-found.jsx";
import PageTemplate from "./templates/page.jsx";
import PostTemplate from "./templates/post.jsx";

export const portfolioThemeBlockRegistry =
  createCmsBlockRegistry(OFFICIAL_CMS_BLOCKS);

export const portfolioTheme = createTheme({
  manifest,
  templates: {
    page: PageTemplate,
    post: PostTemplate,
    notFound: NotFoundTemplate,
  },
  blockComponents: portfolioThemeBlockRegistry.componentsById(),
});

export { exampleFooter, exampleSite } from "./example-site.js";
export { manifest };
