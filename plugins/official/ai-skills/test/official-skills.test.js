import { readFile } from "node:fs/promises";

import { evaluateAISkillRun } from "@openforge/ai";
import { describe, expect, it } from "vitest";

import { getOfficialAISkill, officialAISkills } from "../src/index.js";

const fixtures = JSON.parse(
  await readFile(
    new URL("../fixtures/skill-runs.json", import.meta.url),
    "utf8",
  ),
);
const evaluation = JSON.parse(
  await readFile(
    new URL("../evals/official-skills.eval.json", import.meta.url),
    "utf8",
  ),
);
const providers = {
  text: {
    inputModalities: ["text"],
    tools: { supported: false },
    structuredOutput: { supported: true },
  },
  vision: {
    inputModalities: ["text", "image"],
    tools: { supported: false },
    structuredOutput: { supported: true },
  },
};

describe("official AI skills", () => {
  it("ships exactly the four proposal-only Phase 4 skills", () => {
    expect(officialAISkills.map(({ id }) => id)).toEqual([
      "page-section-proposal",
      "accessibility-review",
      "responsive-review",
      "seo-copy-assistance",
    ]);
    expect(
      officialAISkills.every(
        ({ patchPolicy }) => patchPolicy === "proposal-only",
      ),
    ).toBe(true);
  });

  it.each(evaluation.cases)("$name", (testCase) => {
    const definition = getOfficialAISkill(testCase.skillId);
    const fixture = fixtures[testCase.skillId];
    const run = () =>
      evaluateAISkillRun({
        definition,
        input: fixture.input,
        output: fixture.output,
        providerCapabilities: providers[testCase.provider],
        providedContext: testCase.context,
        grantedPermissions: testCase.permissions,
      });
    if (testCase.expected === "valid") {
      expect(run()).toMatchObject({ valid: true, skillId: testCase.skillId });
    } else {
      expect(run).toThrow(expect.objectContaining({ code: testCase.expected }));
    }
  });

  it("rejects a provider response containing a likely credential", () => {
    const definition = getOfficialAISkill("seo-copy-assistance");
    expect(() =>
      evaluateAISkillRun({
        definition,
        input: fixtures[definition.id].input,
        output: {
          ...fixtures[definition.id].output,
          summary: "api_key=sk-live-secret-value-that-cannot-escape",
        },
        providerCapabilities: providers.text,
        providedContext: ["selectedPage", "selectedFiles"],
        grantedPermissions: ["project.readFiles", "editor.proposePatch"],
      }),
    ).toThrow(expect.objectContaining({ code: "OF_AI_SKILL_OUTPUT_SECRET" }));
  });
});
