import { describe, expect, it } from "vitest";

import { createHealthCheck } from "../src/health.js";

describe("health check", () => {
  it("reports ok when every probe succeeds", async () => {
    const runHealthCheck = createHealthCheck({
      checks: {
        database: async () => {},
        redis: async () => {},
      },
      clock: () => new Date("2026-08-28T00:00:00.000Z"),
    });

    const report = await runHealthCheck();

    expect(report.status).toBe("ok");
    expect(report.checks).toHaveLength(2);
    expect(report.checks.every((check) => check.status === "ok")).toBe(true);
  });

  it("reports degraded when a probe returns a degraded outcome", async () => {
    const runHealthCheck = createHealthCheck({
      checks: {
        database: async () => {},
        objectStorage: async () => ({ status: "degraded", message: "slow" }),
      },
    });

    const report = await runHealthCheck();

    expect(report.status).toBe("degraded");
  });

  it("reports down when a probe throws", async () => {
    const runHealthCheck = createHealthCheck({
      checks: {
        database: async () => {
          throw new Error("connection refused");
        },
      },
    });

    const report = await runHealthCheck();

    expect(report.status).toBe("down");
    expect(report.checks[0].message).toBe("connection refused");
  });
});
