export class ThemeError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "ThemeError";
    this.code = code;
    this.details = details;
  }
}

export function invariant(condition, code, message, details) {
  if (!condition) {
    throw new ThemeError(code, message, details);
  }
}
