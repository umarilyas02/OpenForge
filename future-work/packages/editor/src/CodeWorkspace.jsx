"use client";

import Editor, { DiffEditor } from "@monaco-editor/react";
import { useMemo, useState } from "react";
import {
  createCodeWorkspace,
  getChangedFiles,
  markSaved,
  markSaving,
  updateBuffer,
} from "./model.js";

export function CodeWorkspace({ files, diagnostics, onSave }) {
  const initial = useMemo(
    () => createCodeWorkspace({ files, diagnostics }),
    [files, diagnostics],
  );
  const [workspace, setWorkspace] = useState(initial);
  const [showDiff, setShowDiff] = useState(false);
  const selected = workspace.files[workspace.selectedPath];
  if (!selected) return <p>No project files are available.</p>;
  async function save() {
    setWorkspace((state) => markSaving(state, selected.path));
    await onSave({ path: selected.path, source: selected.source });
    setWorkspace((state) => markSaved(state, selected.path, selected.source));
  }
  return (
    <section aria-label="Code workspace">
      <aside aria-label="Project files">
        {Object.values(workspace.files).map((file) => (
          <button
            aria-current={file.path === selected.path ? "page" : undefined}
            key={file.path}
            onClick={() =>
              setWorkspace((state) => ({ ...state, selectedPath: file.path }))
            }
            type="button"
          >
            {file.path}
          </button>
        ))}
      </aside>
      <header>
        <span>{selected.saveState}</span>
        {selected.compatibility === "code-only" && <span>Code only</span>}
        <button onClick={() => setShowDiff((value) => !value)} type="button">
          {showDiff ? "Edit" : `Diff (${getChangedFiles(workspace).length})`}
        </button>
        <button
          disabled={selected.saveState !== "dirty"}
          onClick={save}
          type="button"
        >
          Save
        </button>
      </header>
      {showDiff ? (
        <DiffEditor
          language="javascript"
          modified={selected.source}
          original={selected.savedSource}
          path={selected.path}
        />
      ) : (
        <Editor
          language="javascript"
          onChange={(value = "") =>
            setWorkspace((state) => updateBuffer(state, selected.path, value))
          }
          path={selected.path}
          value={selected.source}
        />
      )}
      <ul aria-label="Diagnostics">
        {selected.diagnostics.map((item) => (
          <li key={`${item.code}:${item.location?.line ?? 0}`}>
            {item.message}
          </li>
        ))}
      </ul>
    </section>
  );
}
