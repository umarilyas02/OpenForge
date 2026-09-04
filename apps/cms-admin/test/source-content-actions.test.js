import { rm } from "node:fs/promises";

import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const BASE_PATH = "./data/test-source-content-actions";

vi.mock("../src/lib/site-workspace.js", async () => {
  const { WorkspaceManager } = await import("@openforge/workspace");
  const manager = new WorkspaceManager({ basePath: BASE_PATH });
  return { getWorkspaceManager: () => manager };
});

const { getWorkspaceManager } = await import("../src/lib/site-workspace.js");
const { buildStarterFiles } = await import("../src/lib/starter-template.js");
const { findNodeById, parsePageToBlockTree } =
  await import("../src/lib/source-content-tree.js");
const {
  insertBlock,
  insertTopLevelBlock,
  moveBlock,
  removeBlock,
  setBlockProps,
} = await import("../src/lib/source-content-actions.js");

const manager = getWorkspaceManager();
const SITE_SLUG = "write-integration-site";
const PAGE_PATH = "app/page.jsx";

async function currentTree() {
  const files = await manager.readFiles(SITE_SLUG);
  return parsePageToBlockTree(files, PAGE_PATH);
}

describe("source-content-actions — real files on a real workspace", () => {
  beforeAll(async () => {
    await rm(BASE_PATH, { force: true, recursive: true });
    const files = await buildStarterFiles({
      name: "Write Integration Site",
      slug: SITE_SLUG,
    });
    await manager.create(SITE_SLUG, files);
  });

  afterAll(async () => {
    await rm(BASE_PATH, { force: true, recursive: true });
  });

  it("starts with the starter template's two top-level blocks", async () => {
    const tree = await currentTree();
    expect(tree.map((node) => node.blockId)).toEqual([
      "openforge-cms.hero",
      "openforge-cms.rich-text",
    ]);
  });

  it("insertTopLevelBlock appends a new block with its default props, copying in its component file", async () => {
    await insertTopLevelBlock(SITE_SLUG, PAGE_PATH, "openforge-cms.cta");

    const tree = await currentTree();
    expect(tree.map((node) => node.blockId)).toEqual([
      "openforge-cms.hero",
      "openforge-cms.rich-text",
      "openforge-cms.cta",
    ]);

    const files = await manager.readFiles(SITE_SLUG);
    expect(
      files.some((file) => file.path === "components/openforge/cta.jsx"),
    ).toBe(true);
  });

  it("setBlockProps changes only the requested keys, leaving other props alone", async () => {
    const before = await currentTree();
    const hero = before.find((node) => node.blockId === "openforge-cms.hero");

    await setBlockProps(SITE_SLUG, PAGE_PATH, hero.id, {
      ...hero.props,
      heading: "Updated heading",
    });

    const after = await currentTree();
    const updatedHero = after.find(
      (node) => node.blockId === "openforge-cms.hero",
    );
    expect(updatedHero.props.heading).toBe("Updated heading");
    expect(updatedHero.props.ctaLabel).toBe(hero.props.ctaLabel);
    expect(updatedHero.props.ctaHref).toBe(hero.props.ctaHref);
  });

  it("moveBlock reorders top-level blocks", async () => {
    const before = await currentTree();
    const richText = before.find(
      (node) => node.blockId === "openforge-cms.rich-text",
    );
    const hero = before.find((node) => node.blockId === "openforge-cms.hero");

    await moveBlock(SITE_SLUG, PAGE_PATH, richText.id, hero.id, "before");

    const after = await currentTree();
    expect(after.map((node) => node.blockId)).toEqual([
      "openforge-cms.rich-text",
      "openforge-cms.hero",
      "openforge-cms.cta",
    ]);
  });

  it("removeBlock deletes the targeted block only", async () => {
    const before = await currentTree();
    const cta = before.find((node) => node.blockId === "openforge-cms.cta");

    await removeBlock(SITE_SLUG, PAGE_PATH, cta.id);

    const after = await currentTree();
    expect(after.map((node) => node.blockId)).toEqual([
      "openforge-cms.rich-text",
      "openforge-cms.hero",
    ]);
  });

  it("insertBlock into a slot-bearing block's own node id populates that slot", async () => {
    await insertTopLevelBlock(SITE_SLUG, PAGE_PATH, "openforge-cms.accordion");
    let tree = await currentTree();
    const accordion = tree.find(
      (node) => node.blockId === "openforge-cms.accordion",
    );
    expect(accordion.slots.items).toEqual([]);

    // Each call needs a *current* container id: the first insert adds the
    // faq-item import (first use on this page), which shifts every other
    // node id in the file, including the accordion's own.
    await insertBlock(
      SITE_SLUG,
      PAGE_PATH,
      "openforge-cms.faq-item",
      accordion.id,
    );
    tree = await currentTree();
    const accordionAfterFirstInsert = tree.find(
      (node) => node.blockId === "openforge-cms.accordion",
    );
    await insertBlock(
      SITE_SLUG,
      PAGE_PATH,
      "openforge-cms.faq-item",
      accordionAfterFirstInsert.id,
    );

    tree = await currentTree();
    const updatedAccordion = tree.find(
      (node) => node.blockId === "openforge-cms.accordion",
    );
    expect(updatedAccordion.slots.items).toHaveLength(2);
    expect(updatedAccordion.slots.items[0].blockId).toBe(
      "openforge-cms.faq-item",
    );
  });

  it("rejects a container id that no longer resolves, instead of silently inserting into the wrong place", async () => {
    await expect(
      insertBlock(
        SITE_SLUG,
        PAGE_PATH,
        "openforge-cms.avatar-item",
        "node_0000000000000000",
      ),
    ).rejects.toThrow(/container/i);
  });

  it("a stale id from before a prior insert (which added a first-use import) is rejected on reuse", async () => {
    await insertTopLevelBlock(
      SITE_SLUG,
      PAGE_PATH,
      "openforge-cms.avatar-group",
    );
    const before = await currentTree();
    const avatarGroup = before.find(
      (node) => node.blockId === "openforge-cms.avatar-group",
    );

    // avatar-item has never been used on this page, so this first insert
    // adds its import and shifts every other node id — including
    // avatarGroup's. insertBlock itself survives that shift internally
    // (it re-resolves its own container by address), but the id captured
    // in `avatarGroup` above is now stale for any *further* call.
    await insertBlock(
      SITE_SLUG,
      PAGE_PATH,
      "openforge-cms.avatar-item",
      avatarGroup.id,
    );

    await expect(
      insertBlock(
        SITE_SLUG,
        PAGE_PATH,
        "openforge-cms.avatar-item",
        avatarGroup.id,
      ),
    ).rejects.toThrow(/container/i);
  });

  it("inserting a second instance of an already-imported block reuses the same import", async () => {
    await insertTopLevelBlock(SITE_SLUG, PAGE_PATH, "openforge-cms.hero");

    const tree = await currentTree();
    const heroes = tree.filter((node) => node.blockId === "openforge-cms.hero");
    expect(heroes).toHaveLength(2);

    const files = await manager.readFiles(SITE_SLUG);
    const pageSource = files.find((file) => file.path === PAGE_PATH).source;
    const importCount = (
      pageSource.match(
        /from ["']\.\.\/components\/openforge\/hero\.jsx["']/gu,
      ) ?? []
    ).length;
    expect(importCount).toBe(1);
  });

  it("findNodeById locates a node nested inside a slot", async () => {
    const tree = await currentTree();
    const accordion = tree.find(
      (node) => node.blockId === "openforge-cms.accordion",
    );
    const faqItemId = accordion.slots.items[0].id;

    expect(findNodeById(tree, faqItemId)?.blockId).toBe(
      "openforge-cms.faq-item",
    );
    expect(findNodeById(tree, "node_0000000000000000")).toBeNull();
  });
});
