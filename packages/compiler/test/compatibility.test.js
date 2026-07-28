import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";

import { describe, expect, it } from "vitest";

import {
  COMPATIBILITY_LEVELS,
  analyzeSourceCompatibility,
} from "../src/index.js";
import { compatibilityFixtures } from "@openforge/test-utils";

describe("analyzeSourceCompatibility", () => {
  for (const fixture of compatibilityFixtures) {
    it(`classifies ${fixture.id} as ${fixture.expectedLevel}`, async () => {
      const source = await readFile(fixture.entryPath, "utf8");
      const result = analyzeSourceCompatibility({
        filePath: fixture.relativeEntryPath,
        source,
      });

      expect(result.level).toBe(fixture.expectedLevel);
      expect(result.diagnostics.map(({ code }) => code)).toEqual(
        fixture.expectedDiagnostics,
      );
    });

    it(`does not mutate ${fixture.id}`, async () => {
      const before = await readFile(fixture.entryPath);
      const source = before.toString("utf8");

      analyzeSourceCompatibility({
        filePath: fixture.relativeEntryPath,
        source,
      });

      const after = await readFile(fixture.entryPath);
      expect(hash(after)).toBe(hash(before));
      expect(after.equals(before)).toBe(true);
    });
  }

  it("downgrades parser failures to code-only", () => {
    const result = analyzeSourceCompatibility({
      filePath: "app/page.jsx",
      source: "export default function Broken( {",
    });

    expect(result.level).toBe(COMPATIBILITY_LEVELS.CODE_ONLY);
    expect(result.diagnostics[0].code).toBe("OF_COMPAT_PARSE_ERROR");
  });

  it("rejects malformed analyzer input", () => {
    expect(() =>
      analyzeSourceCompatibility({ filePath: "", source: "" }),
    ).toThrow("filePath must be a non-empty string.");
  });
});

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}
