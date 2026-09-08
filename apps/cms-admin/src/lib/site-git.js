import { execFile } from "node:child_process";
import { promisify } from "node:util";

const run = promisify(execFile);

const COMMITTER_NAME = "OpenForge CMS";
const COMMITTER_EMAIL = "cms@openforge.local";
// A separator that never appears in a hash, an ISO date, or one of this
// app's own generated commit messages (all plain ASCII, no pipes).
const LOG_FIELD_SEPARATOR = "|||";

async function git(rootPath, args) {
  return run("git", args, { cwd: rootPath });
}

/** Real git history, local to the server's disk -- no GitHub connection required for this. */
export async function initSiteGit(rootPath) {
  await git(rootPath, ["init"]);
  await git(rootPath, ["config", "user.name", COMMITTER_NAME]);
  await git(rootPath, ["config", "user.email", COMMITTER_EMAIL]);
}

/**
 * Stages and commits everything currently in the workspace. A save that
 * happens to leave the tree identical to the last commit (rare, but
 * possible for a no-op edit) isn't an error -- there's just nothing to
 * record.
 */
export async function commitSiteChanges(rootPath, message) {
  await git(rootPath, ["add", "-A"]);
  try {
    await git(rootPath, ["commit", "-m", message]);
  } catch (error) {
    const output = String(error.stdout || "") + String(error.stderr || "");
    if (!/nothing to commit/iu.test(output)) {
      throw error;
    }
  }
}

/**
 * @param {string} rootPath
 * @param {number} limit
 * @returns {Promise<Array<{hash: string, date: string, message: string}>>}
 */
/**
 * Pushes the current branch to a remote over HTTPS, without ever writing
 * the access token to disk. The token is passed only as a one-off
 * `-c http.extraheader` value scoped to this single `git push` invocation
 * (never `git remote add`, which would persist a token-bearing URL into
 * the workspace's committed-adjacent `.git/config`). Harmless to pass for
 * a non-HTTP remote (e.g. a local path in tests) — git only applies
 * `http.*` config when the transport is actually HTTP(S).
 *
 * @param {string} rootPath
 * @param {{ remoteUrl: string, branch: string, token: string }} target
 */
export async function pushSiteChanges(rootPath, { remoteUrl, branch, token }) {
  const basicAuth = Buffer.from(`x-access-token:${token}`).toString("base64");
  await git(rootPath, [
    "-c",
    `http.extraheader=AUTHORIZATION: basic ${basicAuth}`,
    "push",
    remoteUrl,
    `HEAD:refs/heads/${branch}`,
  ]);
}

/**
 * @param {{ owner: string, repo: string }} coordinates
 */
export function buildGitHubRemoteUrl({ owner, repo }) {
  return `https://github.com/${owner}/${repo}.git`;
}

export async function listSiteCommits(rootPath, limit = 20) {
  try {
    const format = "%h" + LOG_FIELD_SEPARATOR + "%ad" + LOG_FIELD_SEPARATOR + "%s";
    const { stdout } = await git(rootPath, [
      "log",
      "-n",
      String(limit),
      "--date=iso-strict",
      "--pretty=format:" + format,
    ]);
    if (!stdout.trim()) return [];
    return stdout
      .trim()
      .split("\n")
      .map((line) => {
        const parts = line.split(LOG_FIELD_SEPARATOR);
        return { hash: parts[0], date: parts[1], message: parts[2] };
      });
  } catch {
    // No commits yet, or not a git repository (a site created before this
    // feature existed) -- an empty history, not an error.
    return [];
  }
}
