import { execFile } from "node:child_process";
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  buildGitHubRemoteUrl,
  commitSiteChanges,
  initSiteGit,
  listSiteCommits,
  pushSiteChanges,
} from "../src/lib/site-git.js";

const run = promisify(execFile);

const ROOT = "./data/test-site-git";

describe("site-git", () => {
  beforeAll(async () => {
    await rm(ROOT, { force: true, recursive: true });
    await mkdir(ROOT, { recursive: true });
    await initSiteGit(ROOT);
  });

  afterAll(async () => {
    await rm(ROOT, { force: true, recursive: true });
  });

  it("starts with no commits", async () => {
    expect(await listSiteCommits(ROOT)).toEqual([]);
  });

  it("commits real file changes with the given message", async () => {
    await writeFile(`${ROOT}/page.jsx`, "export default function Page() {}\n");
    await commitSiteChanges(ROOT, "Initial site files");

    const commits = await listSiteCommits(ROOT);
    expect(commits).toHaveLength(1);
    expect(commits[0].message).toBe("Initial site files");
    expect(commits[0].hash).toMatch(/^[0-9a-f]{7,}$/u);
  });

  it("records a second commit after another change, newest first", async () => {
    await writeFile(`${ROOT}/page.jsx`, "export default function Page() { return null; }\n");
    await commitSiteChanges(ROOT, "Edit page.jsx");

    const commits = await listSiteCommits(ROOT);
    expect(commits).toHaveLength(2);
    expect(commits[0].message).toBe("Edit page.jsx");
    expect(commits[1].message).toBe("Initial site files");
  });

  it("does not throw when there is nothing new to commit", async () => {
    await expect(
      commitSiteChanges(ROOT, "Nothing changed"),
    ).resolves.toBeUndefined();
    expect(await listSiteCommits(ROOT)).toHaveLength(2);
  });

  it("respects the limit", async () => {
    const commits = await listSiteCommits(ROOT, 1);
    expect(commits).toHaveLength(1);
    expect(commits[0].message).toBe("Edit page.jsx");
  });

  it("builds a GitHub HTTPS remote URL from owner/repo", () => {
    expect(buildGitHubRemoteUrl({ owner: "acme", repo: "my-site" })).toBe(
      "https://github.com/acme/my-site.git",
    );
  });

  describe("pushSiteChanges", () => {
    const REMOTE = path.resolve("./data/test-site-git-remote.git");

    beforeAll(async () => {
      await rm(REMOTE, { force: true, recursive: true });
      await run("git", ["init", "--bare", "-b", "main", REMOTE]);
    });

    afterAll(async () => {
      await rm(REMOTE, { force: true, recursive: true });
    });

    it("pushes the current branch to the remote", async () => {
      // A bare local path, not an http(s) URL, so the http.extraheader
      // config pushSiteChanges always passes is simply inert here — real
      // coverage of the "never leak the token into .git/config" property
      // this exists for, without needing a real GitHub credential.
      await pushSiteChanges(ROOT, {
        remoteUrl: REMOTE,
        branch: "main",
        token: "unused-for-a-local-remote",
      });

      const { stdout } = await run("git", [
        "-C",
        REMOTE,
        "log",
        "-n",
        "1",
        "--pretty=format:%s",
      ]);
      expect(stdout.trim()).toBe("Edit page.jsx");

      const config = await run("git", ["-C", ROOT, "config", "--list"]);
      expect(config.stdout).not.toMatch(/unused-for-a-local-remote/u);
    });
  });
});
