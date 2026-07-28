import { createHmac, randomBytes } from "node:crypto";

import { describe, expect, it, vi } from "vitest";

import {
  assertLeastPrivilege,
  createAuditEvent,
  createIdempotencyExecutor,
  createMemoryDeliveryStore,
  createMemorySecretStorage,
  createSecretVault,
  createWebhookGate,
  inspectScopes,
  redactAuditValue,
  requiredScopes,
  verifyGitHubWebhook,
} from "../src/index.js";

describe("secret vault", () => {
  it("stores only authenticated ciphertext behind an opaque reference", async () => {
    const storage = createMemorySecretStorage();
    const vault = createSecretVault({
      keys: { primary: randomBytes(32) },
      activeKeyId: "primary",
      storage,
    });
    const metadata = await vault.putSecret({
      provider: "github",
      connectionId: "connection_1",
      name: "installation-token",
      value: "never-serialize-this-token",
    });

    expect(metadata.ref).toMatch(/^secret_[a-f0-9]{32}$/u);
    expect(JSON.stringify(metadata)).not.toContain("never-serialize");
    await expect(
      vault.withSecret(metadata.ref, { provider: "vercel" }, async () => null),
    ).rejects.toMatchObject({ code: "OF_SECRET_CONTEXT_MISMATCH" });
    await expect(
      vault.withSecret(
        metadata.ref,
        { provider: "github", connectionId: "connection_1" },
        async (secret) => `used:${secret}`,
      ),
    ).resolves.toBe("used:never-serialize-this-token");
  });

  it("rotates existing ciphertext onto the active key", async () => {
    const storage = createMemorySecretStorage();
    const keys = { old: randomBytes(32), current: randomBytes(32) };
    const oldVault = createSecretVault({
      keys,
      activeKeyId: "old",
      storage,
    });
    const created = await oldVault.putSecret({
      provider: "vercel",
      connectionId: "connection_2",
      name: "access-token",
      value: "rotation-value",
    });
    const currentVault = createSecretVault({
      keys,
      activeKeyId: "current",
      storage,
    });

    const rotated = await currentVault.rotateSecret(created.ref);

    expect(rotated).toMatchObject({ keyId: "current" });
    await expect(
      currentVault.withSecret(created.ref, {}, async (secret) => secret),
    ).resolves.toBe("rotation-value");
  });

  it("rejects ciphertext or authenticated-metadata tampering", async () => {
    const storage = createMemorySecretStorage();
    const vault = createSecretVault({
      keys: { primary: randomBytes(32) },
      activeKeyId: "primary",
      storage,
    });
    const created = await vault.putSecret({
      provider: "github",
      connectionId: "connection_3",
      name: "installation-token",
      value: "authenticated-value",
    });
    const record = await storage.get(created.ref);
    record.ciphertext = `${record.ciphertext.slice(0, -2)}AA`;
    await storage.put(record);

    await expect(
      vault.withSecret(created.ref, {}, async (secret) => secret),
    ).rejects.toMatchObject({ code: "OF_SECRET_AUTH_FAILED" });
  });
});

describe("scope policy", () => {
  it("derives the minimum union for requested operations", () => {
    expect(
      requiredScopes("github", ["repository:inspect", "pull-request:write"]),
    ).toEqual({
      contents: "write",
      metadata: "read",
      pull_requests: "write",
    });
    expect(
      assertLeastPrivilege("vercel", ["identity:read", "deployment:create"], {
        deployment: "write",
        project: "read",
        user: "read",
      }).leastPrivilege,
    ).toBe(true);
  });

  it("reports missing and excessive access", () => {
    const result = inspectScopes("github", ["repository:inspect"], {
      administration: "write",
      metadata: "read",
    });
    expect(result.missing).toEqual([
      { scope: "contents", required: "read", granted: "none" },
    ]);
    expect(result.excessive).toEqual([
      { scope: "administration", required: "none", granted: "write" },
    ]);
  });
});

describe("webhook gate", () => {
  it("verifies GitHub's raw-body HMAC and deduplicates delivery IDs", async () => {
    const body = Buffer.from('{"action":"push"}', "utf8");
    const secret = "a-high-entropy-webhook-secret";
    const signature = `sha256=${createHmac("sha256", secret)
      .update(body)
      .digest("hex")}`;
    const gate = createWebhookGate({
      deliveryStore: createMemoryDeliveryStore(),
      verifier: verifyGitHubWebhook,
    });
    const delivery = {
      provider: "github",
      deliveryId: "delivery-1",
      body,
      secret,
      signature,
    };

    await expect(gate.accept(delivery)).resolves.toEqual({
      accepted: true,
      duplicate: false,
    });
    await expect(gate.accept(delivery)).resolves.toEqual({
      accepted: false,
      duplicate: true,
    });
    expect(
      verifyGitHubWebhook({
        body,
        secret,
        signature: `${signature.slice(0, -1)}0`,
      }),
    ).toBe(false);
    expect(() =>
      verifyGitHubWebhook({
        body: JSON.parse(body.toString("utf8")),
        secret,
        signature,
      }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_WEBHOOK_RAW_BODY_REQUIRED" }),
    );
  });
});

describe("idempotency", () => {
  it("coalesces concurrent requests and replays the result", async () => {
    const execute = createIdempotencyExecutor();
    const perform = vi.fn(async () => {
      await Promise.resolve();
      return { repositoryId: "repo_1" };
    });
    const request = {
      key: "request-1234",
      operation: "github:repository:create",
      input: { owner: "openforge", name: "site" },
    };

    const [first, second] = await Promise.all([
      execute(request, perform),
      execute(request, perform),
    ]);
    const third = await execute(request, perform);

    expect(first).toEqual({
      replayed: false,
      result: { repositoryId: "repo_1" },
    });
    expect(second).toEqual({
      replayed: true,
      result: { repositoryId: "repo_1" },
    });
    expect(third.replayed).toBe(true);
    expect(perform).toHaveBeenCalledTimes(1);
  });

  it("rejects reuse with different operation input", async () => {
    const execute = createIdempotencyExecutor();
    const request = {
      key: "request-1234",
      operation: "vercel:deployment:create",
      input: { projectId: "project_1" },
    };
    await execute(request, async () => ({ id: "deployment_1" }));

    await expect(
      execute(
        { ...request, input: { projectId: "project_2" } },
        async () => null,
      ),
    ).rejects.toMatchObject({ code: "OF_IDEMPOTENCY_INPUT_MISMATCH" });
  });
});

describe("audit redaction", () => {
  it("redacts sensitive keys, token-shaped text, and circular data", () => {
    const circular = { label: "safe" };
    circular.self = circular;
    const redacted = redactAuditValue({
      authorization: "Bearer should-never-appear",
      message: "request token=also-private failed",
      nested: { apiKey: "private" },
      circular,
    });
    expect(redacted).toEqual({
      authorization: "[REDACTED]",
      message: "request [REDACTED] failed",
      nested: { apiKey: "[REDACTED]" },
      circular: { label: "safe", self: "[CIRCULAR]" },
    });
  });

  it("creates immutable structured audit events without secrets", () => {
    const event = createAuditEvent(
      {
        action: "github.repository.create",
        actor: { id: "user_1" },
        target: { id: "project_1" },
        outcome: "success",
        requestId: "request_1",
        details: { accessToken: "private", repository: "site" },
      },
      {
        clock: () => new Date("2026-07-28T00:00:00.000Z"),
        id: () => "00000000-0000-0000-0000-000000000001",
      },
    );
    expect(event).toMatchObject({
      id: "audit_00000000000000000000000000000001",
      occurredAt: "2026-07-28T00:00:00.000Z",
      details: { accessToken: "[REDACTED]", repository: "site" },
    });
    expect(Object.isFrozen(event)).toBe(true);
    expect(JSON.stringify(event)).not.toContain("private");
  });
});
