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

export const saasThemeBlockRegistry =
  createCmsBlockRegistry(OFFICIAL_CMS_BLOCKS);

export const saasTheme = createTheme({
  manifest,
  templates: {
    page: PageTemplate,
    post: PostTemplate,
    notFound: NotFoundTemplate,
  },
  blockComponents: saasThemeBlockRegistry.componentsById(),
});
