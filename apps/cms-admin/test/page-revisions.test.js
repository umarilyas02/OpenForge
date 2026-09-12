import { rm } from "node:fs/promises";

import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const BASE_PATH = "./data/test-page-revisions";

vi.mock("../src/lib/site-workspace.js", async () => {
  const { WorkspaceManager } = await import("@openforge/workspace");
  const manager = new WorkspaceManager({ basePath: BASE_PATH });
  return { getWorkspaceManager: () => manager };
});

const { getWorkspaceManager } = await import("../src/lib/site-workspace.js");
const { initSiteGit, listSiteCommits } = await import("../src/lib/site-git.js");
const { buildStarterFiles } = await import("../src/lib/starter-template.js");
const { parsePageToBlockTree } = await import("../src/lib/source-content-tree.js");
const {
  getPageRevisionSource,
  insertTopLevelBlock,
  listPageRevisions,
  restorePageRevision,
  setBlockProps,
} = await import("../src/lib/source-content-actions.js");

const manager = getWorkspaceManager();
const SITE_SLUG = "page-revisions-site";
const PAGE_PATH = "app/page.jsx";

async function currentTree() {
  const files = await manager.readFiles(SITE_SLUG);
  return parsePageToBlockTree(files, PAGE_PATH);
}

async function currentSource() {
  const files = await manager.readFiles(SITE_SLUG);
  return files.find((file) => file.path === PAGE_PATH).source;
}

/**
 * Real coverage for the git-backed revision-history feature: every save in
 * source-content-actions.js already ends in a real `git commit` (see
 * site-git.js's commitSiteChanges), so this real, git-initialized
 * workspace fixture (the same pattern block-add-smoke.test.js uses) is
 * what actually exercises listPageRevisions/getPageRevisionSource/
 * restorePageRevision end to end — a mocked workspace-manager alone
 * wouldn't have git history to read at all.
 */
describe("page revision history — real git log on a real workspace", () => {
  let starterSource;

  beforeAll(async () => {
    await rm(BASE_PATH, { force: true, recursive: true });
    const files = await buildStarterFiles({
      name: "Page Revisions Site",
      slug: SITE_SLUG,
    });
    await manager.create(SITE_SLUG, files);
    const { rootPath } = await manager.describe(SITE_SLUG);
    await initSiteGit(rootPath);
    starterSource = files.find((file) => file.path === PAGE_PATH).source;
  });

  afterAll(async () => {
    await rm(BASE_PATH, { force: true, recursive: true });
  });

  it("starts with no revisions until the workspace's own first commit", async () => {
    // buildStarterFiles + manager.create write the files to disk directly;
    // initSiteGit only initializes the repo, it doesn't commit anything on
    // its own -- exactly like a real newly created site before its first
    // edit.
    expect(await listPageRevisions(SITE_SLUG, PAGE_PATH)).toEqual([]);
  });

  it("lists one real revision per save, newest first", async () => {
    await insertTopLevelBlock(SITE_SLUG, PAGE_PATH, "openforge-cms.cta");
    const afterFirstInsert = await currentSource();

    const before = await currentTree();
    const hero = before.find((node) => node.blockId === "openforge-cms.hero");
    await setBlockProps(SITE_SLUG, PAGE_PATH, hero.id, {
      ...hero.props,
      heading: "Revised heading",
    });
    const afterPropEdit = await currentSource();

    const revisions = await listPageRevisions(SITE_SLUG, PAGE_PATH);
    expect(revisions.length).toBeGreaterThanOrEqual(2);
    // Newest first: the most recent save's commit message leads.
    expect(revisions[0].message).toMatch(/Edit openforge-cms\.hero/);
    expect(revisions.every((revision) => /^[0-9a-f]{4,40}$/u.test(revision.hash))).toBe(
      true,
    );

    // Sanity for the next tests: the two intermediate sources really do
    // differ from each other and from the pristine starter source.
    expect(afterFirstInsert).not.toBe(starterSource);
    expect(afterPropEdit).not.toBe(afterFirstInsert);
  });

  it("getPageRevisionSource returns the exact historical source for an older commit", async () => {
    const revisions = await listPageRevisions(SITE_SLUG, PAGE_PATH);
    // insertTopLevelBlock's own final commit -- the one that actually adds
    // the <Cta> element to the tree (a first-use insert also commits a
    // separate, earlier "Import ... on app/page.jsx" step before this one,
    // which touches the page file too but doesn't have the element yet).
    const insertCommit = revisions.find((revision) =>
      revision.message.startsWith("Add openforge-cms.cta to"),
    );
    expect(insertCommit).toBeDefined();

    const historicalSource = await getPageRevisionSource(
      SITE_SLUG,
      PAGE_PATH,
      insertCommit.hash,
    );
    // That commit predates the later heading edit.
    expect(historicalSource).not.toContain("Revised heading");
    expect(
      parsePageToBlockTree(
        [{ path: PAGE_PATH, source: historicalSource }],
        PAGE_PATH,
      ).map((node) => node.blockId),
    ).toEqual(["openforge-cms.hero", "openforge-cms.rich-text", "openforge-cms.cta"]);
  });

  it("rejects a revision id that isn't a plausible commit hash", async () => {
    await expect(
      getPageRevisionSource(SITE_SLUG, PAGE_PATH, "--upload-pack=x"),
    ).rejects.toThrow(/invalid revision/i);
    await expect(
      restorePageRevision(SITE_SLUG, PAGE_PATH, "not-a-hash"),
    ).rejects.toThrow(/invalid revision/i);
  });

  it("restorePageRevision writes the older content back as current, through the real save+commit path, round-tripping through the same parser as any other save", async () => {
    const revisionsBefore = await listPageRevisions(SITE_SLUG, PAGE_PATH);
    // The commit that actually placed the <Cta> element in the tree (not
    // the still-older "Import ... on app/page.jsx" commit, which predates
    // the element existing at all).
    const target = revisionsBefore.find((revision) =>
      revision.message.startsWith("Add openforge-cms.cta to"),
    );
    expect(target).toBeDefined();
    const expectedSource = await getPageRevisionSource(
      SITE_SLUG,
      PAGE_PATH,
      target.hash,
    );

    const restoredSource = await restorePageRevision(
      SITE_SLUG,
      PAGE_PATH,
      target.hash,
    );
    expect(restoredSource).toBe(expectedSource);

    // The live page file itself now matches -- and, critically, it still
    // parses into a real block tree through the exact same
    // parsePageToBlockTree pipeline every other read of this page uses.
    const tree = await currentTree();
    expect(tree.map((node) => node.blockId)).toEqual([
      "openforge-cms.hero",
      "openforge-cms.rich-text",
      "openforge-cms.cta",
    ]);
    const hero = tree.find((node) => node.blockId === "openforge-cms.hero");
    expect(hero.props.heading).not.toBe("Revised heading");

    // Restoring is a new commit on top of history, not a rewrite of the
    // past: the revision list grows by exactly one, and the old commits
    // are all still there underneath it.
    const revisionsAfter = await listPageRevisions(SITE_SLUG, PAGE_PATH);
    expect(revisionsAfter.length).toBe(revisionsBefore.length + 1);
    expect(revisionsAfter[0].message).toContain("Restore");
    expect(revisionsAfter[0].message).toContain(target.hash);
    expect(revisionsAfter.slice(1).map((revision) => revision.hash)).toEqual(
      revisionsBefore.map((revision) => revision.hash),
    );

    // The site-wide commit log reflects the same real commit, too --
    // proving this went through commitSiteChanges rather than a raw file
    // write that bypassed git entirely.
    const { rootPath } = await manager.describe(SITE_SLUG);
    const siteCommits = await listSiteCommits(rootPath, 1);
    expect(siteCommits[0].message).toBe(revisionsAfter[0].message);
  });

  it("restorePageRevision rejects a real commit that never contained the requested path", async () => {
    const [{ hash: realCommitHash }] = await listPageRevisions(
      SITE_SLUG,
      PAGE_PATH,
    );
    // The hash is a real, existing commit -- just not one that ever touched
    // this (nonexistent) page path, so readFileAtCommit resolves it and
    // correctly finds nothing rather than erroring on the ref itself.
    await expect(
      restorePageRevision(SITE_SLUG, "app/never-existed.jsx", realCommitHash),
    ).rejects.toThrow(/does not contain/i);
  });
});
