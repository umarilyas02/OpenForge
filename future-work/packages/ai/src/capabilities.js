import { invariant } from "./errors.js";

const IDENTIFIER = /^[a-z0-9][a-z0-9._-]{1,100}$/u;
const INPUT_MODALITIES = new Set(["text", "image"]);
const OUTPUT_MODALITIES = new Set(["text", "json", "tool"]);

export function parseModelCapabilities(input) {
  invariant(
    input && typeof input === "object" && !Array.isArray(input),
    "OF_AI_CAPABILITIES_INVALID",
    "Model capabilities must be an object.",
  );
  const provider = parseIdentifier(input.provider, "provider");
  const model = parseIdentifier(input.model, "model");
  const inputModalities = parseModalities(
    input.inputModalities,
    INPUT_MODALITIES,
    "input",
  );
  const outputModalities = parseModalities(
    input.outputModalities,
    OUTPUT_MODALITIES,
    "output",
  );
  const limits = {
    inputTokens: parsePositiveInteger(
      input.limits?.inputTokens,
      "input token limit",
    ),
    outputTokens: parsePositiveInteger(
      input.limits?.outputTokens,
      "output token limit",
    ),
  };
  const capabilities = {
    schemaVersion: 1,
    provider,
    model,
    inputModalities,
    outputModalities,
    streaming: Boolean(input.streaming),
    tools: {
      supported: Boolean(input.tools?.supported),
      parallel: Boolean(input.tools?.parallel),
    },
    structuredOutput: {
      supported: Boolean(input.structuredOutput?.supported),
      strict: Boolean(input.structuredOutput?.strict),
    },
    limits,
  };
  invariant(
    !capabilities.tools.parallel || capabilities.tools.supported,
    "OF_AI_CAPABILITIES_CONTRADICTORY",
    "Parallel tools require tool support.",
  );
  invariant(
    !capabilities.structuredOutput.strict ||
      capabilities.structuredOutput.supported,
    "OF_AI_CAPABILITIES_CONTRADICTORY",
    "Strict structured output requires structured-output support.",
  );
  invariant(
    !capabilities.tools.supported || outputModalities.includes("tool"),
    "OF_AI_CAPABILITIES_CONTRADICTORY",
    "Tool support requires the tool output modality.",
  );
  invariant(
    !capabilities.structuredOutput.supported ||
      outputModalities.includes("json"),
    "OF_AI_CAPABILITIES_CONTRADICTORY",
    "Structured output requires the JSON output modality.",
  );
  return deepFreeze(capabilities);
}

export function capabilityKey({ provider, model }) {
  return `${parseIdentifier(provider, "provider")}:${parseIdentifier(model, "model")}`;
}

function parseIdentifier(value, field) {
  invariant(
    typeof value === "string" && IDENTIFIER.test(value),
    "OF_AI_IDENTIFIER_INVALID",
    `The AI ${field} identifier is invalid.`,
    { field },
  );
  return value;
}

function parseModalities(value, allowed, field) {
  invariant(
    Array.isArray(value) &&
      value.length > 0 &&
      new Set(value).size === value.length &&
      value.every((entry) => allowed.has(entry)),
    "OF_AI_MODALITIES_INVALID",
    `The AI ${field} modalities are invalid.`,
    { field },
  );
  return Object.freeze([...value]);
}

function parsePositiveInteger(value, field) {
  invariant(
    Number.isSafeInteger(value) && value > 0,
    "OF_AI_LIMIT_INVALID",
    `The ${field} is invalid.`,
  );
  return value;
}

function deepFreeze(value) {
  Object.freeze(value);
  for (const entry of Object.values(value)) {
    if (entry && typeof entry === "object" && !Object.isFrozen(entry)) {
      deepFreeze(entry);
    }
  }
  return value;
}
