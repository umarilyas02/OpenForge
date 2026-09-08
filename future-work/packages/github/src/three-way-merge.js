import { analyzeSourceCompatibility } from "@openforge/compiler";

import { normalizeSourceFiles } from "./source-diff.js";

export function mergeSourceFiles({ baseFiles, localFiles, remoteFiles }) {
  const base = toMap(baseFiles);
  const local = toMap(localFiles);
  const remote = toMap(remoteFiles);
  const paths = new Set([...base.keys(), ...local.keys(), ...remote.keys()]);
  const merged = [];
  const conflicts = [];

  for (const path of [...paths].sort()) {
    const before = base.get(path);
    const ours = local.get(path);
    const theirs = remote.get(path);
    const resolution = resolveFile(before, ours, theirs);
    if (resolution.conflict) {
      conflicts.push(createConflict(path, before, ours, theirs));
    } else if (resolution.source !== undefined) {
      merged.push({ path, source: resolution.source });
    }
  }

  return {
    files: merged,
    conflicts,
    clean: conflicts.length === 0,
  };
}

function resolveFile(base, local, remote) {
  if (local === remote) return { source: local };
  if (local === base) return { source: remote };
  if (remote === base) return { source: local };
  return { conflict: true };
}

function createConflict(path, base, local, remote) {
  return {
    path,
    kind: conflictKind(base, local, remote),
    resolutionMode: "code-only",
    compatibility: {
      local: compatibility(path, local),
      remote: compatibility(path, remote),
    },
    base: base ?? null,
    local: local ?? null,
    remote: remote ?? null,
    markerPreview: [
      "<<<<<<< LOCAL",
      local ?? "",
      "=======",
      remote ?? "",
      ">>>>>>> REMOTE",
    ].join("\n"),
  };
}

function compatibility(path, source) {
  if (source === undefined || !/\.(?:js|jsx)$/iu.test(path)) return null;
  return analyzeSourceCompatibility({ filePath: path, source }).level;
}

function conflictKind(base, local, remote) {
  if (base === undefined) return "add/add";
  if (local === undefined || remote === undefined) return "modify/delete";
  return "content";
}

function toMap(files) {
  return new Map(
    normalizeSourceFiles(files).map((file) => [file.path, file.source]),
  );
}
