import { randomUUID } from "node:crypto";

import {
  createAuditEvent,
  createIdempotencyExecutor,
} from "@openforge/integration-security";

import { inspectRepositoryFiles } from "./compatibility-inspection.js";
import { invariant } from "./errors.js";
import { createMemoryGitHubConnectionStore } from "./memory-connection-store.js";
import {
  normalizeBranch,
  normalizeInstallationId,
  normalizeRepositoryCoordinates,
} from "./validation.js";

export function createGitHubConnectionManager({
  transport,
  vault,
  store = createMemoryGitHubConnectionStore(),
  executeIdempotently = createIdempotencyExecutor(),
  audit = async () => {},
  clock = () => new Date(),
}) {
  async function withIdentity(identity, consume) {
    invariant(
      identity?.provider === "github" &&
        /^secret_[a-f0-9]{32}$/u.test(identity.accessTokenRef),
      "OF_GITHUB_IDENTITY_INVALID",
      "A connected GitHub identity is required.",
    );
    return vault.withSecret(
      identity.accessTokenRef,
      {
        provider: "github",
        connectionId: identity.id,
        name: "user-access-token",
      },
      consume,
    );
  }

  async function listInstallations(identity) {
    return withIdentity(identity, (token) =>
      transport.listInstallations({ token }),
    );
  }

  async function listRepositories(identity, installationId) {
    const id = normalizeInstallationId(installationId);
    const installations = await listInstallations(identity);
    invariant(
      installations.some((installation) => installation.id === id),
      "OF_GITHUB_INSTALLATION_FORBIDDEN",
      "The GitHub installation is not accessible to this identity.",
    );
    return withIdentity(identity, (token) =>
      transport.listRepositories({ token, installationId: id }),
    );
  }

  async function selectRepository({
    identity,
    installationId,
    owner,
    name,
    branch,
  }) {
    const repository = normalizeRepositoryCoordinates({ owner, name });
    const repositories = await listRepositories(identity, installationId);
    const selected = repositories.find(
      (candidate) =>
        candidate.owner.toLowerCase() === owner.toLowerCase() &&
        candidate.name.toLowerCase() === name.toLowerCase(),
    );
    invariant(
      selected,
      "OF_GITHUB_REPOSITORY_FORBIDDEN",
      "The repository is not accessible through the selected installation.",
    );
    const branches = await withIdentity(identity, (token) =>
      transport.listBranches({ token, repository }),
    );
    const branchName = normalizeBranch(branch ?? selected.defaultBranch);
    const selectedBranch = branches.find(
      (candidate) => candidate.name === branchName,
    );
    invariant(
      selectedBranch,
      "OF_GITHUB_BRANCH_NOT_FOUND",
      "The selected repository branch was not found.",
    );
    return {
      repository: selected,
      branch: selectedBranch,
      writeMode: selectedBranch.protected ? "pull-request" : "direct",
    };
  }

  async function inspectRepository(selection) {
    const selected = await selectRepository(selection);
    const files = await withIdentity(selection.identity, (token) =>
      transport.getRepositoryFiles({
        token,
        repository: selected.repository,
        branch: selected.branch.name,
      }),
    );
    return {
      ...selected,
      compatibility: await inspectRepositoryFiles(files),
    };
  }

  async function connect({
    projectId,
    identity,
    installationId,
    owner,
    name,
    branch,
    requestId,
  }) {
    const selection = await selectRepository({
      identity,
      installationId,
      owner,
      name,
      branch,
    });
    const connection = {
      id: `github_connection_${randomUUID().replaceAll("-", "")}`,
      projectId,
      identityId: identity.id,
      accessTokenRef: identity.accessTokenRef,
      installationId: normalizeInstallationId(installationId),
      repository: selection.repository,
      branch: selection.branch,
      writeMode: selection.writeMode,
      createdAt: clock().toISOString(),
    };
    await store.put(connection);
    await audit(
      createAuditEvent(
        {
          action: "github.repository.connect",
          actor: { id: identity.id, login: identity.login },
          target: {
            projectId,
            repository: selection.repository.fullName,
            branch: selection.branch.name,
          },
          outcome: "success",
          requestId,
          details: { writeMode: selection.writeMode },
        },
        { clock },
      ),
    );
    return connection;
  }

  async function createAndConnect({
    idempotencyKey,
    projectId,
    identity,
    installationId,
    owner,
    ownerType,
    repository,
    requestId,
  }) {
    return executeIdempotently(
      {
        key: idempotencyKey,
        operation: "github:repository:create",
        input: {
          projectId,
          installationId,
          owner,
          ownerType,
          repository,
        },
      },
      async () => {
        const installations = await listInstallations(identity);
        const installation = installations.find(
          (candidate) =>
            candidate.id === normalizeInstallationId(installationId),
        );
        invariant(
          installation &&
            installation.account.login.toLowerCase() === owner.toLowerCase(),
          "OF_GITHUB_REPOSITORY_OWNER_FORBIDDEN",
          "The repository owner is not the selected installation account.",
        );
        const created = await withIdentity(identity, (token) =>
          transport.createRepository({
            token,
            owner,
            ownerType,
            repository,
          }),
        );
        return connect({
          projectId,
          identity,
          installationId,
          owner: created.owner,
          name: created.name,
          branch: created.defaultBranch,
          requestId,
        });
      },
    );
  }

  return {
    listInstallations,
    listRepositories,
    selectRepository,
    inspectRepository,
    connect,
    createAndConnect,
    getConnection: (id) => store.get(id),
    listConnections: (projectId) => store.list(projectId),
  };
}
