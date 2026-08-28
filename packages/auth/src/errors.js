export class AuthError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "AuthError";
    this.code = code;
    this.details = details;
  }
}

export function invariant(condition, code, message, details) {
  if (!condition) {
    throw new AuthError(code, message, details);
  }
}
