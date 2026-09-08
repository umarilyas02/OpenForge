import { randomBytes } from "node:crypto";

import { createSecretVault } from "@openforge/integration-security";
import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  createGitHubAuthentication,
  createGitHubConnectionManager,
  createMemoryOAuthStateStore,
  inspectRepositoryFiles,
  normalizeBranch,
} from "../src/index.js";

const CLIENT_SECRET = "github-app-client-secret-value";
const USER_TOKEN = "github-user-access-token-value";

describe("GitHub authentication", () => {
  it("validates and consumes OAuth state before storing an opaque user token", async () => {
    const { vault, clientSecretRef } = await createVaultFixture();
    const transport = createFakeTransport();
    const audit = vi.fn();
    const authentication = createGitHubAuthentication({
      clientId: "Iv1.openforge",
      clientSecretRef,
      redirectUri: "https://openforge.test/api/github/callback",
      vault,
      transport,
      audit,
      clock: () => new Date("2026-07-28T00:00:00.000Z"),
    });

    const started = await authentication.begin({
      returnTo: "/projects/project_1/connect",
    });
    const url = new URL(started.authorizationUrl);
    expect(url.origin + url.pathname).toBe(
      "https://github.com/login/oauth/authorize",
    );
    expect(url.searchParams.get("state")).toBe(started.state);

    const completed = await authentication.complete({
      code: "authorization_code_123",
      state: started.state,
      requestId: "request_1",
    });

    expect(completed).toMatchObject({
      returnTo: "/projects/project_1/connect",
      identity: {
        provider: "github",
        login: "openforge-user",
        accountId: 101,
        accessTokenRef: expect.stringMatching(/^secret_[a-f0-9]{32}$/u),
      },
    });
    expect(JSON.stringify(completed)).not.toContain(USER_TOKEN);
    expect(transport.exchangeUserCode).toHaveBeenCalledWith(
      expect.objectContaining({ clientSecret: CLIENT_SECRET }),
    );
    expect(audit).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "github.authentication.complete",
        outcome: "success",
      }),
    );
    await expect(
      authentication.complete({
        code: "authorization_code_456",
        state: started.state,
      }),
    ).rejects.toMatchObject({ code: "OF_GITHUB_OAUTH_STATE_REJECTED" });
  });

  it("expires state and blocks open redirect paths", async () => {
    let now = 0;
    const stateStore = createMemoryOAuthStateStore({
      clock: () => now,
      ttlMs: 100,
    });
    const state = await stateStore.issue({ returnTo: "/" });
    now = 101;
    await expect(stateStore.consume(state)).resolves.toBeNull();

    const { vault, clientSecretRef } = await createVaultFixture();
    const authentication = createGitHubAuthentication({
      clientId: "Iv1.openforge",
      clientSecretRef,
      redirectUri: "http://localhost:3000/api/github/callback",
      vault,
      transport: createFakeTransport(),
    });
    await expect(
      authentication.begin({ returnTo: "//attacker.test" }),
    ).rejects.toMatchObject({ code: "OF_GITHUB_RETURN_TO_INVALID" });
  });
});

describe("GitHub repository connection", () => {
  let fixture;

  beforeEach(async () => {
    fixture = await createConnectionFixture();
  });

  it("restricts repositories to the selected accessible installation", async () => {
    await expect(
      fixture.manager.listRepositories(fixture.identity, 999),
    ).rejects.toMatchObject({ code: "OF_GITHUB_INSTALLATION_FORBIDDEN" });

    await expect(
      fixture.manager.selectRepository({
        identity: fixture.identity,
        installationId: 201,
        owner: "other-owner",
        name: "missing",
      }),
    ).rejects.toMatchObject({ code: "OF_GITHUB_REPOSITORY_FORBIDDEN" });
  });

  it("detects protected branches and selects pull-request mode", async () => {
    const selected = await fixture.manager.selectRepository({
      identity: fixture.identity,
      installationId: 201,
      owner: "openforge-user",
      name: "site",
      branch: "main",
    });
    expect(selected).toMatchObject({
      branch: { name: "main", protected: true },
      writeMode: "pull-request",
    });

    const connection = await fixture.manager.connect({
      projectId: "project_1",
      identity: fixture.identity,
      installationId: 201,
      owner: "openforge-user",
      name: "site",
      branch: "develop",
      requestId: "request_2",
    });
    expect(connection).toMatchObject({
      projectId: "project_1",
      writeMode: "direct",
      branch: { name: "develop", protected: false },
    });
    expect(JSON.stringify(connection)).not.toContain(USER_TOKEN);
  });

  it("inspects compatibility inside a disposable compiler workspace", async () => {
    const inspected = await fixture.manager.inspectRepository({
      identity: fixture.identity,
      installationId: 201,
      owner: "openforge-user",
      name: "site",
      branch: "main",
    });
    expect(inspected.compatibility).toMatchObject({
      isolated: true,
      temporaryPathExposed: false,
      _workspaceVerified: true,
      inspectedFileCount: 2,
      level: "code-only",
      counts: { supported: 1, partial: 0, "code-only": 1 },
    });
    expect(JSON.stringify(inspected.compatibility)).not.toContain(
      "export default",
    );
  });

  it("creates and connects a repository once across retries", async () => {
    const request = {
      idempotencyKey: "create-project-123",
      projectId: "project_2",
      identity: fixture.identity,
      installationId: 201,
      owner: "openforge-user",
      ownerType: "user",
      repository: {
        name: "new-site",
        description: "New OpenForge site",
        visibility: "private",
      },
      requestId: "request_3",
    };
    const first = await fixture.manager.createAndConnect(request);
    const second = await fixture.manager.createAndConnect(request);

    expect(first.replayed).toBe(false);
    expect(second).toEqual({ ...first, replayed: true });
    expect(fixture.transport.createRepository).toHaveBeenCalledTimes(1);
    expect(first.result.repository.fullName).toBe("openforge-user/new-site");
  });
});

describe("repository validation", () => {
  it("accepts normal branch paths and rejects ref metacharacters", () => {
    expect(normalizeBranch("feature/editor-shell")).toBe(
      "feature/editor-shell",
    );
    for (const branch of ["../main", "feature..main", "main.lock", "@{bad}"]) {
      expect(() => normalizeBranch(branch)).toThrowError(
        expect.objectContaining({ code: "OF_GITHUB_BRANCH_INVALID" }),
      );
    }
  });

  it("does not retain the disposable inspection path", async () => {
    const report = await inspectRepositoryFiles([
      {
        path: "app/page.jsx",
        source: "export default function Page() { return <main />; }",
      },
      { path: "README.md", source: "ignored" },
    ]);
    expect(report).toMatchObject({
      inspectedFileCount: 1,
      level: "supported",
      _workspaceVerified: true,
    });
    expect(Object.keys(report)).not.toContain("temporaryPath");
  });
});

async function createVaultFixture() {
  const vault = createSecretVault({
    keys: { primary: randomBytes(32) },
    activeKeyId: "primary",
  });
  const clientSecret = await vault.putSecret({
    provider: "github",
    connectionId: "github_app",
    name: "app-client-secret",
    value: CLIENT_SECRET,
  });
  return { vault, clientSecretRef: clientSecret.ref };
}

async function createConnectionFixture() {
  const { vault } = await createVaultFixture();
  const identityId = "github_identity_1";
  const token = await vault.putSecret({
    provider: "github",
    connectionId: identityId,
    name: "user-access-token",
    value: USER_TOKEN,
  });
  const identity = {
    id: identityId,
    provider: "github",
    login: "openforge-user",
    accessTokenRef: token.ref,
  };
  const transport = createFakeTransport();
  return {
    vault,
    identity,
    transport,
    manager: createGitHubConnectionManager({ transport, vault }),
  };
}

function createFakeTransport() {
  const repositories = [
    {
      id: 301,
      owner: "openforge-user",
      name: "site",
      fullName: "openforge-user/site",
      private: true,
      defaultBranch: "main",
      htmlUrl: "https://github.com/openforge-user/site",
    },
  ];
  const branches = new Map([
    [
      "site",
      [
        { name: "main", sha: "abc123", protected: true },
        { name: "develop", sha: "def456", protected: false },
      ],
    ],
    ["new-site", [{ name: "main", sha: "new123", protected: false }]],
  ]);

  return {
    exchangeUserCode: vi.fn(async () => ({
      accessToken: USER_TOKEN,
      refreshToken: "github-refresh-token-value",
      expiresAt: "2026-07-28T08:00:00.000Z",
    })),
    getViewer: vi.fn(async () => ({
      id: 101,
      login: "openforge-user",
      avatarUrl: "https://avatars.test/user",
    })),
    listInstallations: vi.fn(async () => [
      {
        id: 201,
        account: { id: 101, login: "openforge-user", type: "user" },
        repositorySelection: "selected",
        permissions: { metadata: "read", contents: "write" },
      },
    ]),
    listRepositories: vi.fn(async () => structuredClone(repositories)),
    listBranches: vi.fn(async ({ repository }) =>
      structuredClone(branches.get(repository.name) ?? []),
    ),
    getRepositoryFiles: vi.fn(async () => [
      {
        path: "app/page.jsx",
        source: "export default function Page() { return <main />; }",
      },
      {
        path: "app/runtime.jsx",
        source:
          "export default function Runtime() { return React.createElement('div'); }",
      },
      { path: "README.md", source: "not inspected" },
    ]),
    createRepository: vi.fn(async ({ owner, repository }) => {
      const created = {
        id: 302,
        owner,
        name: repository.name,
        fullName: `${owner}/${repository.name}`,
        private: repository.visibility !== "public",
        defaultBranch: "main",
        htmlUrl: `https://github.com/${owner}/${repository.name}`,
      };
      repositories.push(created);
      return structuredClone(created);
    }),
  };
}
