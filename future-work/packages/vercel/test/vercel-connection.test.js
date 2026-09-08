import { randomBytes } from "node:crypto";

import { createSecretVault } from "@openforge/integration-security";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createMemoryVercelStateStore,
  createVercelConnectionManager,
  createVercelInstallation,
  normalizeEnvironmentInput,
} from "../src/index.js";

const CLIENT_SECRET = "vercel-client-secret-value";
const ACCESS_TOKEN = "vercel-installation-token-value";
const GRANTED_SCOPES = {
  "project-env-vars": "write",
  project: "write",
  team: "read",
  user: "read",
};

describe("Vercel external installation", () => {
  it("validates one-time state, team scope, and encrypted token storage", async () => {
    const { vault, clientSecretRef } = await createVaultFixture();
    const transport = createFakeTransport();
    const audit = vi.fn();
    const installationFlow = createVercelInstallation({
      integrationSlug: "openforge",
      clientId: "client_openforge",
      clientSecretRef,
      redirectUri: "https://openforge.test/api/vercel/callback",
      vault,
      transport,
      audit,
      clock: () => new Date("2026-07-28T00:00:00.000Z"),
    });

    const started = await installationFlow.begin({
      projectId: "project_1",
      returnTo: "/projects/project_1/deploy",
    });
    const url = new URL(started.installationUrl);
    expect(url.origin + url.pathname).toBe(
      "https://vercel.com/integrations/openforge/new",
    );
    expect(url.searchParams.get("source")).toBe("external");
    expect(url.searchParams.get("state")).toBe(started.state);

    const completed = await installationFlow.complete({
      code: "installation_code_123",
      state: started.state,
      teamId: "team_1",
      configurationId: "icfg_1",
      next: "https://vercel.com/dashboard/integrations",
      requestId: "request_1",
    });

    expect(completed).toMatchObject({
      returnTo: "/projects/project_1/deploy",
      next: "https://vercel.com/dashboard/integrations",
      installation: {
        provider: "vercel",
        projectId: "project_1",
        configurationId: "icfg_1",
        teamId: "team_1",
        accessTokenRef: expect.stringMatching(/^secret_[a-f0-9]{32}$/u),
      },
    });
    expect(JSON.stringify(completed)).not.toContain(ACCESS_TOKEN);
    expect(transport.exchangeInstallationCode).toHaveBeenCalledWith(
      expect.objectContaining({ clientSecret: CLIENT_SECRET }),
    );
    expect(audit).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "vercel.installation.complete",
        outcome: "success",
      }),
    );
    await expect(
      installationFlow.complete({
        code: "installation_code_456",
        state: started.state,
        configurationId: "icfg_1",
      }),
    ).rejects.toMatchObject({ code: "OF_VERCEL_INSTALLATION_STATE_REJECTED" });
  });

  it("expires state and rejects mismatched team or external completion URLs", async () => {
    let now = 0;
    const stateStore = createMemoryVercelStateStore({
      clock: () => now,
      ttlMs: 100,
    });
    const state = await stateStore.issue({ projectId: "project_1" });
    now = 101;
    await expect(stateStore.consume(state)).resolves.toBeNull();

    const { vault, clientSecretRef } = await createVaultFixture();
    const installationFlow = createVercelInstallation({
      integrationSlug: "openforge",
      clientId: "client_openforge",
      clientSecretRef,
      redirectUri: "http://localhost:3000/api/vercel/callback",
      vault,
      transport: createFakeTransport(),
    });
    const started = await installationFlow.begin({
      projectId: "project_1",
    });
    await expect(
      installationFlow.complete({
        code: "installation_code_123",
        state: started.state,
        teamId: "team_other",
        configurationId: "icfg_1",
      }),
    ).rejects.toMatchObject({ code: "OF_VERCEL_TEAM_MISMATCH" });

    const nextStarted = await installationFlow.begin({
      projectId: "project_1",
    });
    await expect(
      installationFlow.complete({
        code: "installation_code_456",
        state: nextStarted.state,
        teamId: "team_1",
        configurationId: "icfg_1",
        next: "https://attacker.test/finish",
      }),
    ).rejects.toMatchObject({ code: "OF_VERCEL_NEXT_URL_INVALID" });
  });
});

describe("Vercel account and project connection", () => {
  let fixture;

  beforeEach(async () => {
    fixture = await createConnectionFixture();
  });

  it("selects only the account and projects in the installation scope", async () => {
    await expect(
      fixture.manager.getAccount(fixture.installation),
    ).resolves.toEqual({
      type: "team",
      id: "team_1",
      slug: "openforge-team",
      name: "OpenForge Team",
      avatar: null,
    });
    await expect(
      fixture.manager.connect({
        installation: fixture.installation,
        projectId: "project_1",
        vercelProjectId: "prj_missing",
      }),
    ).rejects.toMatchObject({ code: "OF_VERCEL_PROJECT_FORBIDDEN" });
  });

  it("connects an existing project without exposing access tokens", async () => {
    const connection = await fixture.manager.connect({
      installation: fixture.installation,
      projectId: "project_1",
      vercelProjectId: "prj_site",
      requestId: "request_2",
    });
    expect(connection).toMatchObject({
      provider: "vercel",
      projectId: "project_1",
      teamId: "team_1",
      vercelProject: { id: "prj_site", name: "site" },
    });
    expect(JSON.stringify(connection)).not.toContain(ACCESS_TOKEN);
  });

  it("creates and connects a project once across retries", async () => {
    const request = {
      idempotencyKey: "vercel-project-create-1",
      installation: fixture.installation,
      projectId: "project_2",
      project: {
        name: "new-site",
        framework: "nextjs",
        gitRepository: {
          type: "github",
          repo: "openforge-user/new-site",
        },
        rootDirectory: "apps/web",
      },
      requestId: "request_3",
    };
    const first = await fixture.manager.createAndConnect(request);
    const second = await fixture.manager.createAndConnect(request);

    expect(first).toMatchObject({
      replayed: false,
      result: { vercelProject: { id: "prj_new-site", name: "new-site" } },
    });
    expect(second).toEqual({ ...first, replayed: true });
    expect(fixture.transport.createProject).toHaveBeenCalledTimes(1);
  });

  it("rejects connections with missing or excessive scopes", async () => {
    expect(() =>
      createVercelConnectionManager({
        transport: fixture.transport,
        vault: fixture.vault,
        grantedScopes: { project: "write", team: "read", user: "read" },
      }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_SCOPE_POLICY_VIOLATION" }),
    );
    expect(() =>
      createVercelConnectionManager({
        transport: fixture.transport,
        vault: fixture.vault,
        grantedScopes: {
          ...GRANTED_SCOPES,
          deployment: "write",
        },
      }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_SCOPE_POLICY_VIOLATION" }),
    );
  });
});

describe("Vercel environment variables", () => {
  let fixture;
  let connection;

  beforeEach(async () => {
    fixture = await createConnectionFixture();
    connection = await fixture.manager.connect({
      installation: fixture.installation,
      projectId: "project_1",
      vercelProjectId: "prj_site",
    });
  });

  it("writes sensitive preview/production values without returning them", async () => {
    const result = await fixture.manager.putEnvironmentVariable({
      connection,
      variable: {
        key: "DATABASE_URL",
        value: "postgres://must-never-return",
        targets: ["preview", "production"],
        sensitive: true,
      },
      requestId: "request_4",
    });
    expect(result).toEqual([
      {
        id: "env_DATABASE_URL",
        key: "DATABASE_URL",
        type: "sensitive",
        targets: ["preview", "production"],
        valuePolicy: "write-only",
      },
    ]);
    expect(JSON.stringify(result)).not.toContain("postgres://");
  });

  it("rejects provider responses that still contain a value field", async () => {
    fixture.transport.createEnvironmentVariable.mockResolvedValueOnce([
      {
        id: "env_SECRET",
        key: "SECRET",
        value: "x",
        type: "sensitive",
        targets: ["production"],
      },
    ]);
    await expect(
      fixture.manager.putEnvironmentVariable({
        connection,
        variable: {
          key: "SECRET",
          value: "x",
          targets: ["production"],
          sensitive: true,
        },
      }),
    ).rejects.toMatchObject({ code: "OF_VERCEL_ENV_VALUE_EXPOSED" });
  });

  it("marks development values reveal-limited and blocks sensitive development", async () => {
    expect(
      normalizeEnvironmentInput({
        key: "API_ORIGIN",
        value: "http://localhost:4000",
        targets: ["development"],
      }),
    ).toMatchObject({ sensitive: false, targets: ["development"] });
    expect(() =>
      normalizeEnvironmentInput({
        key: "SECRET",
        value: "private",
        targets: ["development"],
        sensitive: true,
      }),
    ).toThrowError(
      expect.objectContaining({
        code: "OF_VERCEL_SENSITIVE_DEVELOPMENT_UNSUPPORTED",
      }),
    );
  });
});

async function createVaultFixture() {
  const vault = createSecretVault({
    keys: { primary: randomBytes(32) },
    activeKeyId: "primary",
  });
  const secret = await vault.putSecret({
    provider: "vercel",
    connectionId: "vercel_app",
    name: "integration-client-secret",
    value: CLIENT_SECRET,
  });
  return { vault, clientSecretRef: secret.ref };
}

async function createConnectionFixture() {
  const { vault } = await createVaultFixture();
  const installationId = "vercel_installation_1";
  const access = await vault.putSecret({
    provider: "vercel",
    connectionId: installationId,
    name: "integration-access-token",
    value: ACCESS_TOKEN,
  });
  const installation = {
    id: installationId,
    provider: "vercel",
    projectId: "project_1",
    configurationId: "icfg_1",
    teamId: "team_1",
    userId: "user_1",
    accessTokenRef: access.ref,
  };
  const transport = createFakeTransport();
  return {
    vault,
    installation,
    transport,
    manager: createVercelConnectionManager({
      transport,
      vault,
      grantedScopes: GRANTED_SCOPES,
    }),
  };
}

function createFakeTransport() {
  const projects = [
    {
      id: "prj_site",
      name: "site",
      framework: "nextjs",
      accountId: "team_1",
      gitRepository: {
        type: "github",
        repo: "openforge-user/site",
        repoId: 301,
      },
    },
  ];
  return {
    exchangeInstallationCode: vi.fn(async () => ({
      accessToken: ACCESS_TOKEN,
      teamId: "team_1",
      userId: "user_1",
    })),
    getViewer: vi.fn(async () => ({
      id: "user_1",
      username: "openforge-user",
      avatar: null,
    })),
    getTeam: vi.fn(async () => ({
      id: "team_1",
      slug: "openforge-team",
      name: "OpenForge Team",
      avatar: null,
    })),
    listProjects: vi.fn(async () => structuredClone(projects)),
    createProject: vi.fn(async ({ project }) => {
      const created = {
        id: `prj_${project.name}`,
        name: project.name,
        framework: project.framework,
        accountId: "team_1",
        gitRepository: project.gitRepository,
      };
      projects.push(created);
      return structuredClone(created);
    }),
    listEnvironmentVariables: vi.fn(async () => []),
    createEnvironmentVariable: vi.fn(async ({ variable }) => [
      {
        id: `env_${variable.key}`,
        key: variable.key,
        type: variable.sensitive ? "sensitive" : "encrypted",
        targets: variable.targets,
        valuePolicy: variable.sensitive ? "write-only" : "provider-readable",
      },
    ]),
  };
}
