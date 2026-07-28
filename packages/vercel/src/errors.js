export class VercelIntegrationError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "VercelIntegrationError";
    this.code = code;
    this.details = details;
  }
}

export function invariant(condition, code, message, details) {
  if (!condition) {
    throw new VercelIntegrationError(code, message, details);
  }
}
