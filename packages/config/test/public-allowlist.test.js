import { describe, expect, it } from "vitest";

import { ConfigError } from "../src/errors.js";
import { assertPublicSafe } from "../src/public-allowlist.js";

describe("assertPublicSafe", () => {
  it("allows NEXT_PUBLIC_-prefixed non-secret keys", () => {
    expect(() =>
      assertPublicSafe({
        NEXT_PUBLIC_OPENFORGE_API_URL: "https://example.test",
      }),
    ).not.toThrow();
  });

  it("allows explicitly allowlisted keys", () => {
    expect(() =>
      assertPublicSafe({ NODE_ENV: "production" }, { allow: ["NODE_ENV"] }),
    ).not.toThrow();
  });

  it("rejects an unprefixed, non-allowlisted key", () => {
    expect(() => assertPublicSafe({ DATABASE_URL: "postgres://x" })).toThrow(
      ConfigError,
    );
  });

  it("rejects a secret-shaped key even when prefixed", () => {
    expect(() =>
      assertPublicSafe({ NEXT_PUBLIC_SESSION_SECRET: "leaked" }),
    ).toThrow(ConfigError);
  });

  it("rejects a secret-shaped key even when explicitly allowlisted", () => {
    expect(() =>
      assertPublicSafe({ API_TOKEN: "leaked" }, { allow: ["API_TOKEN"] }),
    ).toThrow(ConfigError);
  });
});
