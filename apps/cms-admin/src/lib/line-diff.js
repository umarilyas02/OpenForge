/**
 * A small, dependency-free line-based diff for previewing a revision
 * against the page's current source in the Revision History panel. Not a
 * general-purpose diff library — just a classic longest-common-subsequence
 * walk over the two files' lines, which is all a side-by-side/unified
 * revision preview needs, and keeps this feature free of a new runtime
 * dependency for what's fundamentally a display concern (the actual
 * restore path never touches this file — see source-content-actions.js's
 * restorePageRevision, which writes the historical source back verbatim).
 *
 * @param {string} oldText
 * @param {string} newText
 * @returns {Array<{ type: "equal" | "removed" | "added", line: string }>}
 */
export function diffLines(oldText, newText) {
  const oldLines = splitLines(oldText);
  const newLines = splitLines(newText);
  const lcs = longestCommonSubsequenceTable(oldLines, newLines);

  const ops = [];
  let i = oldLines.length;
  let j = newLines.length;
  while (i > 0 && j > 0) {
    if (oldLines[i - 1] === newLines[j - 1]) {
      ops.push({ type: "equal", line: oldLines[i - 1] });
      i -= 1;
      j -= 1;
    } else if (lcs[i - 1][j] >= lcs[i][j - 1]) {
      ops.push({ type: "removed", line: oldLines[i - 1] });
      i -= 1;
    } else {
      ops.push({ type: "added", line: newLines[j - 1] });
      j -= 1;
    }
  }
  while (i > 0) {
    ops.push({ type: "removed", line: oldLines[i - 1] });
    i -= 1;
  }
  while (j > 0) {
    ops.push({ type: "added", line: newLines[j - 1] });
    j -= 1;
  }
  ops.reverse();
  return ops;
}

/** @returns {{ added: number, removed: number }} */
export function summarizeDiff(diff) {
  let added = 0;
  let removed = 0;
  for (const op of diff) {
    if (op.type === "added") added += 1;
    else if (op.type === "removed") removed += 1;
  }
  return { added, removed };
}

function splitLines(text) {
  if (text === "") return [];
  return text.split("\n");
}

/**
 * Standard prefix LCS table: table[i][j] is the LCS length of
 * oldLines[0..i) and newLines[0..j), which is what diffLines' backward
 * reconstruction (starting at [oldLines.length][newLines.length] and
 * walking toward [0][0]) expects.
 */
function longestCommonSubsequenceTable(oldLines, newLines) {
  const rows = oldLines.length;
  const cols = newLines.length;
  const table = Array.from({ length: rows + 1 }, () => new Array(cols + 1).fill(0));
  for (let i = 1; i <= rows; i += 1) {
    for (let j = 1; j <= cols; j += 1) {
      table[i][j] =
        oldLines[i - 1] === newLines[j - 1]
          ? table[i - 1][j - 1] + 1
          : Math.max(table[i - 1][j], table[i][j - 1]);
    }
  }
  return table;
}
