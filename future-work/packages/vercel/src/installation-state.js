import { createHash, randomBytes } from "node:crypto";

export function createMemoryVercelStateStore({
  clock = () => Date.now(),
  ttlMs = 10 * 60 * 1000,
} = {}) {
  const records = new Map();

  return {
    async issue(context) {
      purge();
      const state = randomBytes(32).toString("base64url");
      records.set(hash(state), {
        context: structuredClone(context),
        expiresAt: clock() + ttlMs,
      });
      return state;
    },
    async consume(state) {
      purge();
      const key = hash(state);
      const record = records.get(key);
      records.delete(key);
      return record ? structuredClone(record.context) : null;
    },
  };

  function purge() {
    const now = clock();
    for (const [key, record] of records) {
      if (record.expiresAt <= now) records.delete(key);
    }
  }
}

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}
