import { rm } from "node:fs/promises";

import { createRenderer } from "@openforge/renderer";
import { defaultTheme, defaultThemeBlockRegistry } from "@openforge/theme-default";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const BASE_PATH = "./data/test-block-add-smoke";

vi.mock("../src/lib/site-workspace.js", async () => {
  const { WorkspaceManager } = await import("@openforge/workspace");
  const manager = new WorkspaceManager({ basePath: BASE_PATH });
  return { getWorkspaceManager: () => manager };
});

const { getWorkspaceManager } = await import("../src/lib/site-workspace.js");
const { initSiteGit } = await import("../src/lib/site-git.js");
const { buildStarterFiles } = await import("../src/lib/starter-template.js");
const { findPageRootNodeId, parsePageToBlockTree } = await import(
  "../src/lib/source-content-tree.js"
);
const { insertBlock } = await import("../src/lib/source-content-actions.js");

const manager = getWorkspaceManager();
const SITE_SLUG = "block-add-smoke-site";
const PAGE_PATH = "app/page.jsx";

/**
 * A regression guard for the exact failure the admin's canvas hit in
 * production: clicking a block in the "Add Block" palette writes the
 * block's `defaultProps` straight into the page's source file (see
 * insertBlock / renderBlockJsx in source-content-actions.js) with nothing
 * else — no user-supplied values yet. If any official block's own
 * `defaultProps` doesn't already satisfy its own required editableFields,
 * the freshly-inserted instance is invalid the instant it's added, and
 * @openforge/renderer's renderTree/renderNode throws on it — which the
 * admin's canvas.page.jsx used to render as one error blanking the entire
 * page (see the render-isolation fix there).
 *
 * @openforge/cms-blocks's own test suite already checks, fast and for every
 * one of the 38 official blocks, that `defaultProps` alone satisfies
 * `validateProps` — that's the comprehensive regression guard for the
 * defaultProps bug itself. What's unique here is proving the *admin's real
 * insert pipeline* (a real git-backed file workspace, the compiler's
 * insert-jsx operation, re-parsing the resulting source back into a tree)
 * produces something that renders — so this only needs a representative
 * sample, not all 38: a plain block (rich-text), one with an image/url
 * field (image), one with two required fields (cta), one that's the first
 * use of its component on the page and thus also exercises the add-import
 * path (hero is already imported by the starter template, so pick
 * something that isn't), and a slot-bearing pair (accordion + a faq-item
 * inserted into its slot). Running all 38 here would repeat real `git
 * commit` calls 38 times (~85s) for coverage @openforge/cms-blocks already
 * has cheaply.
 */
describe("adding a block from the palette actually works end-to-end", () => {
  beforeAll(async () => {
    await rm(BASE_PATH, { force: true, recursive: true });
    const files = await buildStarterFiles({
      name: "Block Add Smoke Site",
      slug: SITE_SLUG,
    });
    await manager.create(SITE_SLUG, files);
    const { rootPath } = await manager.describe(SITE_SLUG);
    await initSiteGit(rootPath);
  });

  afterAll(async () => {
    await rm(BASE_PATH, { force: true, recursive: true });
  });

  const renderer = createRenderer({
    theme: defaultTheme,
    blockRegistry: defaultThemeBlockRegistry,
  });

  async function insertAndRender(blockId, containerNodeId) {
    await insertBlock(SITE_SLUG, PAGE_PATH, blockId, containerNodeId);
    const files = await manager.readFiles(SITE_SLUG);
    const tree = parsePageToBlockTree(files, PAGE_PATH);
    return { tree, files };
  }

  it.each([
    "openforge-cms.rich-text",
    "openforge-cms.image",
    "openforge-cms.cta",
  ])(
    "%s can be inserted at the top level from the palette and renders without throwing",
    async (blockId) => {
      const beforeFiles = await manager.readFiles(SITE_SLUG);
      const containerNodeId = findPageRootNodeId(beforeFiles, PAGE_PATH);

      const { tree } = await insertAndRender(blockId, containerNodeId);
      const inserted = tree.find((node) => node.blockId === blockId);
      expect(inserted).toBeDefined();
      expect(() =>
        renderer.renderNode(inserted, [tree.indexOf(inserted)]),
      ).not.toThrow();
    },
  );

  it("a slot-bearing block (accordion) and a block inserted into its slot (faq-item) both render", async () => {
    const beforeFiles = await manager.readFiles(SITE_SLUG);
    const rootId = findPageRootNodeId(beforeFiles, PAGE_PATH);

    const { tree: afterAccordion } = await insertAndRender(
      "openforge-cms.accordion",
      rootId,
    );
    const accordion = afterAccordion.find(
      (node) => node.blockId === "openforge-cms.accordion",
    );
    expect(accordion).toBeDefined();

    const { tree: afterFaqItem } = await insertAndRender(
      "openforge-cms.faq-item",
      accordion.id,
    );
    const finalAccordion = afterFaqItem.find(
      (node) => node.blockId === "openforge-cms.accordion",
    );
    expect(finalAccordion.slots.items).toHaveLength(1);
    expect(finalAccordion.slots.items[0].blockId).toBe("openforge-cms.faq-item");

    expect(() =>
      renderer.renderNode(finalAccordion, [afterFaqItem.indexOf(finalAccordion)]),
    ).not.toThrow();
  });
});
