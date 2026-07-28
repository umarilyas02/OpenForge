import { invariant } from "./errors.js";
import {
  normalizeBranch,
  normalizeInstallationId,
  normalizeRepositoryCoordinates,
} from "./validation.js";

export const GITHUB_API_VERSION = "2026-03-10";

export function createGitHubRestTransport({
  fetchImpl = globalThis.fetch,
  apiBaseUrl = "https://api.github.com",
  oauthBaseUrl = "https://github.com",
  maxSourceFiles = 500,
  maxSourceBytes = 10 * 1024 * 1024,
} = {}) {
  invariant(
    typeof fetchImpl === "function",
    "OF_GITHUB_FETCH_REQUIRED",
    "A fetch implementation is required.",
  );

  async function request(path, { token, method = "GET", body } = {}) {
    const response = await fetchImpl(new URL(path, apiBaseUrl), {
      method,
      redirect: "follow",
      headers: {
        accept: "application/vnd.github+json",
        ...(token ? { authorization: `Bearer ${token}` } : {}),
        "x-github-api-version": GITHUB_API_VERSION,
        ...(body ? { "content-type": "application/json" } : {}),
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    const payload =
      response.status === 204
        ? null
        : await response.json().catch(() => ({ message: "Invalid JSON" }));
    invariant(
      response.ok,
      "OF_GITHUB_API_ERROR",
      "The GitHub API request failed.",
      {
        status: response.status,
        requestId: response.headers.get("x-github-request-id"),
        message: payload?.message,
      },
    );
    return payload;
  }

  return {
    async exchangeUserCode({ clientId, clientSecret, code, redirectUri }) {
      const response = await fetchImpl(
        new URL("/login/oauth/access_token", oauthBaseUrl),
        {
          method: "POST",
          headers: {
            accept: "application/json",
            "content-type": "application/json",
          },
          body: JSON.stringify({
            client_id: clientId,
            client_secret: clientSecret,
            code,
            redirect_uri: redirectUri,
          }),
        },
      );
      const payload = await response.json();
      invariant(
        response.ok && !payload.error,
        "OF_GITHUB_TOKEN_EXCHANGE_FAILED",
        "GitHub rejected the authorization code exchange.",
        { error: payload.error },
      );
      return {
        accessToken: payload.access_token,
        refreshToken: payload.refresh_token ?? null,
        expiresAt: futureIso(payload.expires_in),
        refreshExpiresAt: futureIso(payload.refresh_token_expires_in),
      };
    },

    async getViewer({ token }) {
      const user = await request("/user", { token });
      return { id: user.id, login: user.login, avatarUrl: user.avatar_url };
    },

    async listInstallations({ token }) {
      const payload = await request("/user/installations?per_page=100", {
        token,
      });
      return payload.installations.map(normalizeInstallation);
    },

    async listRepositories({ token, installationId }) {
      const id = normalizeInstallationId(installationId);
      const payload = await request(
        `/user/installations/${id}/repositories?per_page=100`,
        { token },
      );
      return payload.repositories.map(normalizeRepository);
    },

    async listBranches({ token, repository }) {
      const { owner, name } = normalizeRepositoryCoordinates(repository);
      const branches = await request(
        `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}/branches?per_page=100`,
        { token },
      );
      return branches.map((branch) => ({
        name: branch.name,
        sha: branch.commit.sha,
        protected: Boolean(branch.protected),
      }));
    },

    async createRepository({ token, owner, ownerType, repository }) {
      normalizeRepositoryCoordinates({ owner, name: repository.name });
      const target =
        ownerType === "organization"
          ? `/orgs/${encodeURIComponent(owner)}/repos`
          : "/user/repos";
      const result = await request(target, {
        token,
        method: "POST",
        body: {
          name: repository.name,
          description: repository.description ?? "",
          private: repository.visibility !== "public",
          auto_init: false,
        },
      });
      return normalizeRepository(result);
    },

    async getRepositoryFiles({ token, repository, branch }) {
      const { owner, name } = normalizeRepositoryCoordinates(repository);
      const ref = normalizeBranch(branch);
      const prefix = `/repos/${encodeURIComponent(owner)}/${encodeURIComponent(name)}`;
      const tree = await request(
        `${prefix}/git/trees/${encodeURIComponent(ref)}?recursive=1`,
        { token },
      );
      const blobs = tree.tree.filter(
        (entry) =>
          entry.type === "blob" &&
          /\.(?:js|jsx)$/iu.test(entry.path) &&
          entry.size <= maxSourceBytes,
      );
      invariant(
        blobs.length <= maxSourceFiles &&
          blobs.reduce((total, blob) => total + blob.size, 0) <= maxSourceBytes,
        "OF_GITHUB_INSPECTION_LIMIT",
        "The repository source exceeds the compatibility inspection limit.",
      );
      return Promise.all(
        blobs.map(async (blob) => {
          const payload = await request(`${prefix}/git/blobs/${blob.sha}`, {
            token,
          });
          invariant(
            payload.encoding === "base64",
            "OF_GITHUB_BLOB_ENCODING_UNSUPPORTED",
            "GitHub returned an unsupported blob encoding.",
          );
          return {
            path: blob.path,
            source: Buffer.from(payload.content, "base64").toString("utf8"),
          };
        }),
      );
    },
  };
}

function normalizeInstallation(installation) {
  return {
    id: installation.id,
    account: {
      id: installation.account.id,
      login: installation.account.login,
      type: installation.account.type.toLowerCase(),
      avatarUrl: installation.account.avatar_url ?? null,
    },
    repositorySelection: installation.repository_selection,
    permissions: installation.permissions,
  };
}

function normalizeRepository(repository) {
  return {
    id: repository.id,
    owner: repository.owner.login,
    name: repository.name,
    fullName: repository.full_name,
    private: Boolean(repository.private),
    defaultBranch: repository.default_branch,
    htmlUrl: repository.html_url,
    permissions: repository.permissions ?? null,
  };
}

function futureIso(seconds) {
  return Number.isFinite(seconds)
    ? new Date(Date.now() + seconds * 1000).toISOString()
    : null;
}
