import { createTwoFilesPatch } from "diff";

export const CODE_SAVE_STATES = Object.freeze({
  SAVED: "saved",
  DIRTY: "dirty",
  SAVING: "saving",
  VALIDATION_FAILED: "validation-failed",
  EXTERNAL_CHANGE: "external-change",
  SYNCING: "syncing",
  SYNC_CONFLICT: "sync-conflict",
});

export function createCodeWorkspace({ files, diagnostics = [] }) {
  const records = Object.fromEntries(
    [...files]
      .sort((a, b) => a.path.localeCompare(b.path))
      .map((file) => [
        file.path,
        {
          ...file,
          savedSource: file.source,
          visualWriteAllowed: file.compatibility !== "code-only",
          diagnostics: diagnostics.filter(
            (item) => item.filePath === file.path,
          ),
          saveState: CODE_SAVE_STATES.SAVED,
        },
      ]),
  );
  return { files: records, selectedPath: Object.keys(records)[0] ?? null };
}

export function updateBuffer(state, filePath, source) {
  return updateFile(state, filePath, {
    source,
    saveState:
      source === state.files[filePath]?.savedSource
        ? CODE_SAVE_STATES.SAVED
        : CODE_SAVE_STATES.DIRTY,
  });
}
export const markSaving = (state, filePath) =>
  updateFile(state, filePath, { saveState: CODE_SAVE_STATES.SAVING });
export const markSaved = (state, filePath, source) =>
  updateFile(state, filePath, {
    source,
    savedSource: source,
    saveState: CODE_SAVE_STATES.SAVED,
  });
export function markExternalChange(state, filePath, externalSource) {
  const file = requireFile(state, filePath);
  return updateFile(state, filePath, {
    externalSource,
    saveState:
      file.source === file.savedSource
        ? CODE_SAVE_STATES.EXTERNAL_CHANGE
        : CODE_SAVE_STATES.SYNC_CONFLICT,
  });
}
export const getChangedFiles = (state) =>
  Object.values(state.files)
    .filter((file) => file.source !== file.savedSource)
    .map((file) => file.path)
    .sort();
export function getFileDiff(state, filePath) {
  const file = requireFile(state, filePath);
  return createTwoFilesPatch(
    `a/${filePath}`,
    `b/${filePath}`,
    file.savedSource,
    file.source,
    "saved",
    "working",
    { context: 3 },
  );
}
function updateFile(state, filePath, patch) {
  const file = requireFile(state, filePath);
  return {
    ...state,
    files: { ...state.files, [filePath]: { ...file, ...patch } },
  };
}
function requireFile(state, filePath) {
  const file = state.files[filePath];
  if (!file) throw new Error(`Unknown code-workspace file: "${filePath}".`);
  return file;
}
