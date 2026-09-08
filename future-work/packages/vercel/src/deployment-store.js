export function createMemoryDeploymentStore() {
  const jobs = new Map();
  const confirmations = new Map();

  return {
    async putJob(job) {
      jobs.set(job.id, structuredClone(job));
    },
    async getJob(id) {
      const job = jobs.get(id);
      return job ? structuredClone(job) : null;
    },
    async updateJob(id, update) {
      const job = { ...jobs.get(id), ...structuredClone(update) };
      jobs.set(id, job);
      return structuredClone(job);
    },
    async putConfirmation(hash, record) {
      confirmations.set(hash, structuredClone(record));
    },
    async getConfirmation(hash) {
      const record = confirmations.get(hash);
      return record ? structuredClone(record) : null;
    },
  };
}
