export class ConfigError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "ConfigError";
    this.code = code;
    this.details = details;
  }
}

export function invariant(condition, code, message, details) {
  if (!condition) {
    throw new ConfigError(code, message, details);
  }
}
