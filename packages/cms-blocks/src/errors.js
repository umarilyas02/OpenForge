export class CmsBlockError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "CmsBlockError";
    this.code = code;
    this.details = details;
  }
}

export function invariant(condition, code, message, details) {
  if (!condition) {
    throw new CmsBlockError(code, message, details);
  }
}
