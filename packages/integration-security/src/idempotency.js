import { createHash } from "node:crypto";

import { canonicalJson } from "./canonical-json.js";
import { IntegrationSecurityError, invariant } from "./errors.js";

export function createMemoryIdempotencyStore() {
  const records = new Map();
  const waiters = new Map();

  return {
    async claim(key, requestHash, now) {
      const existing = records.get(key);
      if (existing)
        return { claimed: false, record: structuredClone(existing) };
      const record = { key, requestHash, status: "pending", createdAt: now };
      records.set(key, record);
      return { claimed: true, record: structuredClone(record) };
    },
    async complete(key, result, completedAt) {
      const record = records.get(key);
      records.set(key, {
        ...record,
        status: "completed",
        result: structuredClone(result),
        completedAt,
      });
      settle(key);
    },
    async fail(key, error, failedAt) {
      const record = records.get(key);
      records.set(key, {
        ...record,
        status: "failed",
        error: structuredClone(error),
        failedAt,
      });
      settle(key);
    },
    async wait(key) {
      const record = records.get(key);
      if (record?.status !== "pending") return structuredClone(record);
      return new Promise((resolve) => {
        const entries = waiters.get(key) ?? [];
        entries.push(resolve);
        waiters.set(key, entries);
      });
    },
  };

  function settle(key) {
    const record = structuredClone(records.get(key));
    for (const resolve of waiters.get(key) ?? []) resolve(record);
    waiters.delete(key);
  }
}

export function createIdempotencyExecutor({
  store = createMemoryIdempotencyStore(),
  clock = () => new Date(),
} = {}) {
  return async function execute({ key, operation, input }, perform) {
    invariant(
      /^[a-zA-Z0-9._:-]{8,200}$/u.test(key),
      "OF_IDEMPOTENCY_KEY_INVALID",
      "The idempotency key is invalid.",
    );
    invariant(
      /^[a-z0-9][a-z0-9:._-]{2,80}$/u.test(operation),
      "OF_IDEMPOTENCY_OPERATION_INVALID",
      "The idempotent operation name is invalid.",
    );
    invariant(
      typeof perform === "function",
      "OF_IDEMPOTENCY_HANDLER_REQUIRED",
      "An idempotent operation handler is required.",
    );
    const requestHash = createHash("sha256")
      .update(canonicalJson({ operation, input }))
      .digest("hex");
    const claim = await store.claim(
      `${operation}:${key}`,
      requestHash,
      clock().toISOString(),
    );

    if (!claim.claimed) {
      assertMatchingRequest(claim.record, requestHash);
      const record =
        claim.record.status === "pending"
          ? await store.wait(claim.record.key)
          : claim.record;
      return replay(record);
    }

    try {
      const result = await perform();
      await store.complete(claim.record.key, result, clock().toISOString());
      return { replayed: false, result };
    } catch (error) {
      await store.fail(
        claim.record.key,
        {
          code: error?.code ?? "OF_IDEMPOTENT_OPERATION_FAILED",
          message: error?.message ?? "The operation failed.",
        },
        clock().toISOString(),
      );
      throw error;
    }
  };
}

function assertMatchingRequest(record, requestHash) {
  if (record.requestHash !== requestHash) {
    throw new IntegrationSecurityError(
      "OF_IDEMPOTENCY_INPUT_MISMATCH",
      "The idempotency key was already used with different input.",
    );
  }
}

function replay(record) {
  if (record.status === "completed") {
    return { replayed: true, result: record.result };
  }
  throw new IntegrationSecurityError(
    record.error?.code ?? "OF_IDEMPOTENT_OPERATION_FAILED",
    record.error?.message ?? "The previous operation failed.",
    { replayed: true },
  );
}
