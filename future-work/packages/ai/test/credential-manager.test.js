import { randomBytes } from "node:crypto";

import {
  createMemorySecretStorage,
  createSecretVault,
} from "@openforge/integration-security";
import { describe, expect, it, vi } from "vitest";

import {
  createAICredentialManager,
  createMemoryAICredentialStore,
  parseCredentialScope,
} from "../src/index.js";

const organizationScope = {
  mode: "organization",
  organizationId: "organization_1",
};
const projectScope = {
  mode: "project",
  organizationId: "organization_1",
  projectId: "project_1",
};
const environmentScope = {
  mode: "environment",
  organizationId: "organization_1",
  projectId: "project_1",
  environment: "preview",
};
const sessionScope = {
  mode: "session",
  organizationId: "organization_1",
  projectId: "project_1",
  sessionId: "session_1",
};
const trustedExecution = {
  trusted: true,
  runtime: "worker",
  purpose: "ai-provider-request",
};

function fixture({
  now = new Date("2026-07-28T00:00:00.000Z"),
  audit = vi.fn(),
} = {}) {
  const secretStorage = createMemorySecretStorage();
  const vault = createSecretVault({
    keys: { primary: randomBytes(32) },
    activeKeyId: "primary",
    storage: secretStorage,
    clock: () => now,
  });
  const credentialStorage = createMemoryAICredentialStore();
  const manager = createAICredentialManager({
    vault,
    storage: credentialStorage,
    clock: () => now,
    audit,
  });
  return { manager, vault, secretStorage, credentialStorage, audit };
}

describe("AI credential scopes", () => {
  it.each([organizationScope, projectScope, environmentScope, sessionScope])(
    "normalizes the $mode ownership mode",
    (scope) => {
      expect(parseCredentialScope(scope)).toEqual(scope);
    },
  );

  it("rejects cross-mode fields", () => {
    expect(() =>
      parseCredentialScope({
        ...organizationScope,
        projectId: "project_1",
      }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_AI_CREDENTIAL_SCOPE_INVALID" }),
    );
  });
});

describe("persistent AI credentials", () => {
  it("returns metadata while keeping plaintext only in the encrypted vault", async () => {
    const { manager, secretStorage, credentialStorage } = fixture();
    const created = await manager.setCredential({
      provider: "openai",
      scope: environmentScope,
      value: "sk-secret-value",
    });
    const stored = await credentialStorage.get(created.id);
    const encrypted = await secretStorage.get(stored.secretRef);

    expect(created).toMatchObject({
      provider: "openai",
      scope: environmentScope,
      persistence: "encrypted",
    });
    expect(created).not.toHaveProperty("secretRef");
    expect(JSON.stringify(created)).not.toContain("sk-secret-value");
    expect(JSON.stringify(stored)).not.toContain("sk-secret-value");
    expect(JSON.stringify(encrypted)).not.toContain("sk-secret-value");
  });

  it("decrypts only inside an exact trusted server or worker context", async () => {
    const { manager } = fixture();
    const created = await manager.setCredential({
      provider: "anthropic",
      scope: projectScope,
      value: "trusted-value",
    });

    await expect(
      manager.useCredential({
        credentialId: created.id,
        provider: "anthropic",
        expectedScope: projectScope,
        execution: { ...trustedExecution, trusted: false },
        consume: async () => "unused",
      }),
    ).rejects.toMatchObject({ code: "OF_AI_CREDENTIAL_CONTEXT_UNTRUSTED" });
    await expect(
      manager.useCredential({
        credentialId: created.id,
        provider: "gemini",
        expectedScope: projectScope,
        execution: trustedExecution,
        consume: async () => "unused",
      }),
    ).rejects.toMatchObject({ code: "OF_AI_CREDENTIAL_CONTEXT_MISMATCH" });
    await expect(
      manager.useCredential({
        credentialId: created.id,
        provider: "anthropic",
        expectedScope: projectScope,
        execution: trustedExecution,
        consume: async (secret) => `length:${secret.length}`,
      }),
    ).resolves.toBe("length:13");
  });

  it("resolves the most specific credential for a context", async () => {
    const { manager } = fixture();
    const organization = await manager.setCredential({
      provider: "openai",
      scope: organizationScope,
      value: "organization-value",
    });
    const project = await manager.setCredential({
      provider: "openai",
      scope: projectScope,
      value: "project-value",
    });
    const environment = await manager.setCredential({
      provider: "openai",
      scope: environmentScope,
      value: "environment-value",
    });

    await expect(
      manager.resolveCredential({
        provider: "openai",
        context: {
          organizationId: "organization_1",
          projectId: "project_1",
          environment: "preview",
        },
      }),
    ).resolves.toMatchObject({ id: environment.id });
    expect(project.id).not.toBe(organization.id);
  });

  it("rotates credential material and deletes the prior secret", async () => {
    const { manager, secretStorage, credentialStorage } = fixture();
    const created = await manager.setCredential({
      provider: "gemini",
      scope: projectScope,
      value: "old-value",
    });
    const before = await credentialStorage.get(created.id);

    const rotated = await manager.rotateCredential({
      credentialId: created.id,
      value: "new-value",
    });
    const after = await credentialStorage.get(created.id);

    expect(rotated.rotatedAt).toBe("2026-07-28T00:00:00.000Z");
    expect(after.secretRef).not.toBe(before.secretRef);
    await expect(secretStorage.get(before.secretRef)).resolves.toBeNull();
    await expect(
      manager.useCredential({
        credentialId: created.id,
        expectedScope: projectScope,
        execution: trustedExecution,
        consume: async (secret) => secret === "new-value",
      }),
    ).resolves.toBe(true);
  });

  it("rewraps and deletes stored credentials without exposing their value", async () => {
    const { manager, credentialStorage, secretStorage } = fixture();
    const created = await manager.setCredential({
      provider: "openai",
      scope: organizationScope,
      value: "delete-me",
    });
    const stored = await credentialStorage.get(created.id);

    await expect(
      manager.rotateCredential({ credentialId: created.id }),
    ).resolves.toMatchObject({ id: created.id });
    await expect(manager.deleteCredential(created.id)).resolves.toEqual({
      deleted: true,
      id: created.id,
    });
    await expect(credentialStorage.get(created.id)).resolves.toBeNull();
    await expect(secretStorage.get(stored.secretRef)).resolves.toBeNull();
  });
});

describe("session-only AI credentials", () => {
  it("keeps session values out of persistent stores and expires within 24 hours", async () => {
    const { manager, credentialStorage } = fixture();
    const created = await manager.setCredential({
      provider: "openai",
      scope: sessionScope,
      value: "session-secret",
      expiresAt: "2026-07-28T01:00:00.000Z",
    });

    expect(created.persistence).toBe("memory-only");
    await expect(credentialStorage.list()).resolves.toEqual([]);
    await expect(
      manager.useCredential({
        credentialId: created.id,
        expectedScope: sessionScope,
        execution: trustedExecution,
        consume: async (secret) => secret.length,
      }),
    ).resolves.toBe(14);
  });

  it("rejects missing or overlong session expiry", async () => {
    const { manager } = fixture();

    await expect(
      manager.setCredential({
        provider: "openai",
        scope: sessionScope,
        value: "session-secret",
      }),
    ).rejects.toMatchObject({ code: "OF_AI_CREDENTIAL_EXPIRY_REQUIRED" });
    await expect(
      manager.setCredential({
        provider: "openai",
        scope: sessionScope,
        value: "session-secret",
        expiresAt: "2026-07-30T00:00:00.000Z",
      }),
    ).rejects.toMatchObject({ code: "OF_AI_CREDENTIAL_EXPIRY_INVALID" });
  });

  it("zeroes and removes session credentials on deletion", async () => {
    const { manager } = fixture();
    const created = await manager.setCredential({
      provider: "openai",
      scope: sessionScope,
      value: "session-secret",
      expiresAt: "2026-07-28T01:00:00.000Z",
    });

    await expect(manager.deleteCredential(created.id)).resolves.toMatchObject({
      deleted: true,
    });
    await expect(
      manager.useCredential({
        credentialId: created.id,
        expectedScope: sessionScope,
        execution: trustedExecution,
        consume: async () => "unused",
      }),
    ).rejects.toMatchObject({ code: "OF_AI_CREDENTIAL_NOT_FOUND" });
  });
});
