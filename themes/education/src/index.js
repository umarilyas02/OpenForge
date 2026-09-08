import {
  OFFICIAL_CMS_BLOCKS,
  createCmsBlockRegistry,
} from "@openforge/cms-blocks";
import { createTheme } from "@openforge/theme-sdk";

import { exampleSite } from "./example-site.js";
import { manifest } from "./manifest.js";
import NotFoundTemplate from "./templates/not-found.jsx";
import PageTemplate from "./templates/page.jsx";
import PostTemplate from "./templates/post.jsx";

export const educationThemeBlockRegistry =
  createCmsBlockRegistry(OFFICIAL_CMS_BLOCKS);

export const educationTheme = createTheme({
  manifest,
  templates: {
    page: PageTemplate,
    post: PostTemplate,
    notFound: NotFoundTemplate,
  },
  blockComponents: educationThemeBlockRegistry.componentsById(),
});

export { exampleSite };
