export class AIContractError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "AIContractError";
    this.code = code;
    this.details = details;
  }
}

export class AIProviderError extends Error {
  constructor({
    code,
    message,
    category = "provider",
    retryable = false,
    status = null,
    provider,
    model,
  }) {
    super(message);
    this.name = "AIProviderError";
    this.code = code;
    this.category = category;
    this.retryable = retryable;
    this.status = status;
    this.provider = provider;
    this.model = model;
  }
}

export function invariant(condition, code, message, details) {
  if (!condition) throw new AIContractError(code, message, details);
}

export function normalizeProviderError(error, context = {}) {
  if (error instanceof AIProviderError) return error;
  if (error?.name === "AbortError") {
    return new AIProviderError({
      code: "OF_AI_ABORTED",
      message: "The AI request was canceled.",
      category: "canceled",
      retryable: false,
      ...context,
    });
  }
  return new AIProviderError({
    code: "OF_AI_PROVIDER_FAILED",
    message: "The AI provider request failed.",
    category: "provider",
    retryable: false,
    ...context,
  });
}
