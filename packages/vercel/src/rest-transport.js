import { invariant } from "./errors.js";
import {
  normalizeEnvironmentInput,
  normalizeProjectName,
  normalizeVercelId,
} from "./validation.js";

export function createVercelRestTransport({
  fetchImpl = globalThis.fetch,
  apiBaseUrl = "https://api.vercel.com",
} = {}) {
  invariant(
    typeof fetchImpl === "function",
    "OF_VERCEL_FETCH_REQUIRED",
    "A fetch implementation is required.",
  );

  async function request(path, { token, teamId, method = "GET", body } = {}) {
    const url = new URL(path, apiBaseUrl);
    if (teamId) url.searchParams.set("teamId", teamId);
    const response = await fetchImpl(url, {
      method,
      headers: {
        accept: "application/json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        ...(body ? { "content-type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const payload =
      response.status === 204
        ? null
        : await response.json().catch(() => ({ error: {} }));
    invariant(
      response.ok,
      "OF_VERCEL_API_ERROR",
      "The Vercel API request failed.",
      {
        status: response.status,
        code: payload?.error?.code ?? null,
        message: payload?.error?.message ?? "Unknown provider error",
        requestId:
          response.headers.get("x-vercel-id") ??
          response.headers.get("x-vercel-trace"),
      },
    );
    return payload;
  }

  return {
    async exchangeInstallationCode({
      clientId,
      clientSecret,
      code,
      redirectUri,
    }) {
      const form = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      });
      const response = await fetchImpl(
        new URL("/v2/oauth/access_token", apiBaseUrl),
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/x-www-form-urlencoded",
          },
          body: form.toString(),
        },
      );
      const payload = await response.json();
      invariant(
        response.ok && !payload.error,
        "OF_VERCEL_TOKEN_EXCHANGE_FAILED",
        "Vercel rejected the installation code exchange.",
        { code: payload?.error?.code ?? payload?.error ?? null },
      );
      return {
        accessToken: payload.access_token,
        teamId: payload.team_id ?? null,
        userId: payload.user_id ?? null,
        installationId: payload.installation_id ?? null,
      };
    },

    async getViewer({ token }) {
      const user = await request("/v2/user", { token });
      return {
        id: user.user.id,
        username: user.user.username,
        email: user.user.email ?? null,
        avatar: user.user.avatar ?? null,
      };
    },

    async getTeam({ token, teamId }) {
      const id = normalizeVercelId(teamId, "team ID");
      const team = await request(`/v2/teams/${encodeURIComponent(id)}`, {
        token,
        teamId: id,
      });
      return {
        id: team.id,
        slug: team.slug,
        name: team.name,
        avatar: team.avatar ?? null,
      };
    },

    async listProjects({ token, teamId }) {
      const payload = await request("/v9/projects?limit=100", {
        token,
        teamId,
      });
      return payload.projects.map(normalizeProject);
    },

    async createProject({ token, teamId, project }) {
      const payload = await request("/v11/projects", {
        token,
        teamId,
        method: "POST",
        body: {
          name: normalizeProjectName(project.name),
          framework: project.framework ?? "nextjs",
          ...(project.gitRepository
            ? { gitRepository: project.gitRepository }
            : {}),
          ...(project.rootDirectory
            ? { rootDirectory: project.rootDirectory }
            : {}),
        },
      });
      return normalizeProject(payload);
    },

    async listEnvironmentVariables({ token, teamId, projectId }) {
      const id = normalizeVercelId(projectId, "project ID");
      const payload = await request(
        `/v9/projects/${encodeURIComponent(id)}/env`,
        { token, teamId },
      );
      return payload.envs.map(normalizeEnvironmentMetadata);
    },

    async createEnvironmentVariable({ token, teamId, projectId, variable }) {
      const id = normalizeVercelId(projectId, "project ID");
      const input = normalizeEnvironmentInput(variable);
      const payload = await request(
        `/v10/projects/${encodeURIComponent(id)}/env`,
        {
          token,
          teamId,
          method: "POST",
          body: {
            key: input.key,
            value: input.value,
            type: input.sensitive ? "sensitive" : "encrypted",
            target: input.targets,
            ...(input.gitBranch ? { gitBranch: input.gitBranch } : {}),
          },
        },
      );
      const created = Array.isArray(payload.created)
        ? payload.created
        : Array.isArray(payload)
          ? payload
          : [payload];
      return created.map(normalizeEnvironmentMetadata);
    },

    async createDeployment({ token, teamId, project, source, target }) {
      const payload = await request("/v13/deployments", {
        token,
        teamId,
        method: "POST",
        body: {
          name: project.name,
          project: project.id,
          target,
          gitSource: {
            type: "github",
            ref: source.ref,
            repoId: source.repoId,
            sha: source.sha,
          },
        },
      });
      return normalizeDeployment(payload, source);
    },

    async getDeployment({ token, teamId, deploymentId }) {
      const id = normalizeVercelId(deploymentId, "deployment ID");
      const payload = await request(
        `/v13/deployments/${encodeURIComponent(id)}`,
        { token, teamId },
      );
      return normalizeDeployment(payload);
    },

    async getDeploymentEvents({ token, teamId, deploymentId }) {
      const id = normalizeVercelId(deploymentId, "deployment ID");
      const payload = await request(
        `/v2/deployments/${encodeURIComponent(id)}/events?direction=forward&builds=1&limit=100`,
        { token, teamId },
      );
      return (payload ?? []).map((event) => ({
        type: event.type,
        createdAt: event.created,
        text: event.payload?.text ?? "",
        statusCode: event.payload?.statusCode ?? null,
      }));
    },
  };
}

function normalizeProject(project) {
  return {
    id: project.id,
    name: project.name,
    framework: project.framework ?? null,
    accountId: project.accountId ?? null,
    updatedAt: project.updatedAt ?? null,
    gitRepository: project.link
      ? {
          type: project.link.type,
          repo: project.link.repo,
          repoId: project.link.repoId ?? null,
        }
      : null,
  };
}

function normalizeEnvironmentMetadata(variable) {
  return {
    id: variable.id,
    key: variable.key,
    type: variable.type,
    targets: Array.isArray(variable.target)
      ? [...variable.target]
      : [variable.target],
    gitBranch: variable.gitBranch ?? null,
    createdAt: variable.createdAt ?? variable.created ?? null,
    valuePolicy:
      variable.type === "sensitive" ? "write-only" : "provider-readable",
  };
}

function normalizeDeployment(deployment, source) {
  return {
    id: deployment.id ?? deployment.uid,
    url: deployment.url ?? null,
    readyState: deployment.readyState ?? deployment.state ?? null,
    status: deployment.status ?? null,
    target: deployment.target ?? "preview",
    createdAt: deployment.createdAt ?? deployment.created ?? null,
    readyAt: deployment.readyAt ?? null,
    errorCode: deployment.errorCode ?? deployment.error?.code ?? null,
    source: source ?? null,
  };
}
