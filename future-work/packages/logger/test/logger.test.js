import { describe, expect, it } from "vitest";

import { createLogger } from "../src/logger.js";
import { withTrace } from "../src/trace.js";

function createCapture() {
  const lines = [];
  return {
    write: (chunk) => lines.push(JSON.parse(chunk)),
    lines,
  };
}

describe("createLogger", () => {
  it("writes a structured JSON entry with redacted meta", () => {
    const destination = createCapture();
    const logger = createLogger({
      service: "api",
      destination,
      clock: () => new Date("2026-08-28T00:00:00.000Z"),
    });

    logger.info("session started", {
      userId: "user_1",
      sessionSecret: "s3cr3t",
    });

    expect(destination.lines).toHaveLength(1);
    expect(destination.lines[0]).toMatchObject({
      timestamp: "2026-08-28T00:00:00.000Z",
      level: "info",
      service: "api",
      message: "session started",
      traceId: null,
    });
    expect(destination.lines[0].meta.sessionSecret).toBe("[REDACTED]");
    expect(destination.lines[0].meta.userId).toBe("user_1");
  });

  it("omits entries below the configured level", () => {
    const destination = createCapture();
    const logger = createLogger({ service: "api", level: "warn", destination });

    logger.info("ignored");
    logger.warn("kept");

    expect(destination.lines).toHaveLength(1);
    expect(destination.lines[0].message).toBe("kept");
  });

  it("routes error entries to the error destination", () => {
    const destination = createCapture();
    const errorDestination = createCapture();
    const logger = createLogger({
      service: "api",
      destination,
      errorDestination,
    });

    logger.error("boom");

    expect(destination.lines).toHaveLength(0);
    expect(errorDestination.lines).toHaveLength(1);
  });

  it("attaches the active trace ID", () => {
    const destination = createCapture();
    const logger = createLogger({ service: "api", destination });

    withTrace("trace_abc", () => logger.info("inside trace"));

    expect(destination.lines[0].traceId).toBe("trace_abc");
  });
});
