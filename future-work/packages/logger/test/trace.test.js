import { describe, expect, it } from "vitest";

import { generateTraceId, getTraceId, withTrace } from "../src/trace.js";

describe("trace propagation", () => {
  it("generates unique, stably prefixed trace IDs", () => {
    const first = generateTraceId();
    const second = generateTraceId();

    expect(first).toMatch(/^trace_[a-f0-9]{32}$/u);
    expect(first).not.toBe(second);
  });

  it("returns undefined outside a trace context", () => {
    expect(getTraceId()).toBeUndefined();
  });

  it("exposes the active trace ID to nested async work", async () => {
    await withTrace("trace_xyz", async () => {
      await Promise.resolve();
      expect(getTraceId()).toBe("trace_xyz");
    });

    expect(getTraceId()).toBeUndefined();
  });
});
