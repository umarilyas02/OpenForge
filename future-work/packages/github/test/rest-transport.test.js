import { describe, expect, it, vi } from "vitest";

import { GITHUB_API_VERSION, createGitHubRestTransport } from "../src/index.js";

describe("GitHub REST transport", () => {
  it("sends versioned authenticated requests and normalizes viewer data", async () => {
    const fetchImpl = vi.fn(async () =>
      response({
        id: 101,
        login: "openforge-user",
        avatar_url: "https://avatars.test/user",
      }),
    );
    const transport = createGitHubRestTransport({ fetchImpl });

    await expect(transport.getViewer({ token: "user-token" })).resolves.toEqual(
      {
        id: 101,
        login: "openforge-user",
        avatarUrl: "https://avatars.test/user",
      },
    );
    expect(fetchImpl).toHaveBeenCalledWith(
      new URL("https://api.github.com/user"),
      expect.objectContaining({
        headers: expect.objectContaining({
          authorization: "Bearer user-token",
          "x-github-api-version": GITHUB_API_VERSION,
        }),
      }),
    );
  });

  it("returns bounded allow-listed error details without credentials", async () => {
    const fetchImpl = vi.fn(async () =>
      response(
        { message: "Resource not accessible by integration" },
        {
          status: 403,
          headers: { "x-github-request-id": "request-gh-1" },
        },
      ),
    );
    const transport = createGitHubRestTransport({ fetchImpl });

    await expect(
      transport.getViewer({ token: "must-not-leak" }),
    ).rejects.toMatchObject({
      code: "OF_GITHUB_API_ERROR",
      details: {
        status: 403,
        requestId: "request-gh-1",
        message: "Resource not accessible by integration",
      },
    });
    try {
      await transport.getViewer({ token: "must-not-leak" });
    } catch (error) {
      expect(JSON.stringify(error)).not.toContain("must-not-leak");
    }
  });

  it("creates Git data in non-force order and updates the requested ref", async () => {
    const calls = [];
    const fetchImpl = vi.fn(async (url, options) => {
      calls.push({
        path: url.pathname,
        method: options.method,
        body: options.body ? JSON.parse(options.body) : null,
      });
      if (url.pathname.endsWith("/git/commits/aaaaaaaa")) {
        return response({ tree: { sha: "tree-base" } });
      }
      if (url.pathname.endsWith("/git/blobs")) {
        return response({ sha: "blob-new" }, { status: 201 });
      }
      if (url.pathname.endsWith("/git/trees")) {
        return response({ sha: "tree-new" }, { status: 201 });
      }
      if (url.pathname.endsWith("/git/commits")) {
        return response(
          { sha: "commit-new", html_url: "https://github.test/commit-new" },
          { status: 201 },
        );
      }
      return response(
        { ref: "refs/heads/main", object: { sha: "commit-new" } },
        { status: 200 },
      );
    });
    const transport = createGitHubRestTransport({ fetchImpl });

    await expect(
      transport.createCommit({
        token: "token",
        repository: { owner: "openforge-user", name: "site" },
        branch: "main",
        baseSha: "aaaaaaaa",
        message: "Update site",
        files: [{ path: "app/page.jsx", source: "new source" }],
        changes: [
          { path: "app/page.jsx", type: "modify" },
          { path: "old.js", type: "delete" },
        ],
      }),
    ).resolves.toEqual({
      sha: "commit-new",
      htmlUrl: "https://github.test/commit-new",
    });
    expect(calls.at(-1)).toEqual({
      path: "/repos/openforge-user/site/git/refs/heads/main",
      method: "PATCH",
      body: { sha: "commit-new", force: false },
    });
    expect(
      calls.find((call) => call.path.endsWith("/git/trees")).body.tree,
    ).toEqual([
      {
        path: "app/page.jsx",
        mode: "100644",
        type: "blob",
        sha: "blob-new",
      },
      { path: "old.js", mode: "100644", type: "blob", sha: null },
    ]);
  });

  it("reads protection from the exact selected branch endpoint", async () => {
    const fetchImpl = vi.fn(async () =>
      response({
        name: "release/v1",
        commit: { sha: "abc1234" },
        protected: true,
      }),
    );
    const transport = createGitHubRestTransport({ fetchImpl });
    await expect(
      transport.getBranch({
        token: "token",
        repository: { owner: "openforge-user", name: "site" },
        branch: "release/v1",
      }),
    ).resolves.toEqual({
      name: "release/v1",
      sha: "abc1234",
      protected: true,
    });
    expect(fetchImpl.mock.calls[0][0].pathname).toBe(
      "/repos/openforge-user/site/branches/release%2Fv1",
    );
  });
});

function response(payload, { status = 200, headers = {} } = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}
