import { describe, expect, it, vi } from "vitest";

import { createVercelRestTransport } from "../src/index.js";

describe("Vercel REST transport", () => {
  it("exchanges installation codes as form data", async () => {
    const fetchImpl = vi.fn(async () =>
      response({
        access_token: "installation-token",
        team_id: "team_1",
        user_id: "user_1",
      }),
    );
    const transport = createVercelRestTransport({ fetchImpl });
    await expect(
      transport.exchangeInstallationCode({
        clientId: "client_1",
        clientSecret: "secret_1",
        code: "code_1",
        redirectUri: "https://openforge.test/callback",
      }),
    ).resolves.toEqual({
      accessToken: "installation-token",
      teamId: "team_1",
      userId: "user_1",
      installationId: null,
    });
    const [, options] = fetchImpl.mock.calls[0];
    expect(options.headers["content-type"]).toBe(
      "application/x-www-form-urlencoded",
    );
    expect(new URLSearchParams(options.body).get("client_secret")).toBe(
      "secret_1",
    );
  });

  it("adds team scope to project requests and strips environment values", async () => {
    const fetchImpl = vi.fn(async (url) => {
      if (url.pathname.endsWith("/env")) {
        return response({
          envs: [
            {
              id: "env_1",
              key: "DATABASE_URL",
              value: "must-not-return",
              type: "sensitive",
              target: ["preview", "production"],
              createdAt: 123,
            },
          ],
        });
      }
      return response({ projects: [] });
    });
    const transport = createVercelRestTransport({ fetchImpl });
    await transport.listProjects({ token: "token", teamId: "team_1" });
    const variables = await transport.listEnvironmentVariables({
      token: "token",
      teamId: "team_1",
      projectId: "prj_1",
    });

    expect(fetchImpl.mock.calls[0][0].searchParams.get("teamId")).toBe(
      "team_1",
    );
    expect(variables).toEqual([
      {
        id: "env_1",
        key: "DATABASE_URL",
        type: "sensitive",
        targets: ["preview", "production"],
        gitBranch: null,
        createdAt: 123,
        valuePolicy: "write-only",
      },
    ]);
    expect(JSON.stringify(variables)).not.toContain("must-not-return");
  });

  it("returns allow-listed provider errors without request credentials", async () => {
    const fetchImpl = vi.fn(async () =>
      response(
        {
          error: {
            code: "forbidden",
            message: "Not authorized",
            token: "provider-echoed-token",
          },
        },
        {
          status: 403,
          headers: { "x-vercel-id": "trace_1" },
        },
      ),
    );
    const transport = createVercelRestTransport({ fetchImpl });
    try {
      await transport.getViewer({ token: "request-token" });
      throw new Error("Expected request to fail.");
    } catch (error) {
      expect(error).toMatchObject({
        code: "OF_VERCEL_API_ERROR",
        details: {
          status: 403,
          code: "forbidden",
          message: "Not authorized",
          requestId: "trace_1",
        },
      });
      expect(JSON.stringify(error)).not.toContain("request-token");
      expect(JSON.stringify(error)).not.toContain("provider-echoed-token");
    }
  });
});

function response(payload, { status = 200, headers = {} } = {}) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: { "content-type": "application/json", ...headers },
  });
}
