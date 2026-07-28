import { describe, expect, it } from "vitest";
import {
  CODE_SAVE_STATES,
  createCodeWorkspace,
  getChangedFiles,
  getFileDiff,
  markExternalChange,
  markSaved,
  markSaving,
  updateBuffer,
} from "../src/index.js";

const files = [
  { path: "app/page.jsx", source: "export default 1;" },
  {
    path: "legacy.jsx",
    source: "export default 2;",
    compatibility: "code-only",
  },
];

describe("code workspace model", () => {
  it("sorts files and preserves code-only source", () => {
    const state = createCodeWorkspace({ files });
    expect(Object.keys(state.files)).toEqual(["app/page.jsx", "legacy.jsx"]);
    expect(state.files["legacy.jsx"].visualWriteAllowed).toBe(false);
  });
  it("tracks save states immutably", () => {
    const initial = createCodeWorkspace({ files });
    const dirty = updateBuffer(initial, "app/page.jsx", "export default 3;");
    const saving = markSaving(dirty, "app/page.jsx");
    const saved = markSaved(saving, "app/page.jsx", "export default 3;");
    expect(initial.files["app/page.jsx"].saveState).toBe(
      CODE_SAVE_STATES.SAVED,
    );
    expect(dirty.files["app/page.jsx"].saveState).toBe(CODE_SAVE_STATES.DIRTY);
    expect(saving.files["app/page.jsx"].saveState).toBe(
      CODE_SAVE_STATES.SAVING,
    );
    expect(saved.files["app/page.jsx"].saveState).toBe(CODE_SAVE_STATES.SAVED);
  });
  it("reports changed files and diffs", () => {
    const state = updateBuffer(
      createCodeWorkspace({ files }),
      "app/page.jsx",
      "export default 3;",
    );
    expect(getChangedFiles(state)).toEqual(["app/page.jsx"]);
    expect(getFileDiff(state, "app/page.jsx")).toContain("+export default 3;");
  });
  it("distinguishes external changes from conflicts", () => {
    const initial = createCodeWorkspace({ files });
    const clean = markExternalChange(initial, "app/page.jsx", "external");
    const dirty = updateBuffer(initial, "app/page.jsx", "local");
    const conflict = markExternalChange(dirty, "app/page.jsx", "external");
    expect(clean.files["app/page.jsx"].saveState).toBe("external-change");
    expect(conflict.files["app/page.jsx"].saveState).toBe("sync-conflict");
  });
});
