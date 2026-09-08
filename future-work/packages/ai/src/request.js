import { invariant } from "./errors.js";

const ROLES = new Set(["system", "user", "assistant", "tool"]);

export function parseAIRequest(input, capabilities) {
  invariant(
    input && typeof input === "object" && !Array.isArray(input),
    "OF_AI_REQUEST_INVALID",
    "The AI request must be an object.",
  );
  invariant(
    Array.isArray(input.messages) && input.messages.length > 0,
    "OF_AI_MESSAGES_INVALID",
    "At least one AI message is required.",
  );
  const messages = input.messages.map((message) =>
    parseMessage(message, capabilities),
  );
  const tools = (input.tools ?? []).map(parseTool);
  invariant(
    tools.length === 0 || capabilities.tools.supported,
    "OF_AI_TOOLS_UNSUPPORTED",
    "The selected model does not support tools.",
  );
  invariant(
    input.responseSchema === undefined ||
      capabilities.structuredOutput.supported,
    "OF_AI_STRUCTURED_OUTPUT_UNSUPPORTED",
    "The selected model does not support structured output.",
  );
  const maxOutputTokens =
    input.maxOutputTokens ?? capabilities.limits.outputTokens;
  invariant(
    Number.isSafeInteger(maxOutputTokens) &&
      maxOutputTokens > 0 &&
      maxOutputTokens <= capabilities.limits.outputTokens,
    "OF_AI_OUTPUT_LIMIT_INVALID",
    "The requested output token limit exceeds model capabilities.",
  );
  return {
    schemaVersion: 1,
    messages,
    tools,
    toolChoice: parseToolChoice(input.toolChoice, tools),
    responseSchema:
      input.responseSchema === undefined
        ? null
        : cloneJSONObject(input.responseSchema, "response schema"),
    maxOutputTokens,
    temperature: parseTemperature(input.temperature),
    metadata: parseMetadata(input.metadata),
  };
}

function parseMessage(message, capabilities) {
  invariant(
    message &&
      ROLES.has(message.role) &&
      Array.isArray(message.content) &&
      message.content.length > 0,
    "OF_AI_MESSAGE_INVALID",
    "An AI message is invalid.",
  );
  return {
    role: message.role,
    content: message.content.map((part) =>
      parseContentPart(part, capabilities),
    ),
    ...(message.toolCallId ? { toolCallId: message.toolCallId } : {}),
  };
}

function parseContentPart(part, capabilities) {
  if (part?.type === "text") {
    invariant(
      typeof part.text === "string" && part.text.length > 0,
      "OF_AI_CONTENT_INVALID",
      "AI text content must be non-empty.",
    );
    return { type: "text", text: part.text };
  }
  if (part?.type === "image") {
    invariant(
      capabilities.inputModalities.includes("image"),
      "OF_AI_IMAGE_UNSUPPORTED",
      "The selected model does not support image input.",
    );
    invariant(
      /^asset_[a-zA-Z0-9_-]{8,200}$/u.test(part.assetRef) &&
        /^image\/[a-zA-Z0-9.+-]{1,100}$/u.test(part.mimeType),
      "OF_AI_CONTENT_INVALID",
      "AI image content must use a valid managed asset reference.",
    );
    return {
      type: "image",
      assetRef: part.assetRef,
      mimeType: part.mimeType,
    };
  }
  invariant(
    false,
    "OF_AI_CONTENT_INVALID",
    "The AI content part type is invalid.",
  );
}

function parseTool(tool) {
  invariant(
    tool &&
      /^[a-zA-Z_][a-zA-Z0-9_-]{0,63}$/u.test(tool.name) &&
      typeof tool.description === "string" &&
      tool.description.length <= 1000 &&
      tool.inputSchema &&
      typeof tool.inputSchema === "object" &&
      !Array.isArray(tool.inputSchema),
    "OF_AI_TOOL_INVALID",
    "An AI tool declaration is invalid.",
  );
  return {
    name: tool.name,
    description: tool.description,
    inputSchema: cloneJSONObject(tool.inputSchema, "tool input schema"),
  };
}

function parseToolChoice(choice = "auto", tools) {
  invariant(
    ["auto", "none", "required"].includes(choice) ||
      (typeof choice === "object" &&
        tools.some(({ name }) => name === choice.name)),
    "OF_AI_TOOL_CHOICE_INVALID",
    "The AI tool choice is invalid.",
  );
  return typeof choice === "object" ? { name: choice.name } : choice;
}

function parseTemperature(value = null) {
  invariant(
    value === null ||
      (typeof value === "number" &&
        Number.isFinite(value) &&
        value >= 0 &&
        value <= 2),
    "OF_AI_TEMPERATURE_INVALID",
    "AI temperature must be between zero and two.",
  );
  return value;
}

function parseMetadata(value = {}) {
  invariant(
    value && typeof value === "object" && !Array.isArray(value),
    "OF_AI_METADATA_INVALID",
    "AI request metadata must be an object.",
  );
  const entries = Object.entries(value);
  invariant(
    entries.length <= 20 &&
      entries.every(
        ([key, entry]) =>
          /^[a-zA-Z0-9_.-]{1,64}$/u.test(key) &&
          typeof entry === "string" &&
          entry.length <= 500,
      ),
    "OF_AI_METADATA_INVALID",
    "AI request metadata exceeds safe limits.",
  );
  return Object.fromEntries(entries);
}

function cloneJSONObject(value, field) {
  invariant(
    value && typeof value === "object" && !Array.isArray(value),
    "OF_AI_JSON_INVALID",
    `The AI ${field} must be a JSON object.`,
  );
  try {
    const serialized = JSON.stringify(value);
    invariant(
      serialized !== undefined,
      "OF_AI_JSON_INVALID",
      `The AI ${field} must be JSON serializable.`,
    );
    const cloned = JSON.parse(serialized);
    invariant(
      cloned && typeof cloned === "object" && !Array.isArray(cloned),
      "OF_AI_JSON_INVALID",
      `The AI ${field} must be a JSON object.`,
    );
    return cloned;
  } catch (error) {
    if (error?.code === "OF_AI_JSON_INVALID") throw error;
    invariant(
      false,
      "OF_AI_JSON_INVALID",
      `The AI ${field} must be JSON serializable.`,
    );
  }
}
