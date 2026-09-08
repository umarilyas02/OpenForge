import { describe, expect, it } from "vitest";

import {
  IsolatedPreviewRuntime,
  PreviewSessionManager,
  getPreviewHeaders,
  sanitizePreviewLog,
  stripPreviewMetadata,
  validatePreviewMessage,
} from "../src/index.js";

describe("preview session policy", () => {
  it("passes every hard limit to a capability-checked isolated executor", async () => {
    const calls = [];
    const executor = {
      capabilities: {
        cpuLimit: true,
        diskLimit: true,
        egressPolicy: true,
        memoryLimit: true,
        processIsolation: true,
        timeout: true,
      },
      async start(options) {
        calls.push(["start", options]);
        return { containerId: "preview-container" };
      },
      async stop(execution) {
        calls.push(["stop", execution]);
      },
    };
    const runtime = new IsolatedPreviewRuntime({
      manager: createManager(),
      executor,
    });
    const { session } = await runtime.start("workspace-one", "C:/workspace");
    expect(calls[0][1]).toMatchObject({
      networkMode: "allowlist",
      limits: {
        cpuPercent: 100,
        diskBytes: 256 * 1024 * 1024,
        memoryBytes: 256 * 1024 * 1024,
        timeoutMs: 60_000,
      },
    });
    await runtime.stop(session.sessionId);
    expect(calls[1][0]).toBe("stop");
  });

  it("refuses executors that cannot enforce isolation", () => {
    expect(
      () =>
        new IsolatedPreviewRuntime({
          manager: createManager(),
          executor: {
            capabilities: { processIsolation: true },
            start() {},
            stop() {},
          },
        }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_PREVIEW_EXECUTOR_UNSAFE" }),
    );
  });

  it("allocates origin-isolated disposable sessions with bounded resources", () => {
    const manager = createManager();
    const session = manager.allocate("workspace-one");

    expect(session.previewOrigin).toBe("https://preview.openforge.test");
    expect(session.controlOrigin).toBe("https://app.openforge.test");
    expect(session.url).toContain(`/sessions/${session.sessionId}/`);
    expect(session.iframe).toEqual({
      referrerPolicy: "no-referrer",
      sandbox: "allow-forms allow-same-origin allow-scripts",
    });
    expect(session.limits.memoryBytes).toBe(256 * 1024 * 1024);
    expect(manager.get(session.sessionId)).toBe(session);
    expect(manager.release(session.sessionId)).toBe(true);
    expect(() => manager.get(session.sessionId)).toThrowError(
      expect.objectContaining({ code: "OF_PREVIEW_SESSION_NOT_FOUND" }),
    );
  });

  it("rejects a control-plane origin reused for previews", () => {
    expect(
      () =>
        new PreviewSessionManager({
          controlOrigin: "https://app.openforge.test",
          previewOrigin: "https://app.openforge.test/path",
        }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_PREVIEW_ORIGIN_NOT_ISOLATED" }),
    );
  });

  it("expires and sweeps sessions deterministically", () => {
    let now = 1_000;
    const manager = createManager({ now: () => now });
    const first = manager.allocate("one");
    manager.allocate("two");
    now = first.expiresAt;
    expect(manager.sweepExpired()).toBe(2);
  });

  it("enforces explicit egress origins", () => {
    const manager = createManager();
    const session = manager.allocate("workspace-one");
    expect(
      manager.assertEgress(session.sessionId, "https://api.example.com/path"),
    ).toBe("https://api.example.com");
    expect(() =>
      manager.assertEgress(
        session.sessionId,
        "https://metadata.google.internal",
      ),
    ).toThrowError(
      expect.objectContaining({ code: "OF_PREVIEW_EGRESS_DENIED" }),
    );
  });

  it("emits iframe-compatible CSP and restrictive browser headers", () => {
    const session = createManager().allocate("workspace-one");
    const headers = getPreviewHeaders(session);
    expect(headers["Content-Security-Policy"]).toContain(
      "frame-ancestors https://app.openforge.test",
    );
    expect(headers["Content-Security-Policy"]).toContain(
      "connect-src 'self' https://api.example.com",
    );
    expect(headers["Permissions-Policy"]).toContain("camera=()");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
  });
});

describe("preview communication and output", () => {
  it("accepts only schema-valid origin-and-token checked messages", () => {
    const session = createManager().allocate("workspace-one");
    const message = {
      type: "preview-ready",
      sessionToken: session.token,
      payload: { pathname: "/" },
    };
    expect(
      validatePreviewMessage({
        data: message,
        eventOrigin: session.previewOrigin,
        expectedOrigin: session.previewOrigin,
        sessionToken: session.token,
      }),
    ).toEqual(message);

    expect(() =>
      validatePreviewMessage({
        data: message,
        eventOrigin: "https://evil.example",
        expectedOrigin: session.previewOrigin,
        sessionToken: session.token,
      }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_PREVIEW_MESSAGE_ORIGIN_DENIED" }),
    );
    expect(() =>
      validatePreviewMessage({
        data: { ...message, unknown: true },
        eventOrigin: session.previewOrigin,
        expectedOrigin: session.previewOrigin,
        sessionToken: session.token,
      }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_PREVIEW_MESSAGE_INVALID" }),
    );
  });

  it("redacts nested credentials, bearer tokens, API keys, and cycles", () => {
    const input = {
      authorization: "Bearer visible",
      nested: {
        apiKey: "sk_supersecretvalue",
        message: "request used Bearer abc.def.ghi",
      },
    };
    input.circular = input;
    expect(sanitizePreviewLog(input)).toEqual({
      authorization: "[REDACTED]",
      circular: "[CIRCULAR]",
      nested: {
        apiKey: "[REDACTED]",
        message: "request used Bearer [REDACTED]",
      },
    });
  });

  it("strips all OpenForge selection metadata from production HTML", () => {
    const output = stripPreviewMetadata(
      '<!doctype html><html><body><main data-openforge-node="n1"><p data-openforge-file="app/page.jsx" data-safe="yes">Hello</p></main></body></html>',
    );
    expect(output).not.toContain("data-openforge-");
    expect(output).toContain('data-safe="yes"');
    expect(output).toContain("<p");
    expect(output).toContain("Hello");
  });
});

function createManager(overrides = {}) {
  return new PreviewSessionManager({
    allowedEgressOrigins: ["https://api.example.com"],
    controlOrigin: "https://app.openforge.test",
    limits: {
      cpuPercent: 100,
      diskBytes: 256 * 1024 * 1024,
      egressRequestsPerMinute: 60,
      memoryBytes: 256 * 1024 * 1024,
      timeoutMs: 60_000,
    },
    previewOrigin: "https://preview.openforge.test",
    ...overrides,
  });
}
