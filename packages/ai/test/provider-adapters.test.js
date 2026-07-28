import { describe, expect, it, vi } from "vitest";

import {
  collectAIStream,
  createAnthropicAdapter,
  createGeminiAdapter,
  createOpenAIAdapter,
  parseAIRequest,
  parseModelCapabilities,
} from "../src/index.js";

function capabilities(provider, model, { image = false } = {}) {
  return {
    provider,
    model,
    inputModalities: image ? ["text", "image"] : ["text"],
    outputModalities: ["text", "json", "tool"],
    streaming: true,
    tools: { supported: true, parallel: true },
    structuredOutput: { supported: true, strict: true },
    limits: { inputTokens: 100_000, outputTokens: 8_000 },
  };
}

function request(provider, model, overrides = {}) {
  return parseAIRequest(
    {
      messages: [
        {
          role: "system",
          content: [{ type: "text", text: "Return safe source changes." }],
        },
        {
          role: "user",
          content: [{ type: "text", text: "Create a hero." }],
        },
      ],
      tools: [
        {
          name: "inspect",
          description: "Inspect a project file.",
          inputSchema: {
            type: "object",
            properties: { path: { type: "string" } },
            required: ["path"],
            additionalProperties: false,
          },
        },
      ],
      responseSchema: {
        type: "object",
        properties: { accepted: { type: "boolean" } },
        required: ["accepted"],
        additionalProperties: false,
      },
      maxOutputTokens: 1_000,
      metadata: { project: "project_1" },
      ...overrides,
    },
    parseModelCapabilities(capabilities(provider, model, { image: true })),
  );
}

async function* events(items) {
  yield* items;
}

describe("OpenAI Responses adapter", () => {
  it("maps current Responses streaming events into the shared contract", async () => {
    const create = vi.fn(async () =>
      events([
        { type: "response.created", response: { id: "resp_1" } },
        { type: "response.output_text.delta", delta: '{"accepted":true}' },
        {
          type: "response.function_call_arguments.done",
          item_id: "call_1",
          name: "inspect",
          arguments: '{"path":"app/page.js"}',
        },
        {
          type: "response.completed",
          response: {
            status: "completed",
            usage: {
              input_tokens: 20,
              output_tokens: 7,
              input_tokens_details: { cached_tokens: 4 },
              output_tokens_details: { reasoning_tokens: 2 },
            },
          },
        },
      ]),
    );
    const adapter = createOpenAIAdapter({
      client: {
        responses: { create },
        models: {
          list: vi.fn(async () => ({
            data: [{ id: "z-model" }, { id: "a-model" }],
          })),
        },
      },
      models: [capabilities("openai", "openai-model")],
    });

    const result = await collectAIStream(
      adapter.stream({
        model: "openai-model",
        request: request("openai", "openai-model"),
      }),
    );

    expect(result).toMatchObject({
      responseId: "resp_1",
      text: '{"accepted":true}',
      structuredOutput: { accepted: true },
      finishReason: "tool",
      usage: {
        inputTokens: 20,
        outputTokens: 7,
        cachedInputTokens: 4,
        reasoningTokens: 2,
      },
    });
    expect(result.toolCalls[0]).toMatchObject({
      id: "call_1",
      name: "inspect",
      arguments: { path: "app/page.js" },
    });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "openai-model",
        stream: true,
        store: false,
        tools: [
          expect.objectContaining({
            type: "function",
            name: "inspect",
            strict: true,
          }),
        ],
        text: {
          format: expect.objectContaining({
            type: "json_schema",
            strict: true,
          }),
        },
      }),
      { signal: undefined },
    );
    await expect(adapter.discoverModels()).resolves.toEqual([
      "a-model",
      "z-model",
    ]);
  });
});

describe("Anthropic Messages adapter", () => {
  it("maps content blocks, partial tool JSON, usage, and stop reasons", async () => {
    const create = vi.fn(async () =>
      events([
        {
          type: "message_start",
          message: {
            id: "msg_1",
            usage: {
              input_tokens: 30,
              cache_read_input_tokens: 5,
            },
          },
        },
        {
          type: "content_block_start",
          index: 0,
          content_block: {
            type: "tool_use",
            id: "toolu_1",
            name: "inspect",
            input: {},
          },
        },
        {
          type: "content_block_delta",
          index: 0,
          delta: {
            type: "input_json_delta",
            partial_json: '{"path":"app/page.js"}',
          },
        },
        { type: "content_block_stop", index: 0 },
        {
          type: "content_block_delta",
          index: 1,
          delta: { type: "text_delta", text: '{"accepted":true}' },
        },
        {
          type: "message_delta",
          delta: { stop_reason: "tool_use" },
          usage: { output_tokens: 9 },
        },
        { type: "message_stop" },
      ]),
    );
    const adapter = createAnthropicAdapter({
      client: {
        messages: { create },
        models: { list: vi.fn(async () => ({ data: [] })) },
      },
      models: [capabilities("anthropic", "claude-model")],
    });

    const result = await collectAIStream(
      adapter.stream({
        model: "claude-model",
        request: request("anthropic", "claude-model"),
      }),
    );

    expect(result).toMatchObject({
      responseId: "msg_1",
      structuredOutput: { accepted: true },
      finishReason: "tool",
      usage: {
        inputTokens: 30,
        outputTokens: 9,
        cachedInputTokens: 5,
      },
    });
    expect(result.toolCalls[0].arguments).toEqual({ path: "app/page.js" });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "claude-model",
        stream: true,
        system: "Return safe source changes.",
        tools: [
          expect.objectContaining({
            name: "inspect",
            strict: true,
          }),
        ],
        output_config: {
          format: expect.objectContaining({ type: "json_schema" }),
        },
      }),
      { signal: undefined },
    );
  });
});

describe("Gemini Interactions adapter", () => {
  it("maps interaction steps, image assets, tools, and current usage fields", async () => {
    const create = vi.fn(async () =>
      events([
        {
          event_type: "interaction.created",
          interaction: { id: "interaction_1" },
        },
        {
          event_type: "step.start",
          index: 0,
          step: {
            type: "function_call",
            id: "function_1",
            name: "inspect",
            arguments: {},
          },
        },
        {
          event_type: "step.delta",
          index: 0,
          delta: {
            type: "arguments_delta",
            arguments: '{"path":"app/page.js"}',
          },
        },
        { event_type: "step.stop", index: 0 },
        {
          event_type: "step.delta",
          index: 1,
          delta: { type: "text", text: '{"accepted":true}' },
        },
        {
          event_type: "interaction.completed",
          interaction: {
            status: "completed",
            usage: {
              total_input_tokens: 40,
              total_output_tokens: 10,
              total_cached_tokens: 6,
              total_thought_tokens: 3,
            },
          },
        },
      ]),
    );
    const adapter = createGeminiAdapter({
      client: {
        interactions: { create },
        models: {
          list: vi.fn(async () => ({
            models: [{ name: "models/gemini-model" }],
          })),
        },
      },
      models: [capabilities("gemini", "gemini-model", { image: true })],
      resolveAsset: vi.fn(async () => ({
        data: "aW1hZ2U=",
        mimeType: "image/png",
      })),
    });
    const geminiRequest = request("gemini", "gemini-model", {
      messages: [
        {
          role: "system",
          content: [{ type: "text", text: "Return safe source changes." }],
        },
        {
          role: "user",
          content: [
            {
              type: "image",
              assetRef: "asset_12345678",
              mimeType: "image/png",
            },
          ],
        },
      ],
    });

    const result = await collectAIStream(
      adapter.stream({ model: "gemini-model", request: geminiRequest }),
    );

    expect(result).toMatchObject({
      responseId: "interaction_1",
      structuredOutput: { accepted: true },
      finishReason: "tool",
      usage: {
        inputTokens: 40,
        outputTokens: 10,
        cachedInputTokens: 6,
        reasoningTokens: 3,
      },
    });
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gemini-model",
        stream: true,
        store: false,
        input: [
          {
            type: "user_input",
            content: [
              {
                type: "image",
                mime_type: "image/png",
                data: "aW1hZ2U=",
              },
            ],
          },
        ],
        tools: [
          expect.objectContaining({
            type: "function",
            name: "inspect",
          }),
        ],
        response_format: {
          text: expect.objectContaining({ mime_type: "application/json" }),
        },
      }),
      { signal: undefined },
    );
  });
});

describe("provider adapter failures", () => {
  it("normalizes retryable SDK errors without leaking provider messages", async () => {
    const adapter = createOpenAIAdapter({
      client: {
        responses: {
          create: vi.fn(async () => {
            const error = new Error("upstream secret error body");
            error.status = 429;
            throw error;
          }),
        },
        models: { list: vi.fn() },
      },
      models: [capabilities("openai", "openai-model")],
    });

    await expect(
      collectAIStream(
        adapter.stream({
          model: "openai-model",
          request: request("openai", "openai-model"),
        }),
      ),
    ).rejects.toMatchObject({
      message: "The AI provider request failed.",
      category: "rate-limit",
      retryable: true,
      status: 429,
      provider: "openai",
      model: "openai-model",
    });
  });
});
