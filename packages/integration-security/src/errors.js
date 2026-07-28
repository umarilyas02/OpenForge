export class IntegrationSecurityError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "IntegrationSecurityError";
    this.code = code;
    this.details = details;
  }
}

export function invariant(condition, code, message, details) {
  if (!condition) {
    throw new IntegrationSecurityError(code, message, details);
  }
}
