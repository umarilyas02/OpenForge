export class EventError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "EventError";
    this.code = code;
    this.details = details;
  }
}

export function invariant(condition, code, message, details) {
  if (!condition) {
    throw new EventError(code, message, details);
  }
}
