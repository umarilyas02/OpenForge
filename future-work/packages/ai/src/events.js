import { AIProviderError, invariant } from "./errors.js";

const EVENT_TYPES = new Set([
  "start",
  "text-delta",
  "tool-call",
  "structured-output",
  "usage",
  "finish",
]);

export function parseAIEvent(event) {
  invariant(
    event && EVENT_TYPES.has(event.type),
    "OF_AI_EVENT_INVALID",
    "The AI stream event type is invalid.",
  );
  switch (event.type) {
    case "start":
      return {
        type: "start",
        responseId: safeString(event.responseId, 200, "response ID"),
      };
    case "text-delta":
      return {
        type: "text-delta",
        delta: safeString(event.delta, 100_000, "text delta"),
      };
    case "tool-call":
      invariant(
        /^[a-zA-Z_][a-zA-Z0-9_-]{0,63}$/u.test(event.name) &&
          typeof event.arguments === "object" &&
          event.arguments !== null &&
          !Array.isArray(event.arguments),
        "OF_AI_TOOL_EVENT_INVALID",
        "The normalized tool call is invalid.",
      );
      return {
        type: "tool-call",
        id: safeString(event.id, 200, "tool call ID"),
        name: event.name,
        arguments: cloneJSONValue(event.arguments, "tool arguments"),
      };
    case "structured-output":
      return {
        type: "structured-output",
        value: cloneJSONValue(event.value, "structured output"),
      };
    case "usage":
      return { type: "usage", usage: parseUsage(event.usage) };
    case "finish":
      invariant(
        ["stop", "length", "tool", "content-filter", "error"].includes(
          event.reason,
        ),
        "OF_AI_FINISH_REASON_INVALID",
        "The AI finish reason is invalid.",
      );
      return { type: "finish", reason: event.reason };
    default:
      throw new AIProviderError({
        code: "OF_AI_EVENT_INVALID",
        message: "The AI event could not be normalized.",
      });
  }
}

export function parseUsage(value) {
  const usage = {
    inputTokens: tokenCount(value?.inputTokens),
    outputTokens: tokenCount(value?.outputTokens),
    cachedInputTokens: tokenCount(value?.cachedInputTokens ?? 0),
    reasoningTokens: tokenCount(value?.reasoningTokens ?? 0),
  };
  return {
    ...usage,
    totalTokens: usage.inputTokens + usage.outputTokens,
  };
}

export async function collectAIStream(stream) {
  const result = {
    responseId: null,
    text: "",
    toolCalls: [],
    structuredOutput: null,
    usage: null,
    finishReason: null,
  };
  let started = false;
  let finished = false;
  for await (const rawEvent of stream) {
    const event = parseAIEvent(rawEvent);
    invariant(
      !finished,
      "OF_AI_EVENT_AFTER_FINISH",
      "The AI provider emitted an event after finish.",
    );
    if (event.type === "start") {
      invariant(
        !started,
        "OF_AI_START_DUPLICATE",
        "The AI provider emitted more than one start event.",
      );
      started = true;
      result.responseId = event.responseId;
      continue;
    }
    invariant(
      started,
      "OF_AI_START_REQUIRED",
      "The AI provider must emit start before output.",
    );
    if (event.type === "text-delta") result.text += event.delta;
    if (event.type === "tool-call") result.toolCalls.push(event);
    if (event.type === "structured-output") {
      result.structuredOutput = event.value;
    }
    if (event.type === "usage") result.usage = event.usage;
    if (event.type === "finish") {
      finished = true;
      result.finishReason = event.reason;
    }
  }
  invariant(
    started && finished,
    "OF_AI_STREAM_INCOMPLETE",
    "The AI provider stream did not start and finish correctly.",
  );
  return result;
}

function safeString(value, max, field) {
  invariant(
    typeof value === "string" && value.length > 0 && value.length <= max,
    "OF_AI_EVENT_FIELD_INVALID",
    `The AI ${field} is invalid.`,
  );
  return value;
}

function tokenCount(value) {
  invariant(
    Number.isSafeInteger(value) && value >= 0,
    "OF_AI_USAGE_INVALID",
    "AI token usage must use non-negative safe integers.",
  );
  return value;
}

function cloneJSONValue(value, field) {
  try {
    const serialized = JSON.stringify(value);
    invariant(
      serialized !== undefined,
      "OF_AI_JSON_INVALID",
      `The AI ${field} must be JSON serializable.`,
    );
    return JSON.parse(serialized);
  } catch (error) {
    if (error?.code === "OF_AI_JSON_INVALID") throw error;
    invariant(
      false,
      "OF_AI_JSON_INVALID",
      `The AI ${field} must be JSON serializable.`,
    );
  }
}
