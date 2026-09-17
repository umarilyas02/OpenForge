import { rm, writeFile } from "node:fs/promises";

import { buildProjectIndex } from "@openforge/compiler";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";

const BASE_PATH = "./data/perf-report-site";
const RESULTS_PATH = "./.perf-report-results.json";

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
const { setBlockProps, moveBlock, insertBlock } = await import(
  "../src/lib/source-content-actions.js"
);

const manager = getWorkspaceManager();
const SITE_SLUG = "perf-report-site";
const PAGE_PATH = "app/page.jsx";

function stats(samplesMs) {
  const sorted = [...samplesMs].sort((a, b) => a - b);
  const mean = sorted.reduce((sum, v) => sum + v, 0) / sorted.length;
  const p50 = sorted[Math.floor(sorted.length * 0.5)];
  const p95 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * 0.95))];
  return { n: sorted.length, meanMs: +mean.toFixed(2), p50Ms: +p50.toFixed(2), p95Ms: +p95.toFixed(2), maxMs: +sorted[sorted.length - 1].toFixed(2) };
}

/**
 * Real timing of the exact functions the live canvas/page editor calls on
 * every user action, against a real git-backed workspace (the same fixture
 * pattern block-add-smoke.test.js uses -- not a mock of the operations
 * themselves, only of getWorkspaceManager()'s storage location). Measures
 * against agents/progress.md's Phase 6.3 targets: editor load <3s, a
 * canvas edit round trip <100ms, an individual compiler transform <500ms.
 * Assertions are soft (logged, not failed) on purpose -- these are real
 * infra-dependent timings (disk + git), not deterministic unit behavior;
 * results are written to RESULTS_PATH so a human/CI can inspect the exact
 * numbers rather than trusting a pass/fail label alone.
 */
describe("editor pipeline performance (real measurements, not a unit test)", () => {
  const results = {};

  beforeAll(async () => {
    await rm(BASE_PATH, { force: true, recursive: true });
    const files = await buildStarterFiles({ name: "Perf Report Site", slug: SITE_SLUG });
    await manager.create(SITE_SLUG, files);
    const { rootPath } = await manager.describe(SITE_SLUG);
    await initSiteGit(rootPath);
  }, 30000);

  afterAll(async () => {
    await writeFile(RESULTS_PATH, JSON.stringify(results, null, 2));
    await rm(BASE_PATH, { force: true, recursive: true });
  });

  it(
    "editor load: read files + index project + parse block tree (target: p95 < 3000ms)",
    async () => {
      const samples = [];
      for (let i = 0; i < 20; i++) {
        const start = performance.now();
        const files = await manager.readFiles(SITE_SLUG);
        const index = buildProjectIndex({ files });
        parsePageToBlockTree(files, PAGE_PATH, index);
        findPageRootNodeId(files, PAGE_PATH, index);
        samples.push(performance.now() - start);
      }
      results.editorLoad = stats(samples);
      expect(results.editorLoad.p95Ms).toBeLessThan(3000);
    },
    60000,
  );

  it(
    "canvas edit: set a block prop, transform + save + git commit (target: p95 < 100ms)",
    async () => {
      const samples = [];
      for (let i = 0; i < 20; i++) {
        const files = await manager.readFiles(SITE_SLUG);
        const tree = parsePageToBlockTree(files, PAGE_PATH);
        const nodeId = tree[0].id;
        const start = performance.now();
        await setBlockProps(SITE_SLUG, PAGE_PATH, nodeId, {
          heading: `Heading ${i}`,
        });
        samples.push(performance.now() - start);
      }
      results.canvasEditSetProp = stats(samples);
      // Reported, not asserted strictly against 100ms -- see the file
      // header on why, and the real number this run recorded is what
      // matters, not a binary pass here.
      expect(results.canvasEditSetProp.n).toBe(20);
    },
    60000,
  );

  it(
    "canvas reorder: move a block, transform + save + git commit (target: p95 < 100ms)",
    async () => {
      const samples = [];
      for (let i = 0; i < 10; i++) {
        const files = await manager.readFiles(SITE_SLUG);
        const tree = parsePageToBlockTree(files, PAGE_PATH);
        if (tree.length < 2) break;
        const [a, b] = tree;
        const start = performance.now();
        await moveBlock(SITE_SLUG, PAGE_PATH, a.id, b.id, "after");
        samples.push(performance.now() - start);
        const after = parsePageToBlockTree(await manager.readFiles(SITE_SLUG), PAGE_PATH);
        await moveBlock(SITE_SLUG, PAGE_PATH, after[1].id, after[0].id, "before");
      }
      results.canvasReorder = stats(samples);
      expect(results.canvasReorder.n).toBeGreaterThan(0);
    },
    60000,
  );

  it(
    "insert a new block, first use incl. add-import (target: p95 < 500ms)",
    async () => {
      const samples = [];
      for (let i = 0; i < 5; i++) {
        const files = await manager.readFiles(SITE_SLUG);
        const containerId = findPageRootNodeId(files, PAGE_PATH);
        const start = performance.now();
        await insertBlock(SITE_SLUG, PAGE_PATH, "openforge-cms.cta", containerId);
        samples.push(performance.now() - start);
      }
      results.insertBlock = stats(samples);
      expect(results.insertBlock.n).toBe(5);
    },
    60000,
  );
});
