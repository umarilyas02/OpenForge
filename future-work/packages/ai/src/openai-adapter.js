import OpenAI from "openai";

import { invariant } from "./errors.js";
import {
  finishReason,
  listProviderModelIds,
  normalizeAdapterCapabilities,
  parseJSON,
  providerError,
  resolveImage,
  usageEvent,
} from "./provider-adapter-utils.js";

export function createOpenAIAdapter({
  apiKey,
  client = apiKey ? new OpenAI({ apiKey }) : null,
  models,
  resolveAsset,
} = {}) {
  invariant(
    client?.responses?.create && client?.models?.list,
    "OF_AI_OPENAI_CLIENT_INVALID",
    "A valid OpenAI client is required.",
  );
  const capabilities = normalizeAdapterCapabilities("openai", models);

  return {
    capabilities,
    discoverModels: () =>
      listProviderModelIds(() => client.models.list({ limit: 100 })),
    async *stream({ model, request, signal }) {
      try {
        const input = await mapOpenAIInput(request.messages, resolveAsset);
        const params = {
          model,
          input,
          stream: true,
          store: false,
          max_output_tokens: request.maxOutputTokens,
          metadata: request.metadata,
          ...(request.temperature === null
            ? {}
            : { temperature: request.temperature }),
          ...(request.tools.length === 0
            ? {}
            : {
                tools: request.tools.map((tool) => ({
                  type: "function",
                  name: tool.name,
                  description: tool.description,
                  parameters: tool.inputSchema,
                  strict: true,
                })),
                tool_choice: mapOpenAIToolChoice(request.toolChoice),
                parallel_tool_calls:
                  capabilities.find((entry) => entry.model === model)?.tools
                    .parallel ?? false,
              }),
          ...(request.responseSchema
            ? {
                text: {
                  format: {
                    type: "json_schema",
                    name: "openforge_response",
                    schema: request.responseSchema,
                    strict: true,
                  },
                },
              }
            : {}),
        };
        const stream = await client.responses.create(params, { signal });
        let text = "";
        let toolCalls = 0;
        for await (const event of stream) {
          if (event.type === "response.created") {
            yield { type: "start", responseId: event.response.id };
          } else if (event.type === "response.output_text.delta") {
            text += event.delta;
            yield { type: "text-delta", delta: event.delta };
          } else if (event.type === "response.function_call_arguments.done") {
            toolCalls += 1;
            yield {
              type: "tool-call",
              id: event.item_id,
              name: event.name,
              arguments: parseJSON(
                event.arguments,
                "openai",
                model,
                "tool arguments",
              ),
            };
          } else if (event.type === "response.completed") {
            if (request.responseSchema) {
              yield {
                type: "structured-output",
                value: parseJSON(text, "openai", model, "structured output"),
              };
            }
            yield usageEvent({
              inputTokens: event.response.usage?.input_tokens,
              outputTokens: event.response.usage?.output_tokens,
              cachedInputTokens:
                event.response.usage?.input_tokens_details?.cached_tokens,
              reasoningTokens:
                event.response.usage?.output_tokens_details?.reasoning_tokens,
            });
            yield {
              type: "finish",
              reason: finishReason(event.response.status, toolCalls),
            };
          } else if (
            event.type === "error" ||
            event.type === "response.failed" ||
            event.type === "response.incomplete"
          ) {
            const error = new Error("OpenAI stream failed.");
            error.status = event.response?.error?.status ?? event.error?.status;
            throw error;
          }
        }
      } catch (error) {
        throw providerError("openai", model, error);
      }
    },
  };
}

async function mapOpenAIInput(messages, resolveAsset) {
  const input = [];
  for (const message of messages) {
    if (message.role === "tool") {
      input.push({
        type: "function_call_output",
        call_id: message.toolCallId,
        output: message.content.map((part) => part.text).join("\n"),
      });
      continue;
    }
    const content = [];
    for (const part of message.content) {
      if (part.type === "text") {
        content.push({
          type: message.role === "assistant" ? "output_text" : "input_text",
          text: part.text,
        });
      } else {
        const asset = await resolveImage(part, resolveAsset);
        content.push({
          type: "input_image",
          image_url: `data:${asset.mimeType};base64,${asset.data}`,
          detail: "auto",
        });
      }
    }
    input.push({ role: message.role, content });
  }
  return input;
}

function mapOpenAIToolChoice(choice) {
  if (typeof choice === "object") {
    return { type: "function", name: choice.name };
  }
  return choice;
}
