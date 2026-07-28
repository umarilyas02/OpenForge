import { randomUUID } from "node:crypto";

import {
  assertLeastPrivilege,
  createAuditEvent,
  createIdempotencyExecutor,
} from "@openforge/integration-security";

import { invariant } from "./errors.js";
import { createMemoryVercelConnectionStore } from "./memory-connection-store.js";
import {
  normalizeEnvironmentInput,
  normalizeGitRepository,
  normalizeProjectName,
  normalizeVercelId,
} from "./validation.js";

export const VERCEL_CONNECTION_OPERATIONS = Object.freeze([
  "identity:read",
  "team:read",
  "project:write",
  "environment:write",
]);

export function createVercelConnectionManager({
  transport,
  vault,
  grantedScopes,
  authorizedOperations = VERCEL_CONNECTION_OPERATIONS,
  store = createMemoryVercelConnectionStore(),
  executeIdempotently = createIdempotencyExecutor(),
  audit = async () => {},
  clock = () => new Date(),
}) {
  assertLeastPrivilege("vercel", authorizedOperations, grantedScopes);

  async function withInstallation(installation, consume) {
    invariant(
      installation?.provider === "vercel" &&
        /^secret_[a-f0-9]{32}$/u.test(installation.accessTokenRef),
      "OF_VERCEL_INSTALLATION_INVALID",
      "A connected Vercel installation is required.",
    );
    return vault.withSecret(
      installation.accessTokenRef,
      {
        provider: "vercel",
        connectionId: installation.id,
        name: "integration-access-token",
      },
      consume,
    );
  }

  async function getAccount(installation) {
    if (installation.teamId) {
      const team = await withInstallation(installation, (token) =>
        transport.getTeam({ token, teamId: installation.teamId }),
      );
      return { type: "team", ...team };
    }
    const user = await withInstallation(installation, (token) =>
      transport.getViewer({ token }),
    );
    return {
      type: "personal",
      id: user.id,
      slug: user.username,
      name: user.username,
      avatar: user.avatar,
    };
  }

  async function listProjects(installation) {
    return withInstallation(installation, (token) =>
      transport.listProjects({ token, teamId: installation.teamId }),
    );
  }

  async function connect({
    installation,
    projectId,
    vercelProjectId,
    requestId,
  }) {
    const projects = await listProjects(installation);
    const selected = projects.find(
      ({ id }) => id === normalizeVercelId(vercelProjectId, "project ID"),
    );
    invariant(
      selected,
      "OF_VERCEL_PROJECT_FORBIDDEN",
      "The Vercel project is not accessible to this installation.",
    );
    return saveConnection({
      installation,
      projectId,
      selected,
      requestId,
    });
  }

  async function saveConnection({
    installation,
    projectId,
    selected,
    requestId,
  }) {
    const account = await getAccount(installation);
    const connection = {
      id: `vercel_connection_${randomUUID().replaceAll("-", "")}`,
      provider: "vercel",
      projectId,
      installationId: installation.id,
      accessTokenRef: installation.accessTokenRef,
      teamId: installation.teamId,
      account,
      vercelProject: selected,
      createdAt: clock().toISOString(),
    };
    await store.put(connection);
    await audit(
      createAuditEvent(
        {
          action: "vercel.project.connect",
          actor: { id: installation.userId },
          target: {
            projectId,
            vercelProjectId: selected.id,
            teamId: installation.teamId,
          },
          outcome: "success",
          requestId,
          details: { projectName: selected.name },
        },
        { clock },
      ),
    );
    return connection;
  }

  async function createAndConnect({
    idempotencyKey,
    installation,
    projectId,
    project,
    requestId,
  }) {
    const normalizedProject = {
      name: normalizeProjectName(project.name),
      framework: project.framework ?? "nextjs",
      gitRepository: normalizeGitRepository(project.gitRepository),
      rootDirectory: normalizeRootDirectory(project.rootDirectory),
    };
    return executeIdempotently(
      {
        key: idempotencyKey,
        operation: "vercel:project:create",
        input: {
          installationId: installation.id,
          projectId,
          project: normalizedProject,
        },
      },
      async () => {
        const created = await withInstallation(installation, (token) =>
          transport.createProject({
            token,
            teamId: installation.teamId,
            project: normalizedProject,
          }),
        );
        return saveConnection({
          installation,
          projectId,
          selected: created,
          requestId,
        });
      },
    );
  }

  async function listEnvironmentVariables(connection) {
    return withConnection(connection, (token) =>
      transport.listEnvironmentVariables({
        token,
        teamId: connection.teamId,
        projectId: connection.vercelProject.id,
      }),
    );
  }

  async function putEnvironmentVariable({ connection, variable, requestId }) {
    const normalized = normalizeEnvironmentInput(variable);
    const created = await withConnection(connection, (token) =>
      transport.createEnvironmentVariable({
        token,
        teamId: connection.teamId,
        projectId: connection.vercelProject.id,
        variable: normalized,
      }),
    );
    invariant(
      !containsSensitiveField(created),
      "OF_VERCEL_ENV_VALUE_EXPOSED",
      "The provider returned an unsafe environment-variable response.",
    );
    await audit(
      createAuditEvent(
        {
          action: "vercel.environment.write",
          actor: { installationId: connection.installationId },
          target: {
            projectId: connection.projectId,
            vercelProjectId: connection.vercelProject.id,
            key: normalized.key,
          },
          outcome: "success",
          requestId,
          details: {
            targets: normalized.targets,
            sensitive: normalized.sensitive,
          },
        },
        { clock },
      ),
    );
    return created;
  }

  async function withConnection(connection, consume) {
    invariant(
      connection?.provider === "vercel" &&
        /^secret_[a-f0-9]{32}$/u.test(connection.accessTokenRef),
      "OF_VERCEL_CONNECTION_INVALID",
      "A complete Vercel project connection is required.",
    );
    return vault.withSecret(
      connection.accessTokenRef,
      {
        provider: "vercel",
        connectionId: connection.installationId,
        name: "integration-access-token",
      },
      consume,
    );
  }

  return {
    getAccount,
    listProjects,
    connect,
    createAndConnect,
    listEnvironmentVariables,
    putEnvironmentVariable,
    getConnection: (id) => store.get(id),
    listConnections: (projectId) => store.list(projectId),
  };
}

function normalizeRootDirectory(value) {
  if (value === undefined || value === null || value === "") return null;
  invariant(
    typeof value === "string" &&
      value.length <= 240 &&
      !value.startsWith("/") &&
      !value.includes("\\") &&
      !value.split("/").some((segment) => ["", ".", ".."].includes(segment)),
    "OF_VERCEL_ROOT_DIRECTORY_INVALID",
    "The Vercel project root directory is invalid.",
  );
  return value;
}

function containsSensitiveField(value, ancestors = new Set()) {
  if (value === null || typeof value !== "object") return false;
  if (ancestors.has(value)) return false;
  ancestors.add(value);
  if (Array.isArray(value)) {
    const found = value.some((entry) =>
      containsSensitiveField(entry, ancestors),
    );
    ancestors.delete(value);
    return found;
  }
  const found = Object.entries(value).some(
    ([key, entry]) =>
      /^(?:value|decryptedValue)$/iu.test(key) ||
      containsSensitiveField(entry, ancestors),
  );
  ancestors.delete(value);
  return found;
}
