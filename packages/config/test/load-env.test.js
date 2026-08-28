import { describe, expect, it } from "vitest";

import { ConfigError } from "../src/errors.js";
import { loadEnv } from "../src/load-env.js";
import { webEnvSchema, workerEnvSchema } from "../src/schema.js";

const VALID_WEB_ENV = {
  NODE_ENV: "development",
  PORT: "3000",
  NEXT_PUBLIC_OPENFORGE_URL: "http://localhost:3000",
  NEXT_PUBLIC_OPENFORGE_API_URL: "http://localhost:4000/api/v1",
  NEXT_PUBLIC_OPENFORGE_PREVIEW_ORIGIN: "http://localhost:4100",
  SESSION_SECRET: "a".repeat(32),
  GITHUB_CLIENT_ID: "",
  GITHUB_CLIENT_SECRET: "",
};

describe("loadEnv", () => {
  it("parses a valid environment and coerces types", () => {
    const config = loadEnv({ schema: webEnvSchema, source: VALID_WEB_ENV });

    expect(config.PORT).toBe(3000);
    expect(config.GITHUB_CLIENT_ID).toBeUndefined();
    expect(Object.isFrozen(config)).toBe(true);
  });

  it("throws one ConfigError listing every missing/invalid variable", () => {
    try {
      loadEnv({
        schema: workerEnvSchema,
        source: { NODE_ENV: "development" },
      });
      throw new Error("expected loadEnv to throw");
    } catch (error) {
      expect(error).toBeInstanceOf(ConfigError);
      expect(error.code).toBe("OF_CONFIG_INVALID");
      expect(error.details.issues.length).toBeGreaterThan(5);
      expect(error.details.issues.map((issue) => issue.path)).toContain(
        "DATABASE_URL",
      );
      expect(error.details.issues.map((issue) => issue.path)).toContain(
        "INTERNAL_SERVICE_TOKEN",
      );
    }
  });

  it("rejects a session secret that is too short", () => {
    expect(() =>
      loadEnv({
        schema: webEnvSchema,
        source: { ...VALID_WEB_ENV, SESSION_SECRET: "too-short" },
      }),
    ).toThrow(ConfigError);
  });
});
