import { parseModelCapabilities } from "./capabilities.js";
import { AIProviderError, invariant } from "./errors.js";

export function normalizeAdapterCapabilities(provider, models) {
  invariant(
    Array.isArray(models) && models.length > 0,
    "OF_AI_ADAPTER_MODELS_REQUIRED",
    "An AI adapter requires explicit model capabilities.",
  );
  return models.map((model) => {
    const capabilities = parseModelCapabilities({
      ...model,
      provider,
    });
    return capabilities;
  });
}

export async function resolveImage(part, resolveAsset) {
  invariant(
    typeof resolveAsset === "function",
    "OF_AI_ASSET_RESOLVER_REQUIRED",
    "Image input requires a managed asset resolver.",
  );
  const resolved = await resolveAsset(part.assetRef);
  invariant(
    resolved &&
      typeof resolved.data === "string" &&
      /^[a-zA-Z0-9+/]+={0,2}$/u.test(resolved.data) &&
      resolved.mimeType === part.mimeType,
    "OF_AI_ASSET_INVALID",
    "The managed AI image asset is invalid.",
  );
  return resolved;
}

export async function listProviderModelIds(list) {
  const response = await list();
  const ids = [];
  if (response?.data && Array.isArray(response.data)) {
    ids.push(...response.data.map((model) => model.id ?? model.name));
  } else if (response?.models && Array.isArray(response.models)) {
    ids.push(...response.models.map((model) => model.id ?? model.name));
  } else if (response?.[Symbol.asyncIterator]) {
    for await (const model of response) ids.push(model.id ?? model.name);
  } else if (response?.[Symbol.iterator]) {
    for (const model of response) ids.push(model.id ?? model.name);
  }
  return [
    ...new Set(
      ids.filter((id) => typeof id === "string" && id.length > 0).sort(),
    ),
  ];
}

export function providerError(provider, model, error) {
  if (error instanceof AIProviderError) return error;
  if (error?.name === "AbortError") {
    return new AIProviderError({
      code: "OF_AI_ABORTED",
      message: "The AI request was canceled.",
      category: "canceled",
      retryable: false,
      provider,
      model,
    });
  }
  const status = Number.isInteger(error?.status) ? error.status : null;
  const retryable =
    status === 408 || status === 409 || status === 429 || status >= 500;
  const category =
    status === 401
      ? "authentication"
      : status === 403
        ? "permission"
        : status === 429
          ? "rate-limit"
          : retryable
            ? "availability"
            : "provider";
  return new AIProviderError({
    code: "OF_AI_PROVIDER_FAILED",
    message: "The AI provider request failed.",
    category,
    retryable,
    status,
    provider,
    model,
  });
}

export function parseJSON(value, provider, model, field) {
  try {
    const parsed = typeof value === "string" ? JSON.parse(value) : value;
    invariant(
      parsed !== null && typeof parsed === "object" && !Array.isArray(parsed),
      "OF_AI_PROVIDER_JSON_INVALID",
      `The ${provider} ${field} was not a JSON object.`,
    );
    return parsed;
  } catch (error) {
    if (error?.code === "OF_AI_PROVIDER_JSON_INVALID") throw error;
    throw new AIProviderError({
      code: "OF_AI_PROVIDER_JSON_INVALID",
      message: "The AI provider returned invalid structured JSON.",
      category: "provider",
      retryable: false,
      provider,
      model,
    });
  }
}

export function usageEvent({
  inputTokens = 0,
  outputTokens = 0,
  cachedInputTokens = 0,
  reasoningTokens = 0,
}) {
  return {
    type: "usage",
    usage: {
      inputTokens: inputTokens ?? 0,
      outputTokens: outputTokens ?? 0,
      cachedInputTokens: cachedInputTokens ?? 0,
      reasoningTokens: reasoningTokens ?? 0,
    },
  };
}

export function finishReason(reason, toolCalls = 0) {
  if (toolCalls > 0) return "tool";
  if (
    ["max_tokens", "max_output_tokens", "length", "MAX_TOKENS"].includes(reason)
  ) {
    return "length";
  }
  if (
    ["content_filter", "refusal", "safety", "SAFETY", "PROHIBITED"].includes(
      reason,
    )
  ) {
    return "content-filter";
  }
  if (["error", "failed", "cancelled"].includes(reason)) return "error";
  return "stop";
}
