import Anthropic from "@anthropic-ai/sdk";

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

export function createAnthropicAdapter({
  apiKey,
  client = apiKey ? new Anthropic({ apiKey }) : null,
  models,
  resolveAsset,
} = {}) {
  invariant(
    client?.messages?.create && client?.models?.list,
    "OF_AI_ANTHROPIC_CLIENT_INVALID",
    "A valid Anthropic client is required.",
  );
  const capabilities = normalizeAdapterCapabilities("anthropic", models);

  return {
    capabilities,
    discoverModels: () =>
      listProviderModelIds(() => client.models.list({ limit: 100 })),
    async *stream({ model, request, signal }) {
      try {
        const mapped = await mapAnthropicMessages(
          request.messages,
          resolveAsset,
        );
        const params = {
          model,
          stream: true,
          max_tokens: request.maxOutputTokens,
          messages: mapped.messages,
          ...(mapped.system ? { system: mapped.system } : {}),
          ...(request.temperature === null
            ? {}
            : { temperature: request.temperature }),
          ...(request.tools.length === 0
            ? {}
            : {
                tools: request.tools.map((tool) => ({
                  name: tool.name,
                  description: tool.description,
                  input_schema: tool.inputSchema,
                  strict: true,
                })),
                tool_choice: mapAnthropicToolChoice(request.toolChoice),
              }),
          ...(request.responseSchema
            ? {
                output_config: {
                  format: {
                    type: "json_schema",
                    schema: request.responseSchema,
                  },
                },
              }
            : {}),
        };
        const stream = await client.messages.create(params, { signal });
        const toolCalls = new Map();
        let text = "";
        let inputUsage = {};
        let finished = false;
        for await (const event of stream) {
          if (event.type === "message_start") {
            inputUsage = event.message.usage ?? {};
            yield { type: "start", responseId: event.message.id };
          } else if (
            event.type === "content_block_start" &&
            event.content_block.type === "tool_use"
          ) {
            toolCalls.set(event.index, {
              id: event.content_block.id,
              name: event.content_block.name,
              json: Object.keys(event.content_block.input ?? {}).length
                ? JSON.stringify(event.content_block.input)
                : "",
            });
          } else if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            text += event.delta.text;
            yield { type: "text-delta", delta: event.delta.text };
          } else if (
            event.type === "content_block_delta" &&
            event.delta.type === "input_json_delta"
          ) {
            const call = toolCalls.get(event.index);
            if (call) call.json += event.delta.partial_json;
          } else if (event.type === "content_block_stop") {
            const call = toolCalls.get(event.index);
            if (call) {
              yield {
                type: "tool-call",
                id: call.id,
                name: call.name,
                arguments: parseJSON(
                  call.json || "{}",
                  "anthropic",
                  model,
                  "tool arguments",
                ),
              };
            }
          } else if (event.type === "message_delta") {
            if (request.responseSchema) {
              yield {
                type: "structured-output",
                value: parseJSON(text, "anthropic", model, "structured output"),
              };
            }
            yield usageEvent({
              inputTokens: inputUsage.input_tokens,
              outputTokens: event.usage?.output_tokens,
              cachedInputTokens:
                inputUsage.cache_read_input_tokens ??
                inputUsage.cached_input_tokens,
              reasoningTokens:
                event.usage?.output_tokens_details?.reasoning_tokens,
            });
            yield {
              type: "finish",
              reason: finishReason(event.delta.stop_reason, toolCalls.size),
            };
            finished = true;
          }
        }
        invariant(
          finished,
          "OF_AI_ANTHROPIC_STREAM_INCOMPLETE",
          "The Anthropic stream ended without a message delta.",
        );
      } catch (error) {
        throw providerError("anthropic", model, error);
      }
    },
  };
}

async function mapAnthropicMessages(messages, resolveAsset) {
  const system = [];
  const mapped = [];
  for (const message of messages) {
    if (message.role === "system") {
      system.push(...message.content.map((part) => part.text));
      continue;
    }
    if (message.role === "tool") {
      mapped.push({
        role: "user",
        content: [
          {
            type: "tool_result",
            tool_use_id: message.toolCallId,
            content: message.content.map((part) => part.text).join("\n"),
          },
        ],
      });
      continue;
    }
    const content = [];
    for (const part of message.content) {
      if (part.type === "text") {
        content.push({ type: "text", text: part.text });
      } else {
        const asset = await resolveImage(part, resolveAsset);
        content.push({
          type: "image",
          source: {
            type: "base64",
            media_type: asset.mimeType,
            data: asset.data,
          },
        });
      }
    }
    mapped.push({ role: message.role, content });
  }
  return { system: system.join("\n\n"), messages: mapped };
}

function mapAnthropicToolChoice(choice) {
  if (choice === "required") return { type: "any" };
  if (typeof choice === "object") return { type: "tool", name: choice.name };
  return { type: choice };
}
