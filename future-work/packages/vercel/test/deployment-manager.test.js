import { randomBytes } from "node:crypto";

import { createSecretVault } from "@openforge/integration-security";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createVercelDeploymentManager,
  safeDeploymentUrl,
  scanSourceSecrets,
} from "../src/index.js";

const PREVIEW_SHA = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
const DEPLOYMENT_SCOPES = { deployment: "write", project: "read" };

describe("deployment preflight", () => {
  let fixture;

  beforeEach(async () => {
    fixture = await createDeploymentFixture();
  });

  it("passes validation, repository, secret, and Preview environment checks", async () => {
    await expect(
      fixture.manager.preflight({
        connection: fixture.connection,
        source: source(),
        files: sourceFiles(),
        requiredEnvironmentKeys: ["DATABASE_URL"],
      }),
    ).resolves.toMatchObject({
      ready: true,
      checks: {
        validation: true,
        secrets: true,
        environment: true,
        repository: true,
      },
      secretFindings: [],
      missingEnvironmentKeys: [],
      source: source(),
      filesHash: expect.stringMatching(/^[a-f0-9]{64}$/u),
    });
  });

  it("blocks leaked secrets without returning the matched value", async () => {
    const leaked = "ghp_abcdefghijklmnopqrstuvwxyz123456";
    const findings = scanSourceSecrets([
      {
        path: "app/config.js",
        source: `export const token = "${leaked}";`,
      },
    ]);
    expect(findings).toEqual([
      {
        path: "app/config.js",
        line: 1,
        column: 23,
        type: "github-token",
        severity: "block",
        fingerprint: expect.stringMatching(/^[a-f0-9]{16}$/u),
      },
    ]);
    expect(JSON.stringify(findings)).not.toContain(leaked);

    await expect(
      fixture.manager.createPreview({
        idempotencyKey: "preview-secret-leak",
        connection: fixture.connection,
        source: source(),
        files: [
          {
            path: "app/config.js",
            source: `export const token = "${leaked}";`,
          },
        ],
      }),
    ).rejects.toMatchObject({
      code: "OF_VERCEL_PREFLIGHT_FAILED",
      details: { checks: { secrets: false } },
    });
    expect(fixture.transport.createDeployment).not.toHaveBeenCalled();
  });

  it("reports missing environment keys, repository mismatch, and validation failures", async () => {
    fixture.validate.mockResolvedValueOnce({
      valid: false,
      diagnostics: [{ code: "BUILD_FAILED", message: "Build failed" }],
    });
    const result = await fixture.manager.preflight({
      connection: fixture.connection,
      source: { ...source(), repo: "openforge-user/other" },
      files: sourceFiles(),
      requiredEnvironmentKeys: ["MISSING_KEY"],
    });
    expect(result).toMatchObject({
      ready: false,
      checks: {
        validation: false,
        environment: false,
        repository: false,
      },
      missingEnvironmentKeys: ["MISSING_KEY"],
    });
  });
});

describe("Preview deployment jobs", () => {
  let fixture;

  beforeEach(async () => {
    fixture = await createDeploymentFixture();
  });

  it("creates one Preview deployment across idempotent retries", async () => {
    const request = {
      idempotencyKey: "preview-deployment-1",
      connection: fixture.connection,
      source: source(),
      files: sourceFiles(),
      requiredEnvironmentKeys: ["DATABASE_URL"],
      requestId: "request_1",
    };
    const first = await fixture.manager.createPreview(request);
    const second = await fixture.manager.createPreview(request);

    expect(first).toMatchObject({
      replayed: false,
      result: {
        deploymentId: "dpl_preview",
        target: "preview",
        status: {
          status: "queued",
          url: "https://site-preview.vercel.app",
        },
      },
    });
    expect(second).toEqual({ ...first, replayed: true });
    expect(fixture.transport.createDeployment).toHaveBeenCalledTimes(1);
    expect(fixture.transport.createDeployment).toHaveBeenCalledWith(
      expect.objectContaining({ target: "preview", source: source() }),
    );
  });

  it("binds idempotency to scanned files and required environment keys", async () => {
    const request = {
      idempotencyKey: "preview-deployment-2",
      connection: fixture.connection,
      source: source(),
      files: sourceFiles(),
      requiredEnvironmentKeys: ["DATABASE_URL"],
    };
    await fixture.manager.createPreview(request);
    await expect(
      fixture.manager.createPreview({
        ...request,
        files: [
          {
            path: "app/page.jsx",
            source: "export default function Page() { return <div />; }",
          },
        ],
      }),
    ).rejects.toMatchObject({ code: "OF_IDEMPOTENCY_INPUT_MISMATCH" });
  });

  it("refreshes safe failure state and returns redacted bounded logs", async () => {
    const created = await fixture.manager.createPreview({
      idempotencyKey: "preview-deployment-3",
      connection: fixture.connection,
      source: source(),
      files: sourceFiles(),
    });
    fixture.transport.deployments.set("dpl_preview", {
      id: "dpl_preview",
      url: "site-preview.vercel.app",
      readyState: "ERROR",
      target: "preview",
      errorCode: "BUILD_FAILED",
    });
    const refreshed = await fixture.manager.refresh({
      connection: fixture.connection,
      jobId: created.result.id,
    });
    expect(refreshed.status).toMatchObject({
      status: "failed",
      error: {
        code: "BUILD_FAILED",
        message: "The project build failed. Review the sanitized build logs.",
      },
    });
    const events = await fixture.manager.logs({
      connection: fixture.connection,
      jobId: created.result.id,
    });
    expect(events).toEqual([
      {
        type: "stderr",
        createdAt: 123,
        text: "DATABASE_URL=[REDACTED]",
        statusCode: null,
      },
      {
        type: "stdout",
        createdAt: 124,
        text: "Request Authorization: [REDACTED]",
        statusCode: 500,
      },
    ]);
  });
});

describe("explicit Production promotion", () => {
  let fixture;
  let preview;

  beforeEach(async () => {
    fixture = await createDeploymentFixture();
    preview = await fixture.manager.createPreview({
      idempotencyKey: "preview-for-promotion",
      connection: fixture.connection,
      source: source(),
      files: sourceFiles(),
    });
    fixture.transport.deployments.set("dpl_preview", {
      id: "dpl_preview",
      url: "site-preview.vercel.app",
      readyState: "READY",
      target: "preview",
      readyAt: 456,
    });
  });

  it("requires exact confirmation and creates one Production build from the same source", async () => {
    const prepared = await fixture.manager.prepareProduction({
      connection: fixture.connection,
      jobId: preview.result.id,
    });
    expect(prepared).toMatchObject({
      target: {
        projectId: "prj_site",
        deploymentId: "dpl_preview",
        environment: "production",
      },
      source: source(),
      previewUrl: "https://site-preview.vercel.app",
      warning: expect.stringContaining("live traffic"),
    });
    await expect(
      fixture.manager.promote({
        connection: fixture.connection,
        confirmationToken: prepared.confirmationToken,
        confirmedTarget: { ...prepared.target, projectId: "prj_other" },
      }),
    ).rejects.toMatchObject({ code: "OF_VERCEL_PROMOTION_TARGET_MISMATCH" });

    const first = await fixture.manager.promote({
      connection: fixture.connection,
      confirmationToken: prepared.confirmationToken,
      confirmedTarget: prepared.target,
      requestId: "request_production_1",
    });
    const second = await fixture.manager.promote({
      connection: fixture.connection,
      confirmationToken: prepared.confirmationToken,
      confirmedTarget: prepared.target,
      requestId: "request_production_1",
    });
    expect(first).toMatchObject({
      replayed: false,
      result: {
        deploymentId: "dpl_production",
        target: "production",
        promotedFrom: "dpl_preview",
      },
    });
    expect(second).toEqual({ ...first, replayed: true });
    expect(
      fixture.transport.createDeployment.mock.calls.filter(
        ([input]) => input.target === "production",
      ),
    ).toHaveLength(1);
    expect(
      fixture.transport.createDeployment.mock.calls.find(
        ([input]) => input.target === "production",
      )[0].source,
    ).toEqual(source());
  });

  it("does not prepare a queued or failed Preview for Production", async () => {
    fixture.transport.deployments.set("dpl_preview", {
      id: "dpl_preview",
      readyState: "BUILDING",
      target: "preview",
    });
    await expect(
      fixture.manager.prepareProduction({
        connection: fixture.connection,
        jobId: preview.result.id,
      }),
    ).rejects.toMatchObject({ code: "OF_VERCEL_PROMOTION_NOT_READY" });
  });
});

describe("deployment safety helpers", () => {
  it("accepts safe HTTPS hosts and rejects credentials or local URLs", () => {
    expect(safeDeploymentUrl("site-preview.vercel.app")).toBe(
      "https://site-preview.vercel.app",
    );
    expect(safeDeploymentUrl("https://user:pass@example.com")).toBeNull();
    expect(safeDeploymentUrl("http://localhost:3000")).toBeNull();
  });

  it("requires the exact deployment scope set", async () => {
    const fixture = await createDeploymentFixture({ createManager: false });
    expect(() =>
      createVercelDeploymentManager({
        transport: fixture.transport,
        vault: fixture.vault,
        grantedScopes: { deployment: "write" },
      }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_SCOPE_POLICY_VIOLATION" }),
    );
  });
});

async function createDeploymentFixture({ createManager = true } = {}) {
  const vault = createSecretVault({
    keys: { primary: randomBytes(32) },
    activeKeyId: "primary",
  });
  const installationId = "vercel_installation_1";
  const access = await vault.putSecret({
    provider: "vercel",
    connectionId: installationId,
    name: "integration-access-token",
    value: "vercel-access-token",
  });
  const connection = {
    id: "vercel_connection_1",
    provider: "vercel",
    projectId: "project_1",
    installationId,
    accessTokenRef: access.ref,
    teamId: "team_1",
    vercelProject: {
      id: "prj_site",
      name: "site",
      gitRepository: {
        type: "github",
        repo: "openforge-user/site",
        repoId: 301,
      },
    },
  };
  const transport = createDeploymentTransport();
  const validate = vi.fn(async () => ({ valid: true, diagnostics: [] }));
  return {
    vault,
    connection,
    transport,
    validate,
    manager: createManager
      ? createVercelDeploymentManager({
          transport,
          vault,
          grantedScopes: DEPLOYMENT_SCOPES,
          validate,
          clock: () => new Date("2026-07-28T00:00:00.000Z"),
        })
      : null,
  };
}

function createDeploymentTransport() {
  const deployments = new Map();
  const transport = {
    deployments,
    listEnvironmentVariables: vi.fn(async () => [
      {
        id: "env_1",
        key: "DATABASE_URL",
        targets: ["preview", "production"],
        type: "sensitive",
      },
    ]),
    createDeployment: vi.fn(async ({ target }) => {
      const deployment =
        target === "production"
          ? {
              id: "dpl_production",
              url: "site.vercel.app",
              readyState: "QUEUED",
              target,
            }
          : {
              id: "dpl_preview",
              url: "site-preview.vercel.app",
              readyState: "QUEUED",
              target,
            };
      deployments.set(deployment.id, deployment);
      return structuredClone(deployment);
    }),
    getDeployment: vi.fn(async ({ deploymentId }) =>
      structuredClone(deployments.get(deploymentId)),
    ),
    getDeploymentEvents: vi.fn(async () => [
      {
        type: "stderr",
        createdAt: 123,
        text: "DATABASE_URL=postgres://user:password@database.test/app",
      },
      {
        type: "custom-provider-event",
        createdAt: 124,
        text: "Request Authorization: Bearer private-token-value",
        statusCode: 500,
      },
    ]),
  };
  return transport;
}

function source() {
  return {
    type: "github",
    repo: "openforge-user/site",
    repoId: 301,
    ref: "main",
    sha: PREVIEW_SHA,
  };
}

function sourceFiles() {
  return [
    {
      path: "app/page.jsx",
      source: "export default function Page() { return <main />; }",
    },
  ];
}
