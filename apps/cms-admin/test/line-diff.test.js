import { describe, expect, it } from "vitest";

import { diffLines, summarizeDiff } from "../src/lib/line-diff.js";

/**
 * Reconstructs each side of the diff from its ops, so every test is a
 * round-trip check rather than an assertion tied to one particular (of
 * several valid) LCS alignment.
 */
function reconstructOld(diff) {
  return diff
    .filter((op) => op.type !== "added")
    .map((op) => op.line);
}

function reconstructNew(diff) {
  return diff
    .filter((op) => op.type !== "removed")
    .map((op) => op.line);
}

describe("diffLines", () => {
  it("marks identical text as entirely equal", () => {
    const text = "a\nb\nc";
    const diff = diffLines(text, text);
    expect(diff.every((op) => op.type === "equal")).toBe(true);
    expect(summarizeDiff(diff)).toEqual({ added: 0, removed: 0 });
  });

  it("reconstructs both the old and new text from the diff ops", () => {
    const oldText = "line1\nline2\nline3";
    const newText = "line1\nreplaced\nline3\nline4";
    const diff = diffLines(oldText, newText);

    expect(reconstructOld(diff).join("\n")).toBe(oldText);
    expect(reconstructNew(diff).join("\n")).toBe(newText);
  });

  it("counts added and removed lines correctly for a pure addition", () => {
    const diff = diffLines("a\nb", "a\nb\nc\nd");
    const summary = summarizeDiff(diff);
    expect(summary).toEqual({ added: 2, removed: 0 });
  });

  it("counts added and removed lines correctly for a pure removal", () => {
    const diff = diffLines("a\nb\nc\nd", "a\nd");
    const summary = summarizeDiff(diff);
    expect(summary).toEqual({ added: 0, removed: 2 });
  });

  it("handles empty strings on either side", () => {
    const diffAllAdded = diffLines("", "x\ny");
    expect(summarizeDiff(diffAllAdded)).toEqual({ added: 2, removed: 0 });

    const diffAllRemoved = diffLines("x\ny", "");
    expect(summarizeDiff(diffAllRemoved)).toEqual({ added: 0, removed: 2 });

    expect(diffLines("", "")).toEqual([]);
  });
});
