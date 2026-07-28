import { createHash, randomBytes } from "node:crypto";

import { invariant } from "./errors.js";

export function createMemoryOAuthStateStore({
  clock = () => Date.now(),
  ttlMs = 10 * 60 * 1000,
} = {}) {
  const states = new Map();

  return {
    async issue(context) {
      purge();
      const state = randomBytes(32).toString("base64url");
      states.set(hash(state), {
        context: structuredClone(context),
        expiresAt: clock() + ttlMs,
      });
      return state;
    },
    async consume(state) {
      purge();
      const key = hash(state);
      const record = states.get(key);
      states.delete(key);
      return record ? structuredClone(record.context) : null;
    },
  };

  function purge() {
    const now = clock();
    for (const [key, record] of states) {
      if (record.expiresAt <= now) states.delete(key);
    }
  }
}

export function assertOAuthCode(code) {
  invariant(
    typeof code === "string" && /^[a-zA-Z0-9_-]{8,512}$/u.test(code),
    "OF_GITHUB_OAUTH_CODE_INVALID",
    "The GitHub authorization code is invalid.",
  );
  return code;
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}
