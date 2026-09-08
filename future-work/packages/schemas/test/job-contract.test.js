import { describe, expect, it } from "vitest";

import { parseJobPayload, parseJobResult } from "../src/job-contract.js";

describe("job contracts", () => {
  it("parses a valid job payload", () => {
    const payload = parseJobPayload({
      schemaVersion: 1,
      id: "job_1",
      queue: "builds",
      type: "site.deploy",
      payload: { siteId: "site_1" },
      enqueuedAt: "2026-08-28T00:00:00.000Z",
    });

    expect(payload.attempts).toBe(0);
    expect(payload.maxAttempts).toBe(3);
  });

  it("parses a completed job result", () => {
    const result = parseJobResult({
      schemaVersion: 1,
      jobId: "job_1",
      status: "completed",
      result: { deployedUrl: "https://example.test" },
    });

    expect(result.progress).toBe(0);
    expect(result.errorCode).toBeNull();
  });

  it("rejects a failed result without an error code", () => {
    expect(() =>
      parseJobResult({
        schemaVersion: 1,
        jobId: "job_1",
        status: "failed",
      }),
    ).toThrow();
  });

  it("accepts a failed result with an error code", () => {
    const result = parseJobResult({
      schemaVersion: 1,
      jobId: "job_1",
      status: "failed",
      errorCode: "OF_BUILD_FAILED",
    });

    expect(result.errorCode).toBe("OF_BUILD_FAILED");
  });
});
