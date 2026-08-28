/**
 * In-memory session store for tests and local scripts. Implements the same
 * `{ create, findByTokenHash, revoke }` interface as the Drizzle-backed
 * store so `createSessionManager` never needs to know which one it holds.
 */
export function createMemorySessionStore() {
  const records = new Map();
  let counter = 0;

  return {
    async create({ userId, tokenHash, deviceMetadata, expiresAt }) {
      const record = {
        id: `session_${++counter}`,
        userId,
        tokenHash,
        deviceMetadata,
        expiresAt,
        revokedAt: null,
      };
      records.set(tokenHash, record);
      return structuredClone(record);
    },
    async findByTokenHash(tokenHash) {
      const record = records.get(tokenHash);
      return record ? structuredClone(record) : null;
    },
    async revoke(tokenHash, revokedAt) {
      const record = records.get(tokenHash);
      if (record) record.revokedAt = revokedAt;
    },
  };
}
