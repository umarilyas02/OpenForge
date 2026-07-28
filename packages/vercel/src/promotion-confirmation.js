import { createHash, randomBytes } from "node:crypto";

import { invariant } from "./errors.js";

export function createPromotionConfirmations({
  store,
  clock = () => Date.now(),
  ttlMs = 10 * 60 * 1000,
} = {}) {
  return {
    async issue(plan) {
      const token = randomBytes(32).toString("base64url");
      await store.putConfirmation(hash(token), {
        plan,
        expiresAt: clock() + ttlMs,
        usedAt: null,
      });
      return token;
    },
    async get(token) {
      const record = await store.getConfirmation(hash(token));
      invariant(
        record && (record.expiresAt > clock() || record.usedAt),
        "OF_VERCEL_PROMOTION_CONFIRMATION_REJECTED",
        "The production confirmation is invalid or expired.",
      );
      return record;
    },
    async markUsed(token) {
      const key = hash(token);
      const record = await store.getConfirmation(key);
      await store.putConfirmation(key, {
        ...record,
        usedAt: new Date(clock()).toISOString(),
      });
    },
  };
}

export function assertPromotionTarget(expected, supplied) {
  invariant(
    supplied?.projectId === expected.projectId &&
      supplied?.deploymentId === expected.deploymentId &&
      supplied?.environment === "production",
    "OF_VERCEL_PROMOTION_TARGET_MISMATCH",
    "Production confirmation does not match the prepared deployment target.",
  );
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}
