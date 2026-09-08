export class GitHubIntegrationError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "GitHubIntegrationError";
    this.code = code;
    this.details = details;
  }
}

export function invariant(condition, code, message, details) {
  if (!condition) {
    throw new GitHubIntegrationError(code, message, details);
  }
}
