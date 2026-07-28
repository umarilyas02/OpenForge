import { GoogleGenAI } from "@google/genai";

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

export function createGeminiAdapter({
  apiKey,
  client = apiKey ? new GoogleGenAI({ apiKey }) : null,
  models,
  resolveAsset,
} = {}) {
  invariant(
    client?.interactions?.create && client?.models?.list,
    "OF_AI_GEMINI_CLIENT_INVALID",
    "A valid Gemini client is required.",
  );
  const capabilities = normalizeAdapterCapabilities("gemini", models);

  return {
    capabilities,
    discoverModels: () =>
      listProviderModelIds(() =>
        client.models.list({ config: { pageSize: 100 } }),
      ),
    async *stream({ model, request, signal }) {
      try {
        const mapped = await mapGeminiInput(request.messages, resolveAsset);
        const params = {
          model,
          stream: true,
          store: false,
          input: mapped.input,
          ...(mapped.systemInstruction
            ? { system_instruction: mapped.systemInstruction }
            : {}),
          labels: request.metadata,
          generation_config: {
            max_output_tokens: request.maxOutputTokens,
            ...(request.temperature === null
              ? {}
              : { temperature: request.temperature }),
            ...(request.tools.length === 0
              ? {}
              : { tool_choice: mapGeminiToolChoice(request.toolChoice) }),
          },
          ...(request.tools.length === 0
            ? {}
            : {
                tools: request.tools.map((tool) => ({
                  type: "function",
                  name: tool.name,
                  description: tool.description,
                  parameters: tool.inputSchema,
                })),
              }),
          ...(request.responseSchema
            ? {
                response_format: {
                  text: {
                    mime_type: "application/json",
                    schema: request.responseSchema,
                  },
                },
              }
            : {}),
        };
        const stream = await client.interactions.create(params, { signal });
        const toolCalls = new Map();
        let text = "";
        for await (const event of stream) {
          if (event.event_type === "interaction.created") {
            yield { type: "start", responseId: event.interaction.id };
          } else if (
            event.event_type === "step.start" &&
            event.step.type === "function_call"
          ) {
            toolCalls.set(event.index, {
              id: event.step.id,
              name: event.step.name,
              json:
                event.step.arguments &&
                Object.keys(event.step.arguments).length > 0
                  ? JSON.stringify(event.step.arguments)
                  : "",
            });
          } else if (
            event.event_type === "step.delta" &&
            event.delta.type === "text"
          ) {
            text += event.delta.text;
            yield { type: "text-delta", delta: event.delta.text };
          } else if (
            event.event_type === "step.delta" &&
            event.delta.type === "arguments_delta"
          ) {
            const call = toolCalls.get(event.index);
            if (call) call.json += event.delta.arguments ?? "";
          } else if (event.event_type === "step.stop") {
            const call = toolCalls.get(event.index);
            if (call) {
              yield {
                type: "tool-call",
                id: call.id,
                name: call.name,
                arguments: parseJSON(
                  call.json || "{}",
                  "gemini",
                  model,
                  "tool arguments",
                ),
              };
            }
          } else if (event.event_type === "interaction.completed") {
            if (request.responseSchema) {
              yield {
                type: "structured-output",
                value: parseJSON(text, "gemini", model, "structured output"),
              };
            }
            const usage =
              event.interaction.usage ?? event.metadata?.total_usage;
            yield usageEvent({
              inputTokens: usage?.total_input_tokens,
              outputTokens: usage?.total_output_tokens,
              cachedInputTokens: usage?.total_cached_tokens,
              reasoningTokens: usage?.total_thought_tokens,
            });
            yield {
              type: "finish",
              reason: finishReason(event.interaction.status, toolCalls.size),
            };
          } else if (
            event.event_type === "error" ||
            (event.event_type === "interaction.status_update" &&
              ["failed", "cancelled", "incomplete", "budget_exceeded"].includes(
                event.status,
              ))
          ) {
            throw new Error("Gemini interaction stream failed.");
          }
        }
      } catch (error) {
        throw providerError("gemini", model, error);
      }
    },
  };
}

async function mapGeminiInput(messages, resolveAsset) {
  const system = [];
  const input = [];
  for (const message of messages) {
    if (message.role === "system") {
      system.push(...message.content.map((part) => part.text));
      continue;
    }
    if (message.role === "tool") {
      input.push({
        type: "function_result",
        call_id: message.toolCallId,
        result: message.content.map((part) => part.text).join("\n"),
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
          mime_type: asset.mimeType,
          data: asset.data,
        });
      }
    }
    input.push({
      type: message.role === "assistant" ? "model_output" : "user_input",
      content,
    });
  }
  return { systemInstruction: system.join("\n\n"), input };
}

function mapGeminiToolChoice(choice) {
  if (choice === "required") return "any";
  if (typeof choice === "object") {
    return {
      allowed_tools: {
        mode: "any",
        tools: [choice.name],
      },
    };
  }
  return choice;
}
