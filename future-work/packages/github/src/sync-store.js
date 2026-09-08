export function createMemoryGitSyncStore() {
  const states = new Map();
  const pulls = new Map();

  return {
    async getState(connectionId) {
      const state = states.get(connectionId);
      return state ? structuredClone(state) : null;
    },
    async putState(connectionId, state) {
      states.set(connectionId, structuredClone(state));
    },
    async putPull(pull) {
      pulls.set(pull.id, structuredClone(pull));
    },
    async consumePull(id) {
      const pull = pulls.get(id);
      pulls.delete(id);
      return pull ? structuredClone(pull) : null;
    },
  };
}
