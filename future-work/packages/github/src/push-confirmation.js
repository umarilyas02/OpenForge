import { createHash, randomBytes } from "node:crypto";

import { invariant } from "./errors.js";

export function createMemoryPushConfirmationStore({
  clock = () => Date.now(),
  ttlMs = 10 * 60 * 1000,
} = {}) {
  const plans = new Map();

  return {
    async issue(plan) {
      purge();
      const token = randomBytes(32).toString("base64url");
      plans.set(hash(token), {
        plan: structuredClone(plan),
        expiresAt: clock() + ttlMs,
      });
      return token;
    },
    async consume(token) {
      purge();
      const key = hash(token);
      const record = plans.get(key);
      plans.delete(key);
      return record ? structuredClone(record.plan) : null;
    },
  };

  function purge() {
    const now = clock();
    for (const [key, record] of plans) {
      if (record.expiresAt <= now) plans.delete(key);
    }
  }
}

export function assertPushTarget(expected, supplied) {
  invariant(
    supplied?.owner === expected.owner &&
      supplied?.name === expected.name &&
      supplied?.branch === expected.branch,
    "OF_GITHUB_PUSH_TARGET_MISMATCH",
    "Push confirmation does not match the prepared repository target.",
    { expected, supplied },
  );
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}
