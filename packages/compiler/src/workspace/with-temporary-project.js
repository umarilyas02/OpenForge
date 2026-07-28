import { mkdir, mkdtemp, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { normalizeProjectPath } from "../paths/normalize-project-path.js";

/**
 * Materialize project files in a disposable directory for bounded validators.
 *
 * @template Result
 * @param {Array<{ path: string, source: string }>} files
 * @param {(workspacePath: string) => Promise<Result> | Result} callback
 * @returns {Promise<Result>}
 */
export async function withTemporaryProject(files, callback) {
  if (!Array.isArray(files)) {
    throw new TypeError("files must be an array.");
  }
  if (typeof callback !== "function") {
    throw new TypeError("callback must be a function.");
  }

  const temporaryBase = path.resolve(os.tmpdir());
  const workspacePath = await mkdtemp(
    path.join(temporaryBase, "openforge-compiler-"),
  );

  try {
    for (const file of files) {
      const projectPath = normalizeProjectPath(file.path);
      if (typeof file.source !== "string") {
        throw new TypeError(`Source for "${projectPath}" must be a string.`);
      }

      const destination = path.resolve(
        workspacePath,
        ...projectPath.split("/"),
      );
      assertWorkspaceDestination(workspacePath, destination);
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, file.source, "utf8");
    }

    return await callback(workspacePath);
  } finally {
    assertDisposableWorkspace(temporaryBase, workspacePath);
    await rm(workspacePath, { force: true, recursive: true });
  }
}

function assertWorkspaceDestination(workspacePath, destination) {
  const relativePath = path.relative(workspacePath, destination);
  if (
    relativePath === "" ||
    relativePath === ".." ||
    relativePath.startsWith(`..${path.sep}`) ||
    path.isAbsolute(relativePath)
  ) {
    throw new Error("Temporary workspace destination escaped its root.");
  }
}

function assertDisposableWorkspace(temporaryBase, workspacePath) {
  if (
    path.dirname(workspacePath) !== temporaryBase ||
    !path.basename(workspacePath).startsWith("openforge-compiler-")
  ) {
    throw new Error("Refusing to remove an unexpected temporary directory.");
  }
}
