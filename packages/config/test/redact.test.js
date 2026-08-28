import { describe, expect, it } from "vitest";

import { redactConfigValue } from "../src/redact.js";

describe("redactConfigValue", () => {
  it("redacts secret-shaped keys", () => {
    const redacted = redactConfigValue({
      DATABASE_URL: "postgres://user:pass@host/db",
      SESSION_SECRET: "s".repeat(32),
      PORT: 4000,
    });

    expect(redacted.SESSION_SECRET).toBe("[REDACTED]");
    expect(redacted.PORT).toBe(4000);
  });
});
