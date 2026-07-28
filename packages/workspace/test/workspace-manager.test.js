import { access, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { list as listTar } from "tar";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { WorkspaceManager } from "../src/index.js";

describe("WorkspaceManager", () => {
  let basePath;
  let manager;

  beforeEach(async () => {
    basePath = await mkdtemp(
      path.join(os.tmpdir(), "openforge-workspace-test-"),
    );
    manager = new WorkspaceManager({ basePath, quotaBytes: 2048 });
  });

  afterEach(async () => {
    const temporaryBase = path.resolve(os.tmpdir());
    if (
      path.dirname(basePath) !== temporaryBase ||
      !path.basename(basePath).startsWith("openforge-workspace-test-")
    ) {
      throw new Error("Refusing to remove an unexpected test directory.");
    }
    await rm(basePath, { force: true, recursive: true });
  });

  it("creates an isolated workspace and saves revisioned files", async () => {
    const created = await manager.create("project-one", fixtureFiles());
    expect(created).toMatchObject({
      workspaceId: "project-one",
      revision: 0,
      fileCount: 2,
    });

    const saved = await manager.saveFile("project-one", {
      path: "app/page.jsx",
      source:
        "export default function Page() { return <main>Changed</main>; }\n",
      baseRevision: 0,
    });
    expect(saved.state.revision).toBe(1);
    expect(saved.entry.hash).toMatch(/^[a-f0-9]{64}$/u);
    await expect(
      manager.saveFile("project-one", {
        path: "app/page.jsx",
        source: "stale",
        baseRevision: 0,
      }),
    ).rejects.toMatchObject({ code: "OF_WORKSPACE_STALE_REVISION" });
  });

  it("creates and restores source snapshots", async () => {
    await manager.create("project-one", fixtureFiles());
    const snapshot = await manager.createSnapshot("project-one");
    await manager.saveFile("project-one", {
      path: "app/page.jsx",
      source:
        "export default function Page() { return <main>Changed</main>; }\n",
      baseRevision: 0,
    });
    await manager.saveFile("project-one", {
      path: "extra.js",
      source: "export const extra = true;\n",
      baseRevision: 1,
    });

    const restored = await manager.restoreSnapshot(
      "project-one",
      snapshot.snapshotId,
      2,
    );
    const files = await manager.readFiles("project-one");
    expect(restored.revision).toBe(3);
    expect(files).toEqual(fixtureFiles());
  });

  it("exports a complete source-only archive", async () => {
    await manager.create("project-one", fixtureFiles());
    const destination = path.join(basePath, "export.tar.gz");
    const result = await manager.export("project-one", destination);
    const entries = [];
    await listTar({
      file: destination,
      onentry(entry) {
        entries.push(entry.path);
      },
    });

    expect(result.files).toEqual(["app/page.jsx", "package.json"]);
    expect(entries.sort()).toEqual([
      "project/app/page.jsx",
      "project/package.json",
    ]);
    expect(entries.some((entry) => entry.includes(".openforge"))).toBe(false);
  });

  it("enforces quotas and removes a failed import", async () => {
    const smallManager = new WorkspaceManager({ basePath, quotaBytes: 16 });
    await expect(
      smallManager.import("project-one", fixtureFiles()),
    ).rejects.toMatchObject({ code: "OF_WORKSPACE_QUOTA_EXCEEDED" });
    await expect(access(path.join(basePath, "project-one"))).rejects.toThrow();
  });

  it("rejects traversal IDs and imported paths", async () => {
    await expect(manager.create("../escape", [])).rejects.toMatchObject({
      code: "OF_WORKSPACE_ID_INVALID",
    });
    await expect(
      manager.create("project-one", [
        { path: "../escape.js", source: "malicious" },
      ]),
    ).rejects.toMatchObject({ code: "OF_PATH_INVALID" });
  });

  it("recovers temporary writes and journal revisions", async () => {
    const created = await manager.create("project-one", fixtureFiles());
    await writeFile(
      path.join(created.rootPath, "orphan.tmp"),
      "partial",
      "utf8",
    );
    await writeFile(
      path.join(created.rootPath, ".openforge", "journal.ndjson"),
      `${JSON.stringify({ revision: 4, type: "recovered" })}\n`,
      "utf8",
    );

    const recovered = await manager.recover("project-one");
    expect(recovered).toMatchObject({
      removedTemporaryFiles: 1,
      state: { revision: 4, status: "ready" },
    });
    await expect(
      readFile(path.join(created.rootPath, "orphan.tmp")),
    ).rejects.toThrow();
  });

  it("cleans up only the selected workspace", async () => {
    const created = await manager.create("project-one", fixtureFiles());
    await manager.cleanup("project-one");
    await expect(access(created.rootPath)).rejects.toThrow();
  });
});

function fixtureFiles() {
  return [
    {
      path: "app/page.jsx",
      source: "export default function Page() { return <main>Hello</main>; }\n",
    },
    {
      path: "package.json",
      source: '{"name":"fixture","private":true}\n',
    },
  ];
}
