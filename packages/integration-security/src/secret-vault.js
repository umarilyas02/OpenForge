import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
  randomUUID,
} from "node:crypto";

import { canonicalJson } from "./canonical-json.js";
import { IntegrationSecurityError, invariant } from "./errors.js";

const ALGORITHM = "aes-256-gcm";

export function createMemorySecretStorage() {
  const records = new Map();

  return {
    async put(record) {
      records.set(record.ref, structuredClone(record));
    },
    async get(ref) {
      const record = records.get(ref);
      return record ? structuredClone(record) : null;
    },
    async delete(ref) {
      return records.delete(ref);
    },
  };
}

export function createSecretVault({
  keys,
  activeKeyId,
  storage = createMemorySecretStorage(),
  clock = () => new Date(),
} = {}) {
  const keyring = normalizeKeys(keys);
  invariant(
    keyring.has(activeKeyId),
    "OF_SECRET_KEY_UNKNOWN",
    "The active encryption key is not in the keyring.",
  );

  async function putSecret({ provider, connectionId, name, value }) {
    const metadata = normalizeMetadata({ provider, connectionId, name });
    const ref = `secret_${randomUUID().replaceAll("-", "")}`;
    const createdAt = clock().toISOString();
    const record = encrypt({
      ref,
      value,
      metadata,
      createdAt,
      keyId: activeKeyId,
      key: keyring.get(activeKeyId),
    });
    await storage.put(record);
    return publicMetadata(record);
  }

  async function withSecret(ref, expectedContext, consume) {
    invariant(
      typeof consume === "function",
      "OF_SECRET_CONSUMER_REQUIRED",
      "Secret plaintext can only be accessed through a consumer callback.",
    );
    const record = await requireRecord(storage, ref);
    assertContext(record.metadata, expectedContext);
    const plaintext = decrypt(record, keyring);
    try {
      return await consume(plaintext.toString("utf8"));
    } finally {
      plaintext.fill(0);
    }
  }

  async function rotateSecret(ref) {
    const record = await requireRecord(storage, ref);
    if (record.keyId === activeKeyId) {
      return publicMetadata(record);
    }
    const plaintext = decrypt(record, keyring);
    try {
      const rotated = encrypt({
        ref,
        value: plaintext,
        metadata: record.metadata,
        createdAt: record.createdAt,
        keyId: activeKeyId,
        key: keyring.get(activeKeyId),
        rotatedAt: clock().toISOString(),
      });
      await storage.put(rotated);
      return publicMetadata(rotated);
    } finally {
      plaintext.fill(0);
    }
  }

  return {
    putSecret,
    withSecret,
    rotateSecret,
    async getMetadata(ref) {
      return publicMetadata(await requireRecord(storage, ref));
    },
    async deleteSecret(ref) {
      return storage.delete(ref);
    },
  };
}

function normalizeKeys(keys) {
  const entries = keys instanceof Map ? [...keys] : Object.entries(keys ?? {});
  const keyring = new Map();
  for (const [id, value] of entries) {
    const key = Buffer.isBuffer(value)
      ? Buffer.from(value)
      : Buffer.from(value ?? "", "base64");
    invariant(
      /^[a-zA-Z0-9._-]{1,64}$/u.test(id) && key.length === 32,
      "OF_SECRET_KEY_INVALID",
      "Encryption keys require a safe ID and exactly 32 bytes.",
      { keyId: id },
    );
    keyring.set(id, key);
  }
  return keyring;
}

function normalizeMetadata(metadata) {
  for (const [field, value] of Object.entries(metadata)) {
    invariant(
      typeof value === "string" && /^[a-zA-Z0-9._:/-]{1,160}$/u.test(value),
      "OF_SECRET_METADATA_INVALID",
      `Secret ${field} is invalid.`,
      { field },
    );
  }
  return Object.freeze({ ...metadata });
}

function encrypt({ ref, value, metadata, createdAt, rotatedAt, keyId, key }) {
  const plaintext = Buffer.isBuffer(value)
    ? Buffer.from(value)
    : Buffer.from(String(value), "utf8");
  invariant(
    plaintext.length > 0,
    "OF_SECRET_VALUE_EMPTY",
    "Secret values cannot be empty.",
  );
  const iv = randomBytes(12);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  cipher.setAAD(aad({ ref, metadata, createdAt }));
  try {
    const ciphertext = Buffer.concat([
      cipher.update(plaintext),
      cipher.final(),
    ]);
    return {
      version: 1,
      algorithm: ALGORITHM,
      ref,
      keyId,
      metadata,
      createdAt,
      rotatedAt,
      iv: iv.toString("base64"),
      tag: cipher.getAuthTag().toString("base64"),
      ciphertext: ciphertext.toString("base64"),
    };
  } finally {
    plaintext.fill(0);
  }
}

function decrypt(record, keyring) {
  invariant(
    record.version === 1 && record.algorithm === ALGORITHM,
    "OF_SECRET_RECORD_UNSUPPORTED",
    "The encrypted secret record format is unsupported.",
  );
  const key = keyring.get(record.keyId);
  invariant(
    key,
    "OF_SECRET_KEY_UNKNOWN",
    "The secret encryption key is unavailable.",
    { keyId: record.keyId },
  );
  try {
    const decipher = createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(record.iv, "base64"),
    );
    decipher.setAAD(aad(record));
    decipher.setAuthTag(Buffer.from(record.tag, "base64"));
    return Buffer.concat([
      decipher.update(Buffer.from(record.ciphertext, "base64")),
      decipher.final(),
    ]);
  } catch {
    throw new IntegrationSecurityError(
      "OF_SECRET_AUTH_FAILED",
      "Encrypted secret authentication failed.",
    );
  }
}

function aad({ ref, metadata, createdAt }) {
  return Buffer.from(canonicalJson({ ref, metadata, createdAt }), "utf8");
}

function publicMetadata(record) {
  return {
    ref: record.ref,
    provider: record.metadata.provider,
    connectionId: record.metadata.connectionId,
    name: record.metadata.name,
    keyId: record.keyId,
    createdAt: record.createdAt,
    rotatedAt: record.rotatedAt ?? null,
  };
}

function assertContext(actual, expected = {}) {
  for (const field of ["provider", "connectionId", "name"]) {
    if (expected[field] !== undefined) {
      invariant(
        expected[field] === actual[field],
        "OF_SECRET_CONTEXT_MISMATCH",
        "The secret reference does not belong to the requested context.",
        { field },
      );
    }
  }
}

async function requireRecord(storage, ref) {
  invariant(
    /^secret_[a-f0-9]{32}$/u.test(ref),
    "OF_SECRET_REFERENCE_INVALID",
    "The secret reference is invalid.",
  );
  const record = await storage.get(ref);
  invariant(
    record,
    "OF_SECRET_NOT_FOUND",
    "The secret reference was not found.",
  );
  return record;
}
