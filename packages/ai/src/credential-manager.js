import { invariant } from "./errors.js";

const IDENTIFIER = /^[a-zA-Z0-9][a-zA-Z0-9._-]{0,127}$/u;
const PROVIDER = /^[a-z0-9][a-z0-9._-]{1,100}$/u;
const ENVIRONMENTS = new Set(["development", "preview", "production"]);
const TRUSTED_RUNTIMES = new Set(["server", "worker"]);

export function createMemoryAICredentialStore() {
  const records = new Map();

  return {
    async put(record) {
      records.set(record.id, structuredClone(record));
    },
    async get(id) {
      const record = records.get(id);
      return record ? structuredClone(record) : null;
    },
    async delete(id) {
      return records.delete(id);
    },
    async list() {
      return [...records.values()].map((record) => structuredClone(record));
    },
  };
}

export function createAICredentialManager({
  vault,
  storage = createMemoryAICredentialStore(),
  clock = () => new Date(),
  audit = async () => {},
} = {}) {
  const sessionCredentials = new Map();

  async function setCredential({ provider, scope, value, expiresAt }) {
    const normalizedProvider = parseProvider(provider);
    const normalizedScope = parseCredentialScope(scope);
    const secret = parseSecretValue(value);
    const now = clock();
    const id = `ai_credential_${crypto.randomUUID().replaceAll("-", "")}`;
    const record = {
      schemaVersion: 1,
      id,
      provider: normalizedProvider,
      scope: normalizedScope,
      persistence:
        normalizedScope.mode === "session" ? "memory-only" : "encrypted",
      createdAt: now.toISOString(),
      rotatedAt: null,
      expiresAt:
        normalizedScope.mode === "session"
          ? parseSessionExpiry(expiresAt, now)
          : null,
    };

    if (normalizedScope.mode === "session") {
      sessionCredentials.set(id, {
        record,
        secret: new TextEncoder().encode(secret),
      });
    } else {
      requireVault(vault);
      const secretMetadata = await vault.putSecret({
        provider: `ai.${normalizedProvider}`,
        connectionId: id,
        name: "provider-credential",
        value: secret,
      });
      await storage.put({ ...record, secretRef: secretMetadata.ref });
    }
    await writeAudit(audit, "ai.credential.created", record);
    return publicCredential(record);
  }

  async function listCredentials({ provider, context } = {}) {
    purgeExpiredSessions(sessionCredentials, clock());
    const normalizedProvider =
      provider === undefined ? undefined : parseProvider(provider);
    const records = [
      ...(await storage.list()),
      ...[...sessionCredentials.values()].map(({ record }) => record),
    ];
    return records
      .filter(
        (record) =>
          normalizedProvider === undefined ||
          record.provider === normalizedProvider,
      )
      .filter((record) => !isExpired(record, clock()))
      .filter(
        (record) => !context || scopeMatchesContext(record.scope, context),
      )
      .map(publicCredential)
      .sort((left, right) => left.id.localeCompare(right.id));
  }

  async function resolveCredential({ provider, context }) {
    const credentials = await listCredentials({ provider, context });
    const ranked = credentials
      .map((credential) => ({
        credential,
        rank: scopeRank(credential.scope, context),
      }))
      .filter(({ rank }) => rank >= 0)
      .sort(
        (left, right) =>
          right.rank - left.rank ||
          right.credential.createdAt.localeCompare(left.credential.createdAt),
      );
    invariant(
      ranked.length > 0,
      "OF_AI_CREDENTIAL_NOT_FOUND",
      "No AI credential matches the requested context.",
    );
    return ranked[0].credential;
  }

  async function useCredential({
    credentialId,
    provider,
    expectedScope,
    execution,
    consume,
  }) {
    assertTrustedExecution(execution);
    invariant(
      typeof consume === "function",
      "OF_AI_CREDENTIAL_CONSUMER_REQUIRED",
      "AI credential plaintext requires a trusted consumer.",
    );
    const entry = await requireCredential({
      credentialId,
      storage,
      sessionCredentials,
    });
    const record = entry.record ?? entry;
    assertCredentialContext(record, provider, expectedScope);
    if (isExpired(record, clock()) && record.persistence === "memory-only") {
      entry.secret.fill(0);
      sessionCredentials.delete(record.id);
    }
    invariant(
      !isExpired(record, clock()),
      "OF_AI_CREDENTIAL_EXPIRED",
      "The session AI credential has expired.",
    );

    await writeAudit(audit, "ai.credential.used", record, execution);
    if (record.persistence === "memory-only") {
      return consume(new TextDecoder().decode(entry.secret));
    }
    requireVault(vault);
    return vault.withSecret(
      record.secretRef,
      {
        provider: `ai.${record.provider}`,
        connectionId: record.id,
        name: "provider-credential",
      },
      consume,
    );
  }

  async function rotateCredential({ credentialId, value }) {
    const entry = await requireCredential({
      credentialId,
      storage,
      sessionCredentials,
    });
    const record = entry.record ?? entry;
    const rotatedAt = clock().toISOString();

    if (record.persistence === "memory-only") {
      invariant(
        value !== undefined,
        "OF_AI_CREDENTIAL_VALUE_REQUIRED",
        "Session credential rotation requires a new value.",
      );
      entry.secret.fill(0);
      entry.secret = new TextEncoder().encode(parseSecretValue(value));
      entry.record = { ...record, rotatedAt };
      await writeAudit(audit, "ai.credential.rotated", entry.record);
      return publicCredential(entry.record);
    }

    requireVault(vault);
    if (value === undefined) {
      await vault.rotateSecret(record.secretRef);
      const rotated = { ...record, rotatedAt };
      await storage.put(rotated);
      await writeAudit(audit, "ai.credential.rewrapped", rotated);
      return publicCredential(rotated);
    }

    const metadata = await vault.putSecret({
      provider: `ai.${record.provider}`,
      connectionId: record.id,
      name: "provider-credential",
      value: parseSecretValue(value),
    });
    const rotated = { ...record, secretRef: metadata.ref, rotatedAt };
    await storage.put(rotated);
    await vault.deleteSecret(record.secretRef);
    await writeAudit(audit, "ai.credential.rotated", rotated);
    return publicCredential(rotated);
  }

  async function deleteCredential(credentialId) {
    const entry = await requireCredential({
      credentialId,
      storage,
      sessionCredentials,
    });
    const record = entry.record ?? entry;
    if (record.persistence === "memory-only") {
      entry.secret.fill(0);
      sessionCredentials.delete(credentialId);
    } else {
      requireVault(vault);
      await vault.deleteSecret(record.secretRef);
      await storage.delete(credentialId);
    }
    await writeAudit(audit, "ai.credential.deleted", record);
    return { deleted: true, id: credentialId };
  }

  return {
    setCredential,
    listCredentials,
    resolveCredential,
    useCredential,
    rotateCredential,
    deleteCredential,
  };
}

export function parseCredentialScope(scope) {
  invariant(
    scope && typeof scope === "object" && !Array.isArray(scope),
    "OF_AI_CREDENTIAL_SCOPE_INVALID",
    "The AI credential scope is invalid.",
  );
  const organizationId = parseIdentifier(
    scope.organizationId,
    "organization ID",
  );
  if (scope.mode === "organization") {
    assertOnly(scope, ["mode", "organizationId"]);
    return Object.freeze({ mode: "organization", organizationId });
  }
  const projectId = parseIdentifier(scope.projectId, "project ID");
  if (scope.mode === "project") {
    assertOnly(scope, ["mode", "organizationId", "projectId"]);
    return Object.freeze({ mode: "project", organizationId, projectId });
  }
  if (scope.mode === "environment") {
    assertOnly(scope, ["mode", "organizationId", "projectId", "environment"]);
    invariant(
      ENVIRONMENTS.has(scope.environment),
      "OF_AI_CREDENTIAL_SCOPE_INVALID",
      "The AI credential environment is invalid.",
    );
    return Object.freeze({
      mode: "environment",
      organizationId,
      projectId,
      environment: scope.environment,
    });
  }
  invariant(
    scope.mode === "session",
    "OF_AI_CREDENTIAL_SCOPE_INVALID",
    "The AI credential mode is invalid.",
  );
  assertOnly(scope, ["mode", "organizationId", "projectId", "sessionId"]);
  return Object.freeze({
    mode: "session",
    organizationId,
    projectId,
    sessionId: parseIdentifier(scope.sessionId, "session ID"),
  });
}

function parseProvider(provider) {
  invariant(
    typeof provider === "string" && PROVIDER.test(provider),
    "OF_AI_CREDENTIAL_PROVIDER_INVALID",
    "The AI credential provider is invalid.",
  );
  return provider;
}

function parseIdentifier(value, field) {
  invariant(
    typeof value === "string" && IDENTIFIER.test(value),
    "OF_AI_CREDENTIAL_SCOPE_INVALID",
    `The AI credential ${field} is invalid.`,
  );
  return value;
}

function assertOnly(value, allowed) {
  invariant(
    Object.keys(value).every((key) => allowed.includes(key)),
    "OF_AI_CREDENTIAL_SCOPE_INVALID",
    "The AI credential scope contains fields outside its mode.",
  );
}

function parseSecretValue(value) {
  invariant(
    typeof value === "string" && value.length > 0 && value.length <= 65_536,
    "OF_AI_CREDENTIAL_VALUE_INVALID",
    "The AI credential value is invalid.",
  );
  return value;
}

function parseSessionExpiry(value, now) {
  invariant(
    typeof value === "string",
    "OF_AI_CREDENTIAL_EXPIRY_REQUIRED",
    "Session credentials require an expiry.",
  );
  const expiresAt = new Date(value);
  const maximum = new Date(now.getTime() + 24 * 60 * 60 * 1000);
  invariant(
    !Number.isNaN(expiresAt.getTime()) &&
      expiresAt > now &&
      expiresAt <= maximum,
    "OF_AI_CREDENTIAL_EXPIRY_INVALID",
    "Session credential expiry must be within the next 24 hours.",
  );
  return expiresAt.toISOString();
}

function requireVault(vault) {
  invariant(
    vault &&
      typeof vault.putSecret === "function" &&
      typeof vault.withSecret === "function" &&
      typeof vault.rotateSecret === "function" &&
      typeof vault.deleteSecret === "function",
    "OF_AI_CREDENTIAL_VAULT_REQUIRED",
    "Persistent AI credentials require an encrypted secret vault.",
  );
}

async function requireCredential({
  credentialId,
  storage,
  sessionCredentials,
}) {
  invariant(
    /^ai_credential_[a-f0-9]{32}$/u.test(credentialId),
    "OF_AI_CREDENTIAL_ID_INVALID",
    "The AI credential ID is invalid.",
  );
  const session = sessionCredentials.get(credentialId);
  const stored = session ? null : await storage.get(credentialId);
  invariant(
    session || stored,
    "OF_AI_CREDENTIAL_NOT_FOUND",
    "The AI credential was not found.",
  );
  return session ?? stored;
}

function assertTrustedExecution(execution) {
  invariant(
    execution?.trusted === true &&
      TRUSTED_RUNTIMES.has(execution.runtime) &&
      execution.purpose === "ai-provider-request",
    "OF_AI_CREDENTIAL_CONTEXT_UNTRUSTED",
    "AI credentials can only be decrypted in a trusted provider context.",
  );
}

function assertCredentialContext(record, provider, expectedScope) {
  if (provider !== undefined) {
    invariant(
      parseProvider(provider) === record.provider,
      "OF_AI_CREDENTIAL_CONTEXT_MISMATCH",
      "The AI credential provider does not match.",
    );
  }
  if (expectedScope !== undefined) {
    invariant(
      JSON.stringify(parseCredentialScope(expectedScope)) ===
        JSON.stringify(record.scope),
      "OF_AI_CREDENTIAL_CONTEXT_MISMATCH",
      "The AI credential scope does not match.",
    );
  }
}

function scopeMatchesContext(scope, context) {
  if (scope.organizationId !== context.organizationId) return false;
  if (scope.mode === "organization") return true;
  if (scope.projectId !== context.projectId) return false;
  if (scope.mode === "project") return true;
  if (scope.mode === "environment") {
    return scope.environment === context.environment;
  }
  return scope.sessionId === context.sessionId;
}

function scopeRank(scope, context) {
  if (!scopeMatchesContext(scope, context)) return -1;
  return {
    organization: 1,
    project: 2,
    environment: 3,
    session: 4,
  }[scope.mode];
}

function isExpired(record, now) {
  return record.expiresAt !== null && new Date(record.expiresAt) <= now;
}

function purgeExpiredSessions(sessionCredentials, now) {
  for (const [id, entry] of sessionCredentials) {
    if (isExpired(entry.record, now)) {
      entry.secret.fill(0);
      sessionCredentials.delete(id);
    }
  }
}

function publicCredential(record) {
  return structuredClone({
    schemaVersion: record.schemaVersion,
    id: record.id,
    provider: record.provider,
    scope: record.scope,
    persistence: record.persistence,
    createdAt: record.createdAt,
    rotatedAt: record.rotatedAt,
    expiresAt: record.expiresAt,
  });
}

async function writeAudit(audit, action, record, execution) {
  await audit({
    action,
    credentialId: record.id,
    provider: record.provider,
    scope: record.scope,
    persistence: record.persistence,
    runtime: execution?.runtime ?? null,
  });
}
