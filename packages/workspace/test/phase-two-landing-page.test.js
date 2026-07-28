import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { officialBlockRegistry } from "@openforge/blocks";
import {
  applyEditorOperation,
  applyVisualOperation,
  buildProjectIndex,
} from "@openforge/compiler";
import { resolveEditorKeyboardCommand } from "@openforge/editor";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { WorkspaceManager } from "../src/index.js";

const starterPath = fileURLToPath(
  new URL("../../../templates/blank-next/", import.meta.url),
);
const blockOrder = [
  "openforge.header",
  "openforge.hero",
  "openforge.logo-cloud",
  "openforge.features",
  "openforge.stats",
  "openforge.testimonials",
  "openforge.pricing",
  "openforge.faq",
  "openforge.cta",
  "openforge.footer",
];

describe("Phase 2 visual landing-page journey", () => {
  let basePath;
  let manager;

  beforeEach(async () => {
    basePath = await mkdtemp(path.join(os.tmpdir(), "openforge-phase-two-"));
    manager = new WorkspaceManager({
      basePath,
      quotaBytes: 20 * 1024 * 1024,
    });
  });

  afterEach(async () => {
    const temporaryBase = path.resolve(os.tmpdir());
    if (
      path.dirname(basePath) !== temporaryBase ||
      !path.basename(basePath).startsWith("openforge-phase-two-")
    ) {
      throw new Error("Refusing to remove an unexpected test directory.");
    }
    await rm(basePath, { force: true, recursive: true });
  });

  it("creates, persists, edits, reorders, and recovers all ten official blocks", async () => {
    const starterFiles = await readSourceFiles(starterPath);
    const generated = buildLandingPageFiles();
    const imported = mergeFiles(starterFiles, generated.files);

    await manager.import("visual-landing-page", imported);
    const initialFiles = await manager.readFiles("visual-landing-page");
    const initialPage = initialFiles.find(
      ({ path }) => path === "app/page.jsx",
    );
    const initialSnapshot = await manager.createSnapshot("visual-landing-page");
    const index = buildProjectIndex({ files: initialFiles });
    const renderedBlocks = blockOrder.map((id) => {
      const block = officialBlockRegistry.get(id);
      return index.nodes.find(
        ({ element, filePath }) =>
          element === block.exportName && filePath === "app/page.jsx",
      );
    });

    expect(renderedBlocks.every(Boolean)).toBe(true);
    expect(generated.componentPaths).toHaveLength(10);
    expect(resolveEditorKeyboardCommand({ key: "ArrowDown" })).toBe(
      "navigate-child",
    );
    expect(resolveEditorKeyboardCommand({ key: "k", ctrlKey: true })).toBe(
      "open-command-palette",
    );

    const hero = renderedBlocks[1];
    const edited = await applyEditorOperation({
      files: initialFiles,
      currentRevision: 0,
      operation: {
        schemaVersion: 1,
        baseRevision: 0,
        filePath: "app/page.jsx",
        type: "set-jsx-attribute",
        target: { nodeId: hero.id },
        payload: {
          name: "heading",
          value: "A complete landing page, built visually.",
        },
      },
    });
    expect(edited.fileDiffs[0].patch).toContain(
      'heading="A complete landing page, built visually."',
    );
    expect(edited.inverseOperation).not.toBeNull();
    await savePage(manager, edited.files, 0);

    const reloaded = await manager.readFiles("visual-landing-page");
    expect(
      reloaded.find(({ path }) => path === "app/page.jsx").source,
    ).toContain('heading="A complete landing page, built visually."');
    const reloadedIndex = buildProjectIndex({ files: reloaded });
    const footer = reloadedIndex.nodes.find(
      ({ element, filePath }) =>
        element === "Footer" && filePath === "app/page.jsx",
    );
    const callToAction = reloadedIndex.nodes.find(
      ({ element, filePath }) =>
        element === "CallToAction" && filePath === "app/page.jsx",
    );
    const reordered = await applyVisualOperation({
      files: reloaded,
      currentRevision: 1,
      operation: {
        schemaVersion: 1,
        baseRevision: 1,
        filePath: "app/page.jsx",
        type: "move-jsx",
        target: { nodeId: footer.id },
        payload: {
          destinationNodeId: callToAction.id,
          position: "before",
        },
      },
    });
    expect(reordered.fileDiffs[0].patch).toContain("<Footer />");
    await savePage(manager, reordered.files, 1);

    const persisted = await manager.readFiles("visual-landing-page");
    const persistedPage = persisted.find(({ path }) => path === "app/page.jsx");
    expect(persistedPage.source.indexOf("<Footer />")).toBeLessThan(
      persistedPage.source.indexOf("<CallToAction />"),
    );

    await manager.restoreSnapshot(
      "visual-landing-page",
      initialSnapshot.snapshotId,
      2,
    );
    const recovered = await manager.readFiles("visual-landing-page");
    expect(recovered.find(({ path }) => path === "app/page.jsx").source).toBe(
      initialPage.source,
    );
    expect(
      recovered.filter(({ path }) => path.startsWith("components/openforge/")),
    ).toHaveLength(11);
  });
});

function buildLandingPageFiles() {
  const fileMap = new Map();
  const imports = [];
  const elements = [];
  const componentPaths = [];

  for (const id of blockOrder) {
    const block = officialBlockRegistry.get(id);
    const insertion = officialBlockRegistry.createInsertion(id);
    imports.push(
      `import { ${block.exportName} } from "${insertion.import.source}";`,
    );
    elements.push(`      ${insertion.jsx}`);
    for (const file of insertion.files) {
      fileMap.set(file.path, { path: file.path, source: file.content });
      if (file.path.endsWith(".jsx")) componentPaths.push(file.path);
    }
  }
  fileMap.set("app/page.jsx", {
    path: "app/page.jsx",
    source: `${imports.join("\n")}

export const metadata = {
  title: "OpenForge visual landing page",
  description: "A portable page assembled from all ten official blocks.",
};

export default function HomePage() {
  return (
    <main>
${elements.join("\n")}
    </main>
  );
}
`,
  });
  return {
    componentPaths,
    files: [...fileMap.values()],
  };
}

function mergeFiles(original, generated) {
  const replacements = new Map(generated.map((file) => [file.path, file]));
  for (const file of original) {
    if (!replacements.has(file.path)) replacements.set(file.path, file);
  }
  return [...replacements.values()].sort((left, right) =>
    left.path.localeCompare(right.path),
  );
}

async function savePage(manager, files, baseRevision) {
  const page = files.find(({ path }) => path === "app/page.jsx");
  await manager.saveFile("visual-landing-page", {
    path: page.path,
    source: page.source,
    baseRevision,
  });
}

async function readSourceFiles(rootPath, currentPath = rootPath) {
  const entries = await readdir(currentPath, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    if ([".next", ".turbo", "node_modules"].includes(entry.name)) continue;
    const absolutePath = path.join(currentPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await readSourceFiles(rootPath, absolutePath)));
    } else if (entry.isFile()) {
      files.push({
        path: path.relative(rootPath, absolutePath).split(path.sep).join("/"),
        source: await readFile(absolutePath, "utf8"),
      });
    }
  }
  return files.sort((left, right) => left.path.localeCompare(right.path));
}
