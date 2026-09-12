import { rm } from "node:fs/promises";

import { libraryRegistry } from "@openforge/component-library";
import { renderToStaticMarkup } from "react-dom/server";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const BASE_PATH = "./data/test-library-component-insert";

vi.mock("../src/lib/site-workspace.js", async () => {
  const { WorkspaceManager } = await import("@openforge/workspace");
  const manager = new WorkspaceManager({ basePath: BASE_PATH });
  return { getWorkspaceManager: () => manager };
});

const { getWorkspaceManager } = await import("../src/lib/site-workspace.js");
const { initSiteGit, listSiteCommits } = await import("../src/lib/site-git.js");
const { buildStarterFiles } = await import("../src/lib/starter-template.js");
const { parsePageToBlockTree } = await import(
  "../src/lib/source-content-tree.js"
);
const {
  serializeLibraryCatalog,
  ensureLibraryComponentAvailable,
  insertLibraryComponent,
} = await import("../src/lib/library-content-actions.js");

const manager = getWorkspaceManager();
const SITE_SLUG = "library-component-insert-site";
const PAGE_PATH = "app/page.jsx";

/**
 * Proves the Blocks tab's "insert from @openforge/component-library" path
 * (LibraryPalette -> insertLibraryComponentAction -> insertLibraryComponent)
 * actually produces a working page, against a real git-backed workspace —
 * the same way block-add-smoke.test.js proves the native-block insert path.
 *
 * This is the coverage flagged missing in agents/progress.md's Blockers
 * entry for CMS.14: the feature was wired end-to-end (route -> action ->
 * CanvasEditor -> LibraryPalette) but had no test proving the write path
 * itself produces valid, renderable output. It didn't: every harvested
 * component in packages/component-library is a *named* export
 * (`export function ComponentName`, never `export default`), but
 * ensureLibraryComponentAvailable generated a *default* import for it. A
 * default import from a module with no default export resolves to
 * `undefined`, so `<ComponentName />` in the page would have thrown
 * "Element type is invalid" the moment Next.js actually rendered the page
 * (this suite's `renderToStaticMarkup` call below reproduces exactly that
 * crash against the pre-fix code). Fixed by importing it as a named import
 * instead, matching what the harvested source files actually export.
 */
describe("inserting a library component from the Blocks tab actually works end-to-end", () => {
  beforeAll(async () => {
    await rm(BASE_PATH, { force: true, recursive: true });
    const files = await buildStarterFiles({
      name: "Library Component Insert Site",
      slug: SITE_SLUG,
    });
    await manager.create(SITE_SLUG, files);
    const { rootPath } = await manager.describe(SITE_SLUG);
    await initSiteGit(rootPath);
  });

  afterAll(async () => {
    await rm(BASE_PATH, { force: true, recursive: true });
  });

  it("serializeLibraryCatalog exposes the full 47-entry catalog without shipping full source", () => {
    const catalog = serializeLibraryCatalog();
    expect(catalog.length).toBe(libraryRegistry.list().length);
    for (const entry of catalog) {
      expect(entry).not.toHaveProperty("source");
      expect(entry).not.toHaveProperty("styles");
      expect(entry.id).toEqual(expect.any(String));
      expect(entry.category).toEqual(expect.any(String));
    }
  });

  it("inserting a component (blog.card-grid) writes real files, a real import, and a page that actually renders", async () => {
    const componentId = "blog.card-grid";
    const component = libraryRegistry.get(componentId);

    await insertLibraryComponent(SITE_SLUG, PAGE_PATH, componentId);

    const files = await manager.readFiles(SITE_SLUG);
    const componentFile = files.find(
      (file) => file.path === "components/openforge-library/BlogCardGrid.jsx",
    );
    const stylesFile = files.find(
      (file) => file.path === "components/openforge-library/BlogCardGrid.css",
    );
    expect(componentFile).toBeDefined();
    expect(stylesFile).toBeDefined();
    expect(componentFile.source).toContain('import "./BlogCardGrid.css";');
    expect(componentFile.source).toContain("export function BlogCardGrid");
    expect(stylesFile.source).toBe(component.styles);

    const pageSource = files.find((file) => file.path === PAGE_PATH).source;
    // Must be a *named* import — the harvested component has no default
    // export, so a default import would silently resolve to undefined.
    expect(pageSource).toMatch(
      /import\s*\{\s*BlogCardGrid\s*\}\s*from\s*["'].*BlogCardGrid\.jsx["']/,
    );
    expect(pageSource).not.toMatch(/import\s+BlogCardGrid\s+from/);
    expect(pageSource).toContain("<BlogCardGrid");

    // A library component is deliberately not part of the block tree (see
    // LibraryPalette's own "known gap" note) — confirm parsing the page
    // still succeeds and simply omits it, rather than throwing.
    expect(() => parsePageToBlockTree(files, PAGE_PATH)).not.toThrow();
    const tree = parsePageToBlockTree(files, PAGE_PATH);
    expect(tree.some((node) => node.blockId === componentId)).toBe(false);

    // The real proof this renders in the site's actual output: import the
    // freshly-written component file exactly as the real Next.js page
    // would (a named import) and render it. Before the fix, the page
    // itself used a default import that resolved to `undefined`, which
    // React would refuse to render ("Element type is invalid").
    const { rootPath } = await manager.describe(SITE_SLUG);
    const mod = await import(
      /* @vite-ignore */ `${rootPath.replace(/\\/g, "/")}/components/openforge-library/BlogCardGrid.jsx`
    );
    expect(mod.BlogCardGrid).toBeDefined();
    expect(mod.default).toBeUndefined();
    const html = renderToStaticMarkup(
      mod.BlogCardGrid(component.defaultProps),
    );
    expect(html).toContain("From the blog");
  });

  it("is idempotent: inserting the same component twice reuses the existing files/import and appends a second call", async () => {
    const componentId = "hero.split-image-blobs";
    await insertLibraryComponent(SITE_SLUG, PAGE_PATH, componentId);
    const filesAfterFirst = await manager.readFiles(SITE_SLUG);
    const sourceAfterFirst = filesAfterFirst.find(
      (file) => file.path === PAGE_PATH,
    ).source;
    const firstCallCount = sourceAfterFirst.split("<SplitImageHero").length - 1;
    expect(firstCallCount).toBe(1);

    // A second, independent insert of the same catalog entry: it must not
    // re-copy the component/styles files or duplicate the import, but it
    // does append a second JSX call.
    await ensureLibraryComponentAvailable(SITE_SLUG, PAGE_PATH, componentId);
    const filesAfterEnsure = await manager.readFiles(SITE_SLUG);
    const importCount = (
      filesAfterEnsure.find((file) => file.path === PAGE_PATH).source.match(
        /SplitImageHero/gu,
      ) ?? []
    ).length;

    await insertLibraryComponent(SITE_SLUG, PAGE_PATH, componentId);
    const filesAfterSecond = await manager.readFiles(SITE_SLUG);
    const sourceAfterSecond = filesAfterSecond.find(
      (file) => file.path === PAGE_PATH,
    ).source;
    const secondCallCount =
      sourceAfterSecond.split("<SplitImageHero").length - 1;
    expect(secondCallCount).toBe(2);
    // Only one import statement for the component regardless of how many
    // times it's inserted on the same page.
    expect(
      sourceAfterSecond.match(/from ["'].*SplitImageHero\.jsx["']/gu)?.length,
    ).toBe(1);
    expect(importCount).toBeGreaterThan(0);
  });

  it("commits each step as real, git-backed workspace changes", async () => {
    const { rootPath } = await manager.describe(SITE_SLUG);
    const commits = await listSiteCommits(rootPath, 50);
    const messages = commits.map((commit) => commit.message);
    expect(messages.some((m) => m.includes("Add blog.card-grid"))).toBe(true);
    expect(
      messages.some((m) => m.includes("Import blog.card-grid on app/page.jsx")),
    ).toBe(true);
    expect(
      messages.some((m) => m.includes("Add hero.split-image-blobs")),
    ).toBe(true);
  });
});
