export class RendererError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "RendererError";
    this.code = code;
    this.details = details;
  }
}

export function invariant(condition, code, message, details) {
  if (!condition) {
    throw new RendererError(code, message, details);
  }
}
