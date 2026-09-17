import { execFile } from "node:child_process";
import { access, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  buildGitHubRemoteUrl,
  commitSiteChanges,
  initSiteGit,
  listSiteCommits,
  pushSiteChanges,
  restoreSiteToCommit,
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

  describe("restoreSiteToCommit", () => {
    const RESTORE_ROOT = "./data/test-site-git-restore";

    beforeAll(async () => {
      await rm(RESTORE_ROOT, { force: true, recursive: true });
      await mkdir(RESTORE_ROOT, { recursive: true });
      await initSiteGit(RESTORE_ROOT);
    });

    afterAll(async () => {
      await rm(RESTORE_ROOT, { force: true, recursive: true });
    });

    it("restores edited content, recreates a since-deleted file, and removes a since-added file, as a new forward commit", async () => {
      await writeFile(`${RESTORE_ROOT}/page.jsx`, "export default function Page() { return 1; }\n");
      await writeFile(`${RESTORE_ROOT}/keep.jsx`, "export const keep = true;\n");
      await commitSiteChanges(RESTORE_ROOT, "First version");
      const [{ hash: firstHash }] = await listSiteCommits(RESTORE_ROOT, 1);

      await writeFile(`${RESTORE_ROOT}/page.jsx`, "export default function Page() { return 2; }\n");
      await rm(`${RESTORE_ROOT}/keep.jsx`);
      await writeFile(`${RESTORE_ROOT}/extra.jsx`, "export const extra = true;\n");
      await commitSiteChanges(RESTORE_ROOT, "Second version");

      await restoreSiteToCommit(RESTORE_ROOT, firstHash);

      expect(await readFile(`${RESTORE_ROOT}/page.jsx`, "utf8")).toBe(
        "export default function Page() { return 1; }\n",
      );
      expect(await readFile(`${RESTORE_ROOT}/keep.jsx`, "utf8")).toBe(
        "export const keep = true;\n",
      );
      await expect(access(`${RESTORE_ROOT}/extra.jsx`)).rejects.toThrow();

      const commits = await listSiteCommits(RESTORE_ROOT);
      expect(commits).toHaveLength(3);
      expect(commits[0].message).toBe(`Restore to ${firstHash}`);

      const status = await run("git", ["-C", RESTORE_ROOT, "status", "--porcelain"]);
      expect(status.stdout.trim()).toBe("");
    });

    it("rejects a hash that doesn't look like a real git object id", async () => {
      await expect(
        restoreSiteToCommit(RESTORE_ROOT, "--upload-pack=evil"),
      ).rejects.toThrow(/not a valid commit hash/iu);
    });
  });
});
