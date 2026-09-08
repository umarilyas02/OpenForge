import {
  OFFICIAL_CMS_BLOCKS,
  createCmsBlockRegistry,
} from "@openforge/cms-blocks";
import { createTheme } from "@openforge/theme-sdk";

import { manifest } from "./manifest.js";
import NotFoundTemplate from "./templates/not-found.jsx";
import PageTemplate from "./templates/page.jsx";
import PostTemplate from "./templates/post.jsx";

export { exampleSite } from "./example-site.js";

export const nonprofitThemeBlockRegistry =
  createCmsBlockRegistry(OFFICIAL_CMS_BLOCKS);

export const nonprofitTheme = createTheme({
  manifest,
  templates: {
    page: PageTemplate,
    post: PostTemplate,
    notFound: NotFoundTemplate,
  },
  blockComponents: nonprofitThemeBlockRegistry.componentsById(),
});
