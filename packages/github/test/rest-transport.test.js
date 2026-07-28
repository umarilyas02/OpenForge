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
});

function response(payload, { status = 200, headers = {} } = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}
