import path from "node:path";

import { cmsAdminEnvSchema, loadEnv } from "@openforge/config";
import { WorkspaceManager } from "@openforge/workspace";

let cachedManager;

/**
 * Lazily create a single shared WorkspaceManager for the process. Each
 * site's real project files live in one subdirectory of SITES_STORAGE_PATH
 * (or ./data/sites if unset), named after the site's slug — this directory
 * is the site's actual content and needs to sit on a persistent volume
 * wherever this app is deployed, the same durability requirement a
 * database would have.
 */
export function getWorkspaceManager() {
  if (!cachedManager) {
    const env = loadEnv({ schema: cmsAdminEnvSchema });
    const basePath = env.SITES_STORAGE_PATH ?? path.resolve("data/sites");
    cachedManager = new WorkspaceManager({ basePath });
  }
  return cachedManager;
}

const PAGE_FILE = /^app\/(.*\/)?page\.jsx$/u;

/**
 * Filters a workspace's full file list down to real Next.js App Router
 * page files, deriving each one's site-relative URL path from its file
 * path (`app/page.jsx` -> "/", `app/about/page.jsx` -> "/about").
 *
 * @param {{ path: string, source: string }[]} files
 */
export function listPages(files) {
  return files
    .filter((file) => PAGE_FILE.test(file.path))
    .map((file) => {
      const segment = file.path
        .replace(/^app\//u, "")
        .replace(/(^|\/)page\.jsx$/u, "");
      const urlPath = segment === "" ? "/" : `/${segment}`;
      return { filePath: file.path, urlPath };
    })
    .sort((a, b) => a.urlPath.localeCompare(b.urlPath));
}
