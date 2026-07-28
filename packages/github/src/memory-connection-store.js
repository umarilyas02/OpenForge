export function createMemoryGitHubConnectionStore() {
  const connections = new Map();

  return {
    async put(connection) {
      connections.set(connection.id, structuredClone(connection));
    },
    async get(id) {
      const connection = connections.get(id);
      return connection ? structuredClone(connection) : null;
    },
    async list(projectId) {
      return [...connections.values()]
        .filter((connection) => connection.projectId === projectId)
        .map((connection) => structuredClone(connection));
    },
  };
}
