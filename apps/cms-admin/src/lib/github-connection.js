const GITHUB_API_VERSION = "2022-11-28";

export class GitHubConnectionError extends Error {
  constructor(message) {
    super(message);
    this.name = "GitHubConnectionError";
  }
}

/**
 * Confirms a personal access token can read a specific repository before
 * it's ever saved, using the plain GitHub REST API — no GitHub App
 * installation flow, since this is a single self-hosted operator
 * connecting their own token to their own repo, not a hosted multi-tenant
 * integration (see @openforge/github for that heavier shape).
 *
 * @param {{ token: string, owner: string, repo: string }} target
 * @returns {Promise<{ defaultBranch: string }>}
 */
export async function verifyGitHubRepoAccess({ token, owner, repo }) {
  let response;
  try {
    response = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers: {
        accept: "application/vnd.github+json",
        authorization: `Bearer ${token}`,
        "x-github-api-version": GITHUB_API_VERSION,
      },
    });
  } catch {
    throw new GitHubConnectionError(
      "Could not reach GitHub. Check your network connection and try again.",
    );
  }

  if (response.status === 401) {
    throw new GitHubConnectionError("That token was rejected by GitHub.");
  }
  if (response.status === 404) {
    throw new GitHubConnectionError(
      `Repository "${owner}/${repo}" wasn't found, or this token can't access it.`,
    );
  }
  if (!response.ok) {
    throw new GitHubConnectionError(
      `GitHub returned an unexpected error (${response.status}).`,
    );
  }

  const body = await response.json();
  if (body.permissions?.push !== true) {
    throw new GitHubConnectionError(
      "This token can read the repository but can't push to it — use a token with write access.",
    );
  }

  return { defaultBranch: body.default_branch || "main" };
}
