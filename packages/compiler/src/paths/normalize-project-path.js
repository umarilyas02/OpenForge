import path from "node:path";

const WINDOWS_DRIVE_PATH = /^[A-Za-z]:/;

/**
 * Convert a project-relative path to a canonical POSIX path.
 *
 * Absolute paths, parent traversal, control characters, and paths that resolve
 * to the project root are rejected before any filesystem access can occur.
 *
 * @param {string} input
 * @returns {string}
 */
export function normalizeProjectPath(input) {
  if (typeof input !== "string" || input.length === 0) {
    throw new TypeError("Project path must be a non-empty string.");
  }

  if (
    [...input].some((character) => {
      const codePoint = character.codePointAt(0);
      return codePoint <= 31 || codePoint === 127;
    })
  ) {
    throw new ProjectPathError(
      input,
      "Project path contains a control character.",
    );
  }

  if (
    input.startsWith("/") ||
    input.startsWith("\\") ||
    WINDOWS_DRIVE_PATH.test(input)
  ) {
    throw new ProjectPathError(
      input,
      "Absolute project paths are not allowed.",
    );
  }

  const portablePath = input.replaceAll("\\", "/");
  const segments = portablePath.split("/");

  if (segments.includes("..")) {
    throw new ProjectPathError(input, "Project path traversal is not allowed.");
  }

  const normalizedPath = path.posix.normalize(portablePath);

  if (
    normalizedPath === "." ||
    normalizedPath === ".." ||
    normalizedPath.startsWith("../")
  ) {
    throw new ProjectPathError(input, "Project path must identify a file.");
  }

  return normalizedPath.replace(/^\.\//u, "");
}

export class ProjectPathError extends Error {
  /**
   * @param {string} input
   * @param {string} message
   */
  constructor(input, message) {
    super(message);
    this.name = "ProjectPathError";
    this.code = "OF_PATH_INVALID";
    this.input = input;
  }
}
