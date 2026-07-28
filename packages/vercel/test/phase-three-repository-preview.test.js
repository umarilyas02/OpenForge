import { randomBytes } from "node:crypto";

import { createGitHubConnectionManager } from "@openforge/github";
import { createSecretVault } from "@openforge/integration-security";
import { describe, expect, it, vi } from "vitest";

import { createVercelDeploymentManager } from "../src/index.js";

describe("Phase 3 repository-to-Preview journey", () => {
  it("connects an authorized GitHub repository and creates one validated Preview job", async () => {
    const vault = createSecretVault({
      keys: { primary: randomBytes(32) },
      activeKeyId: "primary",
    });
    const githubIdentityId = "github_identity_e2e";
    const githubToken = await vault.putSecret({
      provider: "github",
      connectionId: githubIdentityId,
      name: "user-access-token",
      value: "github-token-e2e",
    });
    const files = [
      {
        path: "app/page.jsx",
        source:
          "export default function Page() { return <main>OpenForge</main>; }",
      },
      {
        path: "package.json",
        source: '{"scripts":{"build":"next build"}}',
      },
    ];
    const githubTransport = {
      listInstallations: vi.fn(async () => [
        {
          id: 201,
          account: { id: 101, login: "openforge-user", type: "user" },
        },
      ]),
      listRepositories: vi.fn(async () => [
        {
          id: 301,
          owner: "openforge-user",
          name: "site",
          fullName: "openforge-user/site",
          defaultBranch: "main",
        },
      ]),
      listBranches: vi.fn(async () => [
        {
          name: "main",
          sha: "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa",
          protected: true,
        },
      ]),
      getRepositoryFiles: vi.fn(async () => structuredClone(files)),
    };
    const identity = {
      id: githubIdentityId,
      provider: "github",
      login: "openforge-user",
      accessTokenRef: githubToken.ref,
    };
    const github = createGitHubConnectionManager({
      transport: githubTransport,
      vault,
    });
    const repositoryConnection = await github.connect({
      projectId: "project_e2e",
      identity,
      installationId: 201,
      owner: "openforge-user",
      name: "site",
      branch: "main",
    });
    const inspection = await github.inspectRepository({
      identity,
      installationId: 201,
      owner: "openforge-user",
      name: "site",
      branch: "main",
    });
    expect(inspection.compatibility).toMatchObject({
      isolated: true,
      level: "supported",
    });

    const vercelInstallationId = "vercel_installation_e2e";
    const vercelToken = await vault.putSecret({
      provider: "vercel",
      connectionId: vercelInstallationId,
      name: "integration-access-token",
      value: "vercel-token-e2e",
    });
    const vercelConnection = {
      id: "vercel_connection_e2e",
      provider: "vercel",
      projectId: "project_e2e",
      installationId: vercelInstallationId,
      accessTokenRef: vercelToken.ref,
      teamId: "team_1",
      vercelProject: {
        id: "prj_site",
        name: "site",
        gitRepository: {
          type: "github",
          repo: repositoryConnection.repository.fullName,
          repoId: repositoryConnection.repository.id,
        },
      },
    };
    const vercelTransport = {
      listEnvironmentVariables: vi.fn(async () => [
        {
          id: "env_1",
          key: "DATABASE_URL",
          targets: ["preview"],
          type: "sensitive",
        },
      ]),
      createDeployment: vi.fn(async ({ source, target }) => ({
        id: "dpl_phase_three",
        url: "openforge-phase-three.vercel.app",
        readyState: "READY",
        target,
        source,
      })),
    };
    const deployment = createVercelDeploymentManager({
      transport: vercelTransport,
      vault,
      grantedScopes: { deployment: "write", project: "read" },
      validate: async () => ({
        valid: inspection.compatibility.level !== "code-only",
        diagnostics: inspection.compatibility.diagnostics,
      }),
    });
    const result = await deployment.createPreview({
      idempotencyKey: "phase-three-preview-e2e",
      connection: vercelConnection,
      source: {
        type: "github",
        repo: repositoryConnection.repository.fullName,
        repoId: repositoryConnection.repository.id,
        ref: repositoryConnection.branch.name,
        sha: repositoryConnection.branch.sha,
      },
      files,
      requiredEnvironmentKeys: ["DATABASE_URL"],
    });

    expect(result).toMatchObject({
      replayed: false,
      result: {
        deploymentId: "dpl_phase_three",
        target: "preview",
        status: {
          status: "ready",
          url: "https://openforge-phase-three.vercel.app",
        },
      },
    });
    expect(vercelTransport.createDeployment).toHaveBeenCalledTimes(1);
  });
});
