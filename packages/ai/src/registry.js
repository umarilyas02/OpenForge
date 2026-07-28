import { capabilityKey, parseModelCapabilities } from "./capabilities.js";
import {
  assertAIProviderAllowed,
  parseAIAdminPolicy,
} from "./context-policy.js";
import {
  AIProviderError,
  invariant,
  normalizeProviderError,
} from "./errors.js";
import { parseAIEvent } from "./events.js";
import { parseAIRequest } from "./request.js";

export function createAIProviderRegistry({ policy } = {}) {
  const models = new Map();
  const adminPolicy = parseAIAdminPolicy(policy);

  return {
    register(adapter) {
      invariant(
        adapter &&
          typeof adapter.stream === "function" &&
          Array.isArray(adapter.capabilities),
        "OF_AI_ADAPTER_INVALID",
        "An AI provider adapter is invalid.",
      );
      const declarations = adapter.capabilities.map((declaration) => {
        const capabilities = parseModelCapabilities(declaration);
        return { capabilities, key: capabilityKey(capabilities) };
      });
      const keys = declarations.map(({ key }) => key);
      invariant(
        new Set(keys).size === keys.length,
        "OF_AI_MODEL_DUPLICATE",
        "The AI provider adapter declares a model more than once.",
      );
      for (const { key } of declarations) {
        invariant(
          !models.has(key),
          "OF_AI_MODEL_DUPLICATE",
          "The AI provider model is already registered.",
          { key },
        );
      }
      for (const { capabilities, key } of declarations) {
        models.set(key, { adapter, capabilities });
      }
    },

    list() {
      return [...models.values()]
        .map(({ capabilities }) => capabilities)
        .sort((left, right) =>
          capabilityKey(left).localeCompare(capabilityKey(right)),
        );
    },

    get(selection) {
      const entry = models.get(capabilityKey(selection));
      invariant(
        entry,
        "OF_AI_MODEL_NOT_FOUND",
        "The selected AI provider model is not registered.",
        { selection },
      );
      return entry;
    },

    stream({ selection, request, fallback, signal }) {
      return streamWithFallback({
        models,
        selection,
        request,
        fallback,
        signal,
        adminPolicy,
      });
    },
  };
}

async function* streamWithFallback({
  models,
  selection,
  request,
  fallback,
  signal,
  adminPolicy,
}) {
  const candidates = [
    selection,
    ...(fallback?.enabled ? (fallback.candidates ?? []) : []),
  ];
  invariant(
    candidates.length >= 1 && candidates.length <= 5,
    "OF_AI_FALLBACK_INVALID",
    "The AI fallback policy is invalid.",
  );
  const attempted = [];

  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    const key = capabilityKey(candidate);
    invariant(
      !attempted.includes(key),
      "OF_AI_FALLBACK_INVALID",
      "Fallback candidates must be unique.",
    );
    attempted.push(key);
    const entry = models.get(key);
    invariant(
      entry,
      "OF_AI_MODEL_NOT_FOUND",
      "An AI fallback model is not registered.",
      { candidate },
    );
    assertAIProviderAllowed(
      {
        selection: candidate,
        requiredCapabilities: inferRequiredCapabilities(request),
      },
      adminPolicy,
    );
    const parsedRequest = parseAIRequest(request, entry.capabilities);
    let emitted = false;
    try {
      for await (const rawEvent of entry.adapter.stream({
        model: entry.capabilities.model,
        request: parsedRequest,
        signal,
      })) {
        const event = parseAIEvent(rawEvent);
        emitted = true;
        yield {
          ...event,
          provider: entry.capabilities.provider,
          model: entry.capabilities.model,
        };
      }
      return;
    } catch (error) {
      const normalized = normalizeProviderError(error, {
        provider: entry.capabilities.provider,
        model: entry.capabilities.model,
      });
      const canFallback =
        !emitted &&
        fallback?.enabled === true &&
        normalized.retryable &&
        index < candidates.length - 1;
      if (!canFallback) throw normalized;
    }
  }

  throw new AIProviderError({
    code: "OF_AI_PROVIDER_UNAVAILABLE",
    message: "No AI provider completed the request.",
    category: "availability",
    retryable: true,
  });
}

function inferRequiredCapabilities(request) {
  const required = new Set(["text"]);
  if (
    request?.messages?.some((message) =>
      message?.content?.some((part) => part?.type === "image"),
    )
  ) {
    required.add("image");
  }
  if (request?.tools?.length > 0) required.add("tools");
  if (request?.responseSchema !== undefined) {
    required.add("structured-output");
  }
  return [...required];
}
