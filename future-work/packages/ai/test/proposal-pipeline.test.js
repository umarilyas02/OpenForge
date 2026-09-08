import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";

import { describe, expect, it, vi } from "vitest";

import { createAIProposalPipeline, parseAIProposal } from "../src/index.js";

const pageSource =
  "export default function Page() {\n  return <main>Before</main>;\n}\n";
const currentFiles = [
  { path: "app/page.jsx", source: pageSource },
  {
    path: "lib/unchanged.js",
    source: "export const unchanged = true;\n",
  },
];
const updatedPage =
  "export default function Page() {\n  return <main>After</main>;\n}\n";

function sha256(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function proposal(changes = defaultChanges()) {
  return {
    schemaVersion: 1,
    intent: {
      summary: "Update the page and add a component.",
      rationale: "Implements the explicitly requested source change.",
    },
    baseRevision: "revision-1",
    changes,
  };
}

function defaultChanges() {
  return [
    {
      path: "app/page.jsx",
      operation: "update",
      expectedSha256: sha256(pageSource),
      content: updatedPage,
    },
    {
      path: "components/Hero.jsx",
      operation: "create",
      content:
        "export function Hero() {\n  return <section>Hero</section>;\n}\n",
    },
  ];
}

function validators(overrides = {}) {
  const workspaceValidator = async ({ workspacePath }) => {
    expect(path.dirname(workspacePath)).toBe(path.resolve(os.tmpdir()));
    await expect(
      readFile(path.join(workspacePath, "app", "page.jsx"), "utf8"),
    ).resolves.toContain("After");
    return { ok: true, diagnostics: [] };
  };
  return {
    format: vi.fn(async ({ files }) => ({ files })),
    lint: vi.fn(workspaceValidator),
    test: vi.fn(workspaceValidator),
    build: vi.fn(workspaceValidator),
    ...overrides,
  };
}

describe("AI proposal schema", () => {
  it("normalizes a structured intent and digest-bound change list", () => {
    expect(parseAIProposal(proposal())).toMatchObject({
      schemaVersion: 1,
      baseRevision: "revision-1",
      changes: [
        {
          path: "app/page.jsx",
          operation: "update",
          expectedSha256: sha256(pageSource),
        },
        {
          path: "components/Hero.jsx",
          operation: "create",
        },
      ],
    });
  });

  it("accepts the workspace lifecycle's numeric revisions", () => {
    expect(
      parseAIProposal({
        ...proposal(),
        baseRevision: 3,
      }).baseRevision,
    ).toBe(3);
  });

  it("rejects traversal, protected files, and duplicate paths", () => {
    expect(() =>
      parseAIProposal(
        proposal([
          {
            path: "../outside.js",
            operation: "create",
            content: "unsafe",
          },
        ]),
      ),
    ).toThrow();
    expect(() =>
      parseAIProposal(
        proposal([
          {
            path: ".env.production",
            operation: "create",
            content: "SECRET=value",
          },
        ]),
      ),
    ).toThrowError(
      expect.objectContaining({ code: "OF_AI_PROPOSAL_PATH_PROTECTED" }),
    );
    expect(() =>
      parseAIProposal(
        proposal([
          defaultChanges()[0],
          { ...defaultChanges()[0], content: "duplicate" },
        ]),
      ),
    ).toThrowError(
      expect.objectContaining({ code: "OF_AI_PROPOSAL_CHANGES_INVALID" }),
    );
  });
});

describe("AI proposal validation", () => {
  it("formats and validates only inside a disposable workspace", async () => {
    const configured = validators();
    const pipeline = createAIProposalPipeline({ validators: configured });

    const result = await pipeline.validate({
      proposal: proposal(),
      currentFiles,
      currentRevision: "revision-1",
    });

    expect(result.status).toBe("passed");
    expect(result.reports.map(({ name, ok }) => ({ name, ok }))).toEqual([
      { name: "format", ok: true },
      { name: "security", ok: true },
      { name: "compatibility", ok: true },
      { name: "lint", ok: true },
      { name: "test", ok: true },
      { name: "build", ok: true },
    ]);
    expect(result.fileDiffs).toEqual([
      expect.objectContaining({
        path: "app/page.jsx",
        patch: expect.stringContaining("+  return <main>After</main>;"),
      }),
      expect.objectContaining({
        path: "components/Hero.jsx",
        patch: expect.stringContaining("+++ b/components/Hero.jsx"),
      }),
    ]);
    expect(configured.lint).toHaveBeenCalledOnce();
  });

  it("rejects stale file digests before materializing validators", async () => {
    const configured = validators();
    const pipeline = createAIProposalPipeline({ validators: configured });
    const result = await pipeline.validate({
      proposal: proposal([
        {
          ...defaultChanges()[0],
          expectedSha256: "0".repeat(64),
        },
      ]),
      currentFiles,
      currentRevision: "revision-1",
    });

    expect(result).toMatchObject({
      status: "failed",
      reports: [
        expect.objectContaining({
          name: "patch",
          ok: false,
          diagnostics: [
            expect.objectContaining({ code: "OF_AI_PROPOSAL_FILE_STALE" }),
          ],
        }),
      ],
    });
    expect(configured.lint).not.toHaveBeenCalled();
  });

  it("blocks secrets, dangerous execution, and incompatible source", async () => {
    const pipeline = createAIProposalPipeline({ validators: validators() });
    const secret = await pipeline.validate({
      proposal: proposal([
        {
          path: "lib/config.js",
          operation: "create",
          content:
            'export const OPENAI_API_KEY = "sk-proj-abcdefghijklmnopqrstuvwxyz";\n',
        },
      ]),
      currentFiles,
      currentRevision: "revision-1",
    });
    const dangerous = await pipeline.validate({
      proposal: proposal([
        {
          path: "lib/run.js",
          operation: "create",
          content: 'export const run = () => eval("unsafe");\n',
        },
      ]),
      currentFiles,
      currentRevision: "revision-1",
    });
    const incompatible = await pipeline.validate({
      proposal: proposal([
        {
          path: "app/broken.jsx",
          operation: "create",
          content: "export default function Broken( {",
        },
      ]),
      currentFiles,
      currentRevision: "revision-1",
    });

    expect(secret.reports.at(-1)).toMatchObject({
      name: "security",
      ok: false,
      diagnostics: [
        expect.objectContaining({ code: "OF_AI_PROPOSAL_SECRET" }),
        expect.objectContaining({ code: "OF_AI_PROPOSAL_SECRET" }),
      ],
    });
    expect(dangerous.reports.at(-1)).toMatchObject({
      name: "security",
      ok: false,
      diagnostics: [expect.objectContaining({ code: "OF_AI_PROPOSAL_EVAL" })],
    });
    expect(incompatible.reports.at(-1)).toMatchObject({
      name: "compatibility",
      ok: false,
    });
  });

  it("fails a formatter that touches unrelated source", async () => {
    const pipeline = createAIProposalPipeline({
      validators: validators({
        format: vi.fn(async ({ files }) => ({
          files: files.map((file) =>
            file.path === "lib/unchanged.js"
              ? { ...file, source: "export const changed = true;\n" }
              : file,
          ),
        })),
      }),
    });

    const result = await pipeline.validate({
      proposal: proposal(),
      currentFiles,
      currentRevision: "revision-1",
    });

    expect(result).toMatchObject({
      status: "failed",
      reports: [
        expect.objectContaining({
          name: "format",
          diagnostics: [
            expect.objectContaining({
              code: "OF_AI_FORMAT_SCOPE_VIOLATION",
            }),
          ],
        }),
      ],
    });
  });

  it("keeps partial compatibility diagnostics as non-blocking warnings", async () => {
    const pipeline = createAIProposalPipeline({ validators: validators() });
    const result = await pipeline.validate({
      proposal: proposal([
        ...defaultChanges(),
        {
          path: "lib/lazy.js",
          operation: "create",
          content:
            "export async function load(name) {\n  return import(name);\n}\n",
        },
      ]),
      currentFiles,
      currentRevision: "revision-1",
    });

    expect(result.status).toBe("passed");
    expect(
      result.reports.find(({ name }) => name === "compatibility"),
    ).toMatchObject({
      ok: true,
      diagnostics: [
        expect.objectContaining({
          code: "OF_COMPAT_DYNAMIC_IMPORT",
          severity: "warning",
        }),
      ],
    });
  });

  it("records failed lint, test, and build stages without leaking exceptions", async () => {
    const pipeline = createAIProposalPipeline({
      validators: validators({
        lint: vi.fn(async () => {
          throw new Error("private lint output");
        }),
        test: vi.fn(async () => ({ ok: false })),
        build: vi.fn(async () => ({ ok: true })),
      }),
    });

    const result = await pipeline.validate({
      proposal: proposal(),
      currentFiles,
      currentRevision: "revision-1",
    });

    expect(result.status).toBe("failed");
    expect(result.reports.slice(-3)).toEqual([
      expect.objectContaining({
        name: "lint",
        ok: false,
        diagnostics: [
          expect.objectContaining({
            message: "The AI proposal lint stage failed.",
          }),
        ],
      }),
      expect.objectContaining({ name: "test", ok: false }),
      expect.objectContaining({ name: "build", ok: true }),
    ]);
    expect(JSON.stringify(result)).not.toContain("private lint output");
  });
});

describe("selective approval and explicit apply", () => {
  it("revalidates a selected subset and applies only exact confirmed files once", async () => {
    const audit = vi.fn();
    const applyChanges = vi.fn(async ({ changes, files }) => ({
      paths: changes.map(({ path }) => path),
      fileCount: files.length,
    }));
    const pipeline = createAIProposalPipeline({
      validators: validators(),
      audit,
    });
    const validation = await pipeline.validate({
      proposal: proposal(),
      currentFiles,
      currentRevision: "revision-1",
    });
    const approval = await pipeline.approve({
      proposalId: validation.id,
      approvedPaths: ["app/page.jsx"],
      currentFiles,
      currentRevision: "revision-1",
      actor: "user:1",
    });

    expect(approval.approvedPaths).toEqual(["app/page.jsx"]);
    await expect(
      pipeline.apply({
        approvalId: approval.id,
        confirmation: "wrong",
        currentFiles,
        currentRevision: "revision-1",
        applyChanges,
        actor: "user:1",
      }),
    ).rejects.toMatchObject({
      code: "OF_AI_APPLY_CONFIRMATION_REQUIRED",
    });
    expect(applyChanges).not.toHaveBeenCalled();

    await expect(
      pipeline.apply({
        approvalId: approval.id,
        confirmation: approval.confirmation,
        currentFiles,
        currentRevision: "revision-1",
        applyChanges,
        actor: "user:1",
      }),
    ).resolves.toMatchObject({
      applied: true,
      result: { paths: ["app/page.jsx"], fileCount: 2 },
    });
    expect(applyChanges).toHaveBeenCalledWith(
      expect.objectContaining({
        changes: [
          expect.objectContaining({
            path: "app/page.jsx",
            operation: "update",
          }),
        ],
      }),
    );
    await expect(
      pipeline.apply({
        approvalId: approval.id,
        confirmation: approval.confirmation,
        currentFiles,
        currentRevision: "revision-1",
        applyChanges,
        actor: "user:1",
      }),
    ).rejects.toMatchObject({ code: "OF_AI_APPROVAL_USED" });
    expect(audit.mock.calls.map(([event]) => event.action)).toEqual([
      "ai.proposal.validated",
      "ai.proposal.approved",
      "ai.proposal.apply-started",
      "ai.proposal.applied",
    ]);
  });

  it("rejects approval and apply after the project changes", async () => {
    const pipeline = createAIProposalPipeline({ validators: validators() });
    const validation = await pipeline.validate({
      proposal: proposal(),
      currentFiles,
      currentRevision: "revision-1",
    });
    const changedFiles = currentFiles.map((file) =>
      file.path === "app/page.jsx"
        ? { ...file, source: `${file.source}// changed\n` }
        : file,
    );

    await expect(
      pipeline.approve({
        proposalId: validation.id,
        approvedPaths: ["app/page.jsx"],
        currentFiles: changedFiles,
        currentRevision: "revision-1",
        actor: "user:1",
      }),
    ).rejects.toMatchObject({ code: "OF_AI_PROPOSAL_STALE" });
  });
});
