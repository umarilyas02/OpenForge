import { randomBytes } from "node:crypto";

import { createSecretVault } from "@openforge/integration-security";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createGitSynchronizer,
  diffSourceFiles,
  mergeSourceFiles,
} from "../src/index.js";

const BASE_SHA = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const REMOTE_SHA = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

describe("Git status and push", () => {
  let fixture;

  beforeEach(async () => {
    fixture = await createSyncFixture();
  });

  it("reports ahead and behind from the provider comparison", async () => {
    fixture.transport.compareCommits.mockResolvedValueOnce({
      status: "diverged",
      aheadBy: 2,
      behindBy: 1,
    });
    await expect(
      fixture.sync.status({
        connection: fixture.connection,
        localHeadSha: "cccccccccccccccccccccccccccccccccccccccc",
      }),
    ).resolves.toEqual({
      localHeadSha: "cccccccccccccccccccccccccccccccccccccccc",
      remoteHeadSha: BASE_SHA,
      ahead: 2,
      behind: 1,
      diverged: true,
    });
  });

  it("binds validation, diff, target, and content to one-time confirmation", async () => {
    const prepared = await fixture.sync.preparePush({
      connection: fixture.connection,
      files: changedFiles(),
      baseSha: BASE_SHA,
      message: "Update landing page",
      requestId: "request_push_1",
    });
    expect(prepared).toMatchObject({
      target: { owner: "openforge-user", name: "site", branch: "main" },
      baseSha: BASE_SHA,
      changes: [
        expect.objectContaining({ path: "app/page.jsx", type: "modify" }),
      ],
      validation: { valid: true, diagnostics: [] },
    });
    await expect(
      fixture.sync.push({
        connection: fixture.connection,
        confirmationToken: prepared.confirmationToken,
        confirmedTarget: {
          owner: "openforge-user",
          name: "other-site",
          branch: "main",
        },
      }),
    ).rejects.toMatchObject({ code: "OF_GITHUB_PUSH_TARGET_MISMATCH" });
    expect(fixture.transport.createCommit).not.toHaveBeenCalled();
  });

  it("routes a protected target through a feature branch and pull request", async () => {
    const prepared = await fixture.sync.preparePush({
      connection: fixture.connection,
      files: changedFiles(),
      baseSha: BASE_SHA,
      message: "Update landing page",
    });
    const result = await fixture.sync.push({
      connection: fixture.connection,
      confirmationToken: prepared.confirmationToken,
      confirmedTarget: prepared.target,
    });

    expect(result).toMatchObject({
      mode: "pull-request",
      commit: { sha: REMOTE_SHA },
      featureBranch: expect.stringMatching(
        /^openforge\/20260728000000-update-landing-page$/u,
      ),
      pullRequest: {
        number: 7,
        htmlUrl: "https://github.com/openforge-user/site/pull/7",
      },
    });
    expect(fixture.transport.createBranch).toHaveBeenCalledWith(
      expect.objectContaining({ sha: BASE_SHA }),
    );
    expect(fixture.transport.createCommit).toHaveBeenCalledWith(
      expect.objectContaining({
        baseSha: BASE_SHA,
        message: "Update landing page",
      }),
    );
    expect(fixture.transport.createPullRequest).toHaveBeenCalledWith(
      expect.objectContaining({ base: "main" }),
    );
  });

  it("pushes directly only when the target remains unprotected", async () => {
    fixture.connection.branch = {
      name: "develop",
      sha: BASE_SHA,
      protected: false,
    };
    fixture.transport.branches[0] = {
      name: "develop",
      sha: BASE_SHA,
      protected: false,
    };
    const prepared = await fixture.sync.preparePush({
      connection: fixture.connection,
      files: changedFiles(),
      baseSha: BASE_SHA,
      message: "Update preview",
    });
    const result = await fixture.sync.push({
      connection: fixture.connection,
      confirmationToken: prepared.confirmationToken,
      confirmedTarget: prepared.target,
    });

    expect(result).toEqual({
      mode: "direct",
      commit: { sha: REMOTE_SHA, htmlUrl: "https://github.test/commit/new" },
    });
    expect(fixture.transport.createBranch).not.toHaveBeenCalled();
    expect(fixture.transport.createPullRequest).not.toHaveBeenCalled();
  });

  it("rejects a stale remote before preparing or executing a push", async () => {
    fixture.transport.currentSha = REMOTE_SHA;
    await expect(
      fixture.sync.preparePush({
        connection: fixture.connection,
        files: changedFiles(),
        baseSha: BASE_SHA,
        message: "Stale update",
      }),
    ).rejects.toMatchObject({ code: "OF_GITHUB_REMOTE_CHANGED" });

    fixture.transport.currentSha = BASE_SHA;
    const prepared = await fixture.sync.preparePush({
      connection: fixture.connection,
      files: changedFiles(),
      baseSha: BASE_SHA,
      message: "Fresh update",
    });
    fixture.transport.branches[0].sha = REMOTE_SHA;
    await expect(
      fixture.sync.push({
        connection: fixture.connection,
        confirmationToken: prepared.confirmationToken,
        confirmedTarget: prepared.target,
      }),
    ).rejects.toMatchObject({ code: "OF_GITHUB_REMOTE_CHANGED" });
  });

  it("does not silently escalate into GitHub workflow writes", async () => {
    await expect(
      fixture.sync.preparePush({
        connection: fixture.connection,
        files: [
          ...baseFiles(),
          {
            path: ".github/workflows/deploy.yml",
            source: "name: deploy\n",
          },
        ],
        baseSha: BASE_SHA,
        message: "Add deploy workflow",
      }),
    ).rejects.toMatchObject({ code: "OF_GITHUB_WORKFLOW_SCOPE_REQUIRED" });
  });
});

describe("isolated pull and conflict fallback", () => {
  let fixture;

  beforeEach(async () => {
    fixture = await createSyncFixture();
    await fixture.sync.initialize({
      connection: fixture.connection,
      files: baseFiles(),
      remoteSha: BASE_SHA,
    });
  });

  it("previews and applies a clean three-way merge once", async () => {
    fixture.transport.currentSha = REMOTE_SHA;
    fixture.transport.files = [
      {
        path: "app/page.jsx",
        source:
          "export default function Page() { return <main>Remote</main>; }",
      },
      { path: "app/local.js", source: "export const local = true;\n" },
    ];
    const preview = await fixture.sync.preparePull({
      connection: fixture.connection,
      localFiles: [
        baseFiles()[0],
        { path: "app/local.js", source: "export const local = false;\n" },
      ],
    });
    expect(preview).toMatchObject({
      clean: true,
      remoteSha: REMOTE_SHA,
      conflicts: [],
    });
    expect(preview.files).toEqual([
      {
        path: "app/local.js",
        source: "export const local = false;\n",
      },
      {
        path: "app/page.jsx",
        source:
          "export default function Page() { return <main>Remote</main>; }",
      },
    ]);
    const apply = vi.fn(async (files) => ({ applied: files.length }));
    await expect(
      fixture.sync.applyPull({
        connection: fixture.connection,
        pullId: preview.id,
        previewHash: preview.previewHash,
        apply,
      }),
    ).resolves.toEqual({
      remoteSha: REMOTE_SHA,
      result: { applied: 2 },
    });
    expect(apply).toHaveBeenCalledTimes(1);
    await expect(
      fixture.sync.applyPull({
        connection: fixture.connection,
        pullId: preview.id,
        previewHash: preview.previewHash,
        apply,
      }),
    ).rejects.toMatchObject({ code: "OF_GITHUB_PULL_PREVIEW_REJECTED" });
  });

  it("returns concurrent changes for code-only resolution and does not apply", async () => {
    fixture.transport.currentSha = REMOTE_SHA;
    fixture.transport.files = [
      {
        path: "app/page.jsx",
        source:
          "export default function Page() { return <main>Remote</main>; }",
      },
      baseFiles()[1],
    ];
    const preview = await fixture.sync.preparePull({
      connection: fixture.connection,
      localFiles: [
        {
          path: "app/page.jsx",
          source:
            "export default function Page() { return <main>Local</main>; }",
        },
        baseFiles()[1],
      ],
    });
    expect(preview).toMatchObject({
      clean: false,
      conflicts: [
        {
          path: "app/page.jsx",
          kind: "content",
          resolutionMode: "code-only",
          compatibility: { local: "supported", remote: "supported" },
          markerPreview: expect.stringContaining("<<<<<<< LOCAL"),
        },
      ],
    });
    const apply = vi.fn();
    await expect(
      fixture.sync.applyPull({
        connection: fixture.connection,
        pullId: preview.id,
        previewHash: preview.previewHash,
        apply,
      }),
    ).rejects.toMatchObject({ code: "OF_GITHUB_PULL_CONFLICTS" });
    expect(apply).not.toHaveBeenCalled();
  });
});

describe("source diff and merge", () => {
  it("classifies deterministic add, modify, and delete changes", () => {
    expect(
      diffSourceFiles(
        [
          { path: "delete.js", source: "delete\n" },
          { path: "modify.js", source: "before\n" },
        ],
        [
          { path: "add.js", source: "add\n" },
          { path: "modify.js", source: "after\n" },
        ],
      ).map(({ path, type }) => ({ path, type })),
    ).toEqual([
      { path: "add.js", type: "add" },
      { path: "delete.js", type: "delete" },
      { path: "modify.js", type: "modify" },
    ]);
  });

  it("handles modify/delete conflicts without manufacturing source", () => {
    const result = mergeSourceFiles({
      baseFiles: [{ path: "app/page.jsx", source: "base" }],
      localFiles: [],
      remoteFiles: [{ path: "app/page.jsx", source: "remote" }],
    });
    expect(result).toMatchObject({
      clean: false,
      files: [],
      conflicts: [
        {
          path: "app/page.jsx",
          kind: "modify/delete",
          local: null,
          remote: "remote",
        },
      ],
    });
  });
});

async function createSyncFixture() {
  const vault = createSecretVault({
    keys: { primary: randomBytes(32) },
    activeKeyId: "primary",
  });
  const token = await vault.putSecret({
    provider: "github",
    connectionId: "identity_1",
    name: "user-access-token",
    value: "github-user-token",
  });
  const connection = {
    id: "connection_1",
    identityId: "identity_1",
    accessTokenRef: token.ref,
    repository: {
      owner: "openforge-user",
      name: "site",
      fullName: "openforge-user/site",
    },
    branch: { name: "main", sha: BASE_SHA, protected: true },
  };
  const transport = createSyncTransport();
  const validate = vi.fn(async () => ({ valid: true, diagnostics: [] }));
  const sync = createGitSynchronizer({
    transport,
    vault,
    validate,
    clock: () => new Date("2026-07-28T00:00:00.000Z"),
  });
  return { connection, transport, validate, sync };
}

function createSyncTransport() {
  const transport = {
    currentSha: BASE_SHA,
    files: baseFiles(),
    branches: [{ name: "main", sha: BASE_SHA, protected: true }],
    getRef: vi.fn(async () => ({
      ref: "refs/heads/main",
      sha: transport.currentSha,
    })),
    compareCommits: vi.fn(async () => ({
      status: "identical",
      aheadBy: 0,
      behindBy: 0,
    })),
    getRepositoryFiles: vi.fn(async () => structuredClone(transport.files)),
    listBranches: vi.fn(async () => structuredClone(transport.branches)),
    getBranch: vi.fn(async ({ branch }) =>
      structuredClone(
        transport.branches.find((candidate) => candidate.name === branch),
      ),
    ),
    createBranch: vi.fn(async ({ branch, sha }) => {
      transport.branches.push({ name: branch, sha, protected: false });
      return { ref: `refs/heads/${branch}`, sha };
    }),
    createCommit: vi.fn(async ({ branch, files }) => {
      transport.files = structuredClone(files);
      const target = transport.branches.find(
        (candidate) => candidate.name === branch,
      );
      target.sha = REMOTE_SHA;
      return {
        sha: REMOTE_SHA,
        htmlUrl: "https://github.test/commit/new",
      };
    }),
    createPullRequest: vi.fn(async () => ({
      number: 7,
      state: "open",
      htmlUrl: "https://github.com/openforge-user/site/pull/7",
    })),
  };
  return transport;
}

function baseFiles() {
  return [
    {
      path: "app/page.jsx",
      source: "export default function Page() { return <main>Base</main>; }",
    },
    { path: "app/local.js", source: "export const local = true;\n" },
  ];
}

function changedFiles() {
  return [
    {
      path: "app/page.jsx",
      source: "export default function Page() { return <main>Changed</main>; }",
    },
    baseFiles()[1],
  ];
}
