import {
  appendFile,
  lstat,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  unlink,
  writeFile,
} from "node:fs/promises";
import { createHash, randomUUID } from "node:crypto";
import path from "node:path";

import { normalizeProjectPath } from "@openforge/compiler";
import { create as createTar } from "tar";

const METADATA_DIRECTORY = ".openforge";
const WORKSPACE_ID = /^[a-z0-9][a-z0-9_-]{0,63}$/u;

export class WorkspaceManager {
  /**
   * @param {{ basePath: string, quotaBytes?: number }} options
   */
  constructor({ basePath, quotaBytes = 50 * 1024 * 1024 }) {
    if (typeof basePath !== "string" || basePath.length === 0) {
      throw new TypeError("basePath must be a non-empty string.");
    }
    if (!Number.isSafeInteger(quotaBytes) || quotaBytes <= 0) {
      throw new TypeError("quotaBytes must be a positive safe integer.");
    }
    this.basePath = path.resolve(basePath);
    this.quotaBytes = quotaBytes;
  }

  async create(workspaceId, files = []) {
    const rootPath = this.getWorkspacePath(workspaceId);
    await mkdir(this.basePath, { recursive: true });
    try {
      await lstat(rootPath);
      throw new WorkspaceError(
        "OF_WORKSPACE_EXISTS",
        "Workspace already exists.",
      );
    } catch (error) {
      if (error instanceof WorkspaceError) throw error;
      if (error?.code !== "ENOENT") throw error;
    }

    await mkdir(rootPath);
    try {
      await mkdir(this.metadataPath(rootPath, "snapshots"), {
        recursive: true,
      });
      await this.writeImportedFiles(rootPath, files);
      const state = {
        schemaVersion: 1,
        workspaceId,
        revision: 0,
        status: "ready",
      };
      await this.atomicJson(this.metadataPath(rootPath, "state.json"), state);
      await writeFile(
        this.metadataPath(rootPath, "journal.ndjson"),
        "",
        "utf8",
      );
      return this.describe(workspaceId);
    } catch (error) {
      await rm(rootPath, { force: true, recursive: true });
      throw error;
    }
  }

  async import(workspaceId, files) {
    return this.create(workspaceId, files);
  }

  async describe(workspaceId) {
    const rootPath = this.getWorkspacePath(workspaceId);
    const state = await this.readState(rootPath);
    const files = await this.readFiles(workspaceId);
    return {
      ...state,
      rootPath,
      fileCount: files.length,
      bytesUsed: byteSize(files),
      quotaBytes: this.quotaBytes,
    };
  }

  async readFiles(workspaceId) {
    const rootPath = this.getWorkspacePath(workspaceId);
    await this.assertWorkspace(rootPath);
    const paths = await listSourcePaths(rootPath);
    return Promise.all(
      paths.map(async (projectPath) => ({
        path: projectPath,
        source: await readFile(
          path.join(rootPath, ...projectPath.split("/")),
          "utf8",
        ),
      })),
    );
  }

  async saveFile(workspaceId, input) {
    const rootPath = this.getWorkspacePath(workspaceId);
    const state = await this.readState(rootPath);
    if (input.baseRevision !== state.revision) {
      throw new WorkspaceError(
        "OF_WORKSPACE_STALE_REVISION",
        `Expected revision ${state.revision}, received ${input.baseRevision}.`,
      );
    }
    if (typeof input.source !== "string") {
      throw new TypeError("source must be a string.");
    }

    const projectPath = normalizeProjectPath(input.path);
    const files = await this.readFiles(workspaceId);
    const nextFiles = files
      .filter((file) => file.path !== projectPath)
      .concat({ path: projectPath, source: input.source });
    this.assertQuota(nextFiles);

    const destination = this.sourcePath(rootPath, projectPath);
    await mkdir(path.dirname(destination), { recursive: true });
    await atomicWrite(destination, input.source);

    const nextState = { ...state, revision: state.revision + 1 };
    const entry = {
      revision: nextState.revision,
      type: "save-file",
      path: projectPath,
      hash: hash(input.source),
    };
    await appendFile(
      this.metadataPath(rootPath, "journal.ndjson"),
      `${JSON.stringify(entry)}\n`,
      "utf8",
    );
    await this.atomicJson(this.metadataPath(rootPath, "state.json"), nextState);
    return { state: nextState, entry };
  }

  async createSnapshot(workspaceId) {
    const rootPath = this.getWorkspacePath(workspaceId);
    const state = await this.readState(rootPath);
    const files = await this.readFiles(workspaceId);
    const snapshotId = hash(
      JSON.stringify({
        revision: state.revision,
        files: files.map((file) => [file.path, hash(file.source)]),
      }),
    ).slice(0, 24);
    const snapshot = {
      schemaVersion: 1,
      snapshotId,
      revision: state.revision,
      files,
    };
    await this.atomicJson(
      this.metadataPath(rootPath, "snapshots", `${snapshotId}.json`),
      snapshot,
    );
    return snapshot;
  }

  async restoreSnapshot(workspaceId, snapshotId, baseRevision) {
    if (!/^[a-f0-9]{24}$/u.test(snapshotId)) {
      throw new WorkspaceError("OF_SNAPSHOT_INVALID", "Invalid snapshot ID.");
    }
    const rootPath = this.getWorkspacePath(workspaceId);
    const state = await this.readState(rootPath);
    if (baseRevision !== state.revision) {
      throw new WorkspaceError(
        "OF_WORKSPACE_STALE_REVISION",
        `Expected revision ${state.revision}, received ${baseRevision}.`,
      );
    }
    const snapshot = JSON.parse(
      await readFile(
        this.metadataPath(rootPath, "snapshots", `${snapshotId}.json`),
        "utf8",
      ),
    );
    this.assertQuota(snapshot.files);
    const existing = await this.readFiles(workspaceId);
    const snapshotPaths = new Set(snapshot.files.map((file) => file.path));
    for (const file of existing) {
      if (!snapshotPaths.has(file.path)) {
        await unlink(this.sourcePath(rootPath, file.path));
      }
    }
    await this.writeImportedFiles(rootPath, snapshot.files);
    const nextState = { ...state, revision: state.revision + 1 };
    await appendFile(
      this.metadataPath(rootPath, "journal.ndjson"),
      `${JSON.stringify({
        revision: nextState.revision,
        type: "restore-snapshot",
        snapshotId,
      })}\n`,
      "utf8",
    );
    await this.atomicJson(this.metadataPath(rootPath, "state.json"), nextState);
    return nextState;
  }

  async export(workspaceId, destination) {
    const rootPath = this.getWorkspacePath(workspaceId);
    await this.assertWorkspace(rootPath);
    const files = await this.readFiles(workspaceId);
    const destinationPath = path.resolve(destination);
    await mkdir(path.dirname(destinationPath), { recursive: true });
    await createTar(
      {
        cwd: rootPath,
        file: destinationPath,
        gzip: true,
        noMtime: true,
        portable: true,
        prefix: "project/",
      },
      files.map((file) => file.path),
    );
    return { destinationPath, files: files.map((file) => file.path) };
  }

  async recover(workspaceId) {
    const rootPath = this.getWorkspacePath(workspaceId);
    await this.assertWorkspace(rootPath);
    const removed = await removeTemporaryFiles(rootPath);
    const state = await this.readState(rootPath);
    const journal = await readJournal(
      this.metadataPath(rootPath, "journal.ndjson"),
    );
    const revision = Math.max(
      state.revision,
      ...journal.map((entry) => entry.revision),
    );
    const nextState = { ...state, revision, status: "ready" };
    await this.atomicJson(this.metadataPath(rootPath, "state.json"), nextState);
    return { removedTemporaryFiles: removed, state: nextState };
  }

  async cleanup(workspaceId) {
    const rootPath = this.getWorkspacePath(workspaceId);
    await this.assertWorkspace(rootPath);
    await rm(rootPath, { force: true, recursive: true });
  }

  getWorkspacePath(workspaceId) {
    if (typeof workspaceId !== "string" || !WORKSPACE_ID.test(workspaceId)) {
      throw new WorkspaceError(
        "OF_WORKSPACE_ID_INVALID",
        "Invalid workspace ID.",
      );
    }
    const rootPath = path.resolve(this.basePath, workspaceId);
    if (path.dirname(rootPath) !== this.basePath) {
      throw new WorkspaceError(
        "OF_WORKSPACE_PATH_INVALID",
        "Workspace escaped its base.",
      );
    }
    return rootPath;
  }

  async writeImportedFiles(rootPath, files) {
    if (!Array.isArray(files)) throw new TypeError("files must be an array.");
    const normalized = files.map((file) => ({
      path: normalizeProjectPath(file.path),
      source: file.source,
    }));
    if (normalized.some((file) => typeof file.source !== "string")) {
      throw new TypeError("Every imported source must be a string.");
    }
    if (
      new Set(normalized.map((file) => file.path)).size !== normalized.length
    ) {
      throw new WorkspaceError(
        "OF_WORKSPACE_DUPLICATE_PATH",
        "Duplicate import path.",
      );
    }
    this.assertQuota(normalized);
    for (const file of normalized) {
      const destination = this.sourcePath(rootPath, file.path);
      await mkdir(path.dirname(destination), { recursive: true });
      await atomicWrite(destination, file.source);
    }
  }

  assertQuota(files) {
    const bytes = byteSize(files);
    if (bytes > this.quotaBytes) {
      throw new WorkspaceError(
        "OF_WORKSPACE_QUOTA_EXCEEDED",
        `Workspace uses ${bytes} bytes; quota is ${this.quotaBytes}.`,
      );
    }
  }

  sourcePath(rootPath, projectPath) {
    const destination = path.resolve(rootPath, ...projectPath.split("/"));
    const relative = path.relative(rootPath, destination);
    if (relative.startsWith("..") || path.isAbsolute(relative)) {
      throw new WorkspaceError(
        "OF_WORKSPACE_PATH_INVALID",
        "Source escaped workspace.",
      );
    }
    return destination;
  }

  metadataPath(rootPath, ...segments) {
    return path.join(rootPath, METADATA_DIRECTORY, ...segments);
  }

  async readState(rootPath) {
    await this.assertWorkspace(rootPath);
    return JSON.parse(
      await readFile(this.metadataPath(rootPath, "state.json"), "utf8"),
    );
  }

  async assertWorkspace(rootPath) {
    const info = await lstat(rootPath);
    if (!info.isDirectory() || info.isSymbolicLink()) {
      throw new WorkspaceError(
        "OF_WORKSPACE_INVALID",
        "Workspace is not a directory.",
      );
    }
  }

  async atomicJson(destination, value) {
    await atomicWrite(destination, `${JSON.stringify(value, null, 2)}\n`);
  }
}

export class WorkspaceError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "WorkspaceError";
    this.code = code;
  }
}

async function atomicWrite(destination, content) {
  const temporary = `${destination}.${randomUUID()}.tmp`;
  await writeFile(temporary, content, "utf8");
  await rename(temporary, destination);
}

async function listSourcePaths(rootPath, current = rootPath) {
  const entries = await readdir(current, { withFileTypes: true });
  const paths = [];
  for (const entry of entries) {
    if (current === rootPath && entry.name === METADATA_DIRECTORY) continue;
    const absolute = path.join(current, entry.name);
    if (entry.isSymbolicLink()) {
      throw new WorkspaceError(
        "OF_WORKSPACE_SYMLINK",
        "Symlinks are not allowed.",
      );
    }
    if (entry.isDirectory()) {
      paths.push(...(await listSourcePaths(rootPath, absolute)));
    } else if (entry.isFile()) {
      paths.push(path.relative(rootPath, absolute).split(path.sep).join("/"));
    }
  }
  return paths.sort();
}

async function removeTemporaryFiles(rootPath, current = rootPath) {
  const entries = await readdir(current, { withFileTypes: true });
  let removed = 0;
  for (const entry of entries) {
    const absolute = path.join(current, entry.name);
    if (entry.isDirectory()) {
      removed += await removeTemporaryFiles(rootPath, absolute);
    } else if (entry.isFile() && entry.name.endsWith(".tmp")) {
      await unlink(absolute);
      removed += 1;
    }
  }
  return removed;
}

async function readJournal(journalPath) {
  const content = await readFile(journalPath, "utf8");
  return content
    .split("\n")
    .filter(Boolean)
    .map((line) => JSON.parse(line));
}

function byteSize(files) {
  return files.reduce(
    (total, file) =>
      total + Buffer.byteLength(file.path) + Buffer.byteLength(file.source),
    0,
  );
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}
