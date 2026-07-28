import {
  COMPATIBILITY_LEVELS,
  buildProjectIndex,
  withTemporaryProject,
} from "@openforge/compiler";

const INSPECTABLE_SOURCE = /\.(?:js|jsx)$/iu;
const LEVEL_WEIGHT = {
  [COMPATIBILITY_LEVELS.SUPPORTED]: 0,
  [COMPATIBILITY_LEVELS.PARTIAL]: 1,
  [COMPATIBILITY_LEVELS.CODE_ONLY]: 2,
};

export async function inspectRepositoryFiles(files) {
  const sourceFiles = files
    .filter((file) => INSPECTABLE_SOURCE.test(file.path))
    .map((file) => ({ path: file.path, source: file.source }));

  return withTemporaryProject(sourceFiles, async (temporaryPath) => {
    const index = buildProjectIndex({ files: sourceFiles });
    const counts = {
      supported: 0,
      partial: 0,
      "code-only": 0,
    };
    let level = COMPATIBILITY_LEVELS.SUPPORTED;
    for (const file of index.files) {
      counts[file.compatibility] += 1;
      if (LEVEL_WEIGHT[file.compatibility] > LEVEL_WEIGHT[level]) {
        level = file.compatibility;
      }
    }
    return {
      schemaVersion: 1,
      isolated: true,
      temporaryPathExposed: false,
      inspectedFileCount: sourceFiles.length,
      level,
      counts,
      componentCount: index.components.length,
      diagnosticCount: index.diagnostics.length,
      diagnostics: index.diagnostics,
      _workspaceVerified: temporaryPath.includes("openforge-compiler-"),
    };
  });
}
