import { createHash } from "node:crypto";

import { canonicalJson } from "@openforge/integration-security";

import { invariant } from "./errors.js";

export function normalizeSourceFiles(files) {
  invariant(
    Array.isArray(files),
    "OF_GITHUB_SOURCE_FILES_INVALID",
    "Source files must be an array.",
  );
  const normalized = files
    .map((file) => {
      const segments =
        typeof file?.path === "string" ? file.path.split("/") : [];
      invariant(
        typeof file?.path === "string" &&
          file.path.length >= 1 &&
          file.path.length <= 500 &&
          typeof file?.source === "string" &&
          !file.path.startsWith("/") &&
          !file.path.includes("\\") &&
          segments.every(
            (segment) =>
              segment.length > 0 && segment !== "." && segment !== "..",
          ) &&
          !segments.some((segment) => [".git", ".openforge"].includes(segment)),
        "OF_GITHUB_SOURCE_FILE_INVALID",
        "A source file path or value is invalid.",
      );
      return { path: file.path, source: file.source };
    })
    .sort((left, right) => left.path.localeCompare(right.path));
  invariant(
    new Set(normalized.map((file) => file.path)).size === normalized.length,
    "OF_GITHUB_SOURCE_PATH_DUPLICATE",
    "Source file paths must be unique.",
  );
  return normalized;
}

export function diffSourceFiles(baseFiles, nextFiles) {
  const base = new Map(
    normalizeSourceFiles(baseFiles).map((file) => [file.path, file.source]),
  );
  const next = new Map(
    normalizeSourceFiles(nextFiles).map((file) => [file.path, file.source]),
  );
  const paths = new Set([...base.keys(), ...next.keys()]);
  const changes = [];

  for (const path of [...paths].sort()) {
    const before = base.get(path);
    const after = next.get(path);
    if (before === after) continue;
    changes.push({
      path,
      type:
        before === undefined
          ? "add"
          : after === undefined
            ? "delete"
            : "modify",
      beforeHash: before === undefined ? null : hashSource(before),
      afterHash: after === undefined ? null : hashSource(after),
      additions: after === undefined ? 0 : lineCount(after),
      deletions: before === undefined ? 0 : lineCount(before),
    });
  }
  return changes;
}

export function sourceFilesHash(files) {
  return createHash("sha256")
    .update(canonicalJson(normalizeSourceFiles(files)))
    .digest("hex");
}

function hashSource(source) {
  return createHash("sha256").update(source).digest("hex");
}

function lineCount(source) {
  return source.length === 0 ? 0 : source.split(/\r?\n/u).length;
}
