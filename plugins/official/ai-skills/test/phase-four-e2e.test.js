import { createHash } from "node:crypto";

import {
  collectAIStream,
  createAIProposalPipeline,
  createAIProviderRegistry,
  createFakeAIProvider,
  evaluateAISkillRun,
} from "@openforge/ai";
import { describe, expect, it, vi } from "vitest";

import { getOfficialAISkill } from "../src/index.js";

const originalSource = "export const heading = 'Before';\n";
const updatedSource = "export const heading = 'Build portable apps';\n";
const model = {
  schemaVersion: 1,
  provider: "fixture",
  model: "proposal-model",
  inputModalities: ["text"],
  outputModalities: ["text", "json"],
  streaming: true,
  tools: { supported: false, parallel: false },
  structuredOutput: { supported: true, strict: true },
  limits: { inputTokens: 10_000, outputTokens: 4_000 },
};
const providerOutput = {
  summary: "Proposes the requested heading update.",
  issues: [],
  proposal: {
    schemaVersion: 1,
    intent: {
      summary: "Update the selected heading.",
      rationale: "The new heading matches the user's explicit request.",
    },
    baseRevision: "revision-4",
    changes: [
      {
        path: "app/page.js",
        operation: "update",
        expectedSha256: createHash("sha256")
          .update(originalSource)
          .digest("hex"),
        content: updatedSource,
      },
    ],
  },
};

describe("Phase 4 BYOK proposal lifecycle", () => {
  it("keeps a configured provider proposal unapplied until exact approval", async () => {
    const registry = createAIProviderRegistry();
    registry.register(
      createFakeAIProvider({
        capabilities: [model],
        scripts: [
          [
            { type: "start", responseId: "fixture-response" },
            { type: "structured-output", value: providerOutput },
            { type: "finish", reason: "stop" },
          ],
        ],
      }),
    );
    const skill = getOfficialAISkill("page-section-proposal");
    const result = await collectAIStream(
      registry.stream({
        selection: { provider: model.provider, model: model.model },
        request: {
          messages: [
            {
              role: "user",
              content: [{ type: "text", text: "Update the selected heading." }],
            },
          ],
          responseSchema: skill.outputSchema,
        },
      }),
    );
    evaluateAISkillRun({
      definition: skill,
      input: {
        request: "Update the selected heading.",
        baseRevision: "revision-4",
      },
      output: result.structuredOutput,
      providerCapabilities: model,
      providedContext: ["selectedPage", "selectedFiles"],
      grantedPermissions: ["project.readFiles", "editor.proposePatch"],
    });

    const applyChanges = vi.fn(async ({ files }) => files);
    const pipeline = createAIProposalPipeline({
      validators: {
        format: async ({ files }) => ({ files }),
        lint: async () => ({ ok: true, diagnostics: [] }),
        test: async () => ({ ok: true, diagnostics: [] }),
        build: async () => ({ ok: true, diagnostics: [] }),
      },
    });
    const currentFiles = [{ path: "app/page.js", source: originalSource }];
    const validation = await pipeline.validate({
      proposal: result.structuredOutput.proposal,
      currentFiles,
      currentRevision: "revision-4",
    });
    expect(validation.status).toBe("passed");
    expect(applyChanges).not.toHaveBeenCalled();

    const approval = await pipeline.approve({
      proposalId: validation.id,
      approvedPaths: ["app/page.js"],
      currentFiles,
      currentRevision: "revision-4",
      actor: "fixture-user",
    });
    expect(applyChanges).not.toHaveBeenCalled();
    await expect(
      pipeline.apply({
        approvalId: approval.id,
        confirmation: "wrong confirmation",
        currentFiles,
        currentRevision: "revision-4",
        applyChanges,
        actor: "fixture-user",
      }),
    ).rejects.toMatchObject({ code: "OF_AI_APPLY_CONFIRMATION_REQUIRED" });
    expect(applyChanges).not.toHaveBeenCalled();

    await pipeline.apply({
      approvalId: approval.id,
      confirmation: approval.confirmation,
      currentFiles,
      currentRevision: "revision-4",
      applyChanges,
      actor: "fixture-user",
    });
    expect(applyChanges).toHaveBeenCalledOnce();
  });
});
