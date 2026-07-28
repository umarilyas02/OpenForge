import { mkdtemp, readdir, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { applyEditorOperation, buildProjectIndex } from "@openforge/compiler";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { WorkspaceManager } from "../src/index.js";

const starterPath = fileURLToPath(
  new URL("../../../templates/blank-next/", import.meta.url),
);

describe("Phase 1 starter round trip", () => {
  let basePath;
  let manager;

  beforeEach(async () => {
    basePath = await mkdtemp(path.join(os.tmpdir(), "openforge-phase-one-"));
    manager = new WorkspaceManager({
      basePath,
      quotaBytes: 10 * 1024 * 1024,
    });
  });

  afterEach(async () => {
    const temporaryBase = path.resolve(os.tmpdir());
    if (
      path.dirname(basePath) !== temporaryBase ||
      !path.basename(basePath).startsWith("openforge-phase-one-")
    ) {
      throw new Error("Refusing to remove an unexpected test directory.");
    }
    await rm(basePath, { force: true, recursive: true });
  });

  it("imports, edits, snapshots, exports, restores, and preserves unsupported source", async () => {
    const starterFiles = await readSourceFiles(starterPath);
    const unsupportedSource =
      'import React from "react";\nexport const Legacy = ({ tag }) => React.createElement(tag, null, "Keep me exact");\n';
    const importedFiles = [
      ...starterFiles,
      {
        path: "components/Legacy.jsx",
        source: unsupportedSource,
      },
    ];

    await manager.import("official-starter", importedFiles);
    const workspaceFiles = await manager.readFiles("official-starter");
    const initialIndex = buildProjectIndex({ files: workspaceFiles });
    const legacy = initialIndex.files.find(
      ({ path: filePath }) => filePath === "components/Legacy.jsx",
    );
    const heading = initialIndex.nodes.find(
      ({ element, filePath }) =>
        element === "h1" && filePath === "components/Hero.jsx",
    );

    expect(legacy.compatibility).toBe("code-only");
    expect(heading).toBeDefined();

    const edited = await applyEditorOperation({
      files: workspaceFiles,
      currentRevision: 0,
      operation: {
        schemaVersion: 1,
        baseRevision: 0,
        filePath: "components/Hero.jsx",
        type: "replace-jsx-text",
        target: { nodeId: heading.id },
        payload: { text: "Build openly. Keep every source file." },
      },
    });
    const editedHero = edited.files.find(
      ({ path: filePath }) => filePath === "components/Hero.jsx",
    );
    await manager.saveFile("official-starter", {
      path: editedHero.path,
      source: editedHero.source,
      baseRevision: 0,
    });
    const snapshot = await manager.createSnapshot("official-starter");
    const archive = await manager.export(
      "official-starter",
      path.join(basePath, "official-starter.tar.gz"),
    );

    const originalPage = workspaceFiles.find(
      ({ path: filePath }) => filePath === "app/page.jsx",
    );
    await manager.saveFile("official-starter", {
      path: "app/page.jsx",
      source: `${originalPage.source}\n// manual edit after snapshot\n`,
      baseRevision: 1,
    });
    await manager.restoreSnapshot("official-starter", snapshot.snapshotId, 2);

    const restored = await manager.readFiles("official-starter");
    expect(
      restored.find(({ path: filePath }) => filePath === "components/Hero.jsx")
        .source,
    ).toContain("Build openly. Keep every source file.");
    expect(
      restored.find(({ path: filePath }) => filePath === "app/page.jsx").source,
    ).toBe(originalPage.source);
    expect(
      restored.find(
        ({ path: filePath }) => filePath === "components/Legacy.jsx",
      ).source,
    ).toBe(unsupportedSource);
    expect(archive.files).toContain("package.json");
    expect(archive.files).not.toContain(".openforge/state.json");
  });
});

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
