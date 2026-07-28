import { describe, expect, it } from "vitest";

import {
  AIContractError,
  AIProviderError,
  collectAIStream,
  createAIProviderRegistry,
  createFakeAIProvider,
  parseAIEvent,
  parseAIRequest,
  parseModelCapabilities,
} from "../src/index.js";

const textCapabilities = {
  provider: "fake",
  model: "text-model",
  inputModalities: ["text"],
  outputModalities: ["text", "json", "tool"],
  streaming: true,
  tools: { supported: true, parallel: false },
  structuredOutput: { supported: true, strict: true },
  limits: { inputTokens: 16_000, outputTokens: 4_000 },
};

const backupCapabilities = {
  ...textCapabilities,
  provider: "backup",
  model: "backup-model",
};

const request = {
  messages: [
    {
      role: "user",
      content: [{ type: "text", text: "Create a navigation." }],
    },
  ],
  maxOutputTokens: 1_000,
  metadata: { project: "project_1" },
};

describe("model capabilities", () => {
  it("normalizes and deeply freezes a valid declaration", () => {
    const parsed = parseModelCapabilities(textCapabilities);

    expect(parsed).toMatchObject({
      schemaVersion: 1,
      provider: "fake",
      model: "text-model",
    });
    expect(Object.isFrozen(parsed)).toBe(true);
    expect(Object.isFrozen(parsed.tools)).toBe(true);
  });

  it("rejects contradictory capability declarations", () => {
    expect(() =>
      parseModelCapabilities({
        ...textCapabilities,
        outputModalities: ["text"],
      }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_AI_CAPABILITIES_CONTRADICTORY" }),
    );
  });
});

describe("normalized requests", () => {
  it("accepts managed image references only when declared", () => {
    const multimodal = parseModelCapabilities({
      ...textCapabilities,
      inputModalities: ["text", "image"],
    });
    const parsed = parseAIRequest(
      {
        messages: [
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
      },
      multimodal,
    );

    expect(parsed.messages[0].content[0]).toEqual({
      type: "image",
      assetRef: "asset_12345678",
      mimeType: "image/png",
    });
    expect(() =>
      parseAIRequest(
        {
          messages: [
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
        },
        parseModelCapabilities(textCapabilities),
      ),
    ).toThrowError(
      expect.objectContaining({ code: "OF_AI_IMAGE_UNSUPPORTED" }),
    );
  });

  it("enforces capability and output-limit boundaries", () => {
    const withoutTools = parseModelCapabilities({
      ...textCapabilities,
      outputModalities: ["text"],
      tools: { supported: false, parallel: false },
      structuredOutput: { supported: false, strict: false },
    });

    expect(() =>
      parseAIRequest(
        {
          ...request,
          tools: [
            {
              name: "search",
              description: "Search files.",
              inputSchema: { type: "object" },
            },
          ],
        },
        withoutTools,
      ),
    ).toThrowError(
      expect.objectContaining({ code: "OF_AI_TOOLS_UNSUPPORTED" }),
    );
    expect(() =>
      parseAIRequest({ ...request, maxOutputTokens: 4_001 }, withoutTools),
    ).toThrowError(
      expect.objectContaining({ code: "OF_AI_OUTPUT_LIMIT_INVALID" }),
    );
  });
});

describe("normalized events", () => {
  it("collects text, tools, structured output, usage, and finish state", async () => {
    async function* stream() {
      yield { type: "start", responseId: "response_1" };
      yield { type: "text-delta", delta: "Hello " };
      yield { type: "text-delta", delta: "OpenForge" };
      yield {
        type: "tool-call",
        id: "call_1",
        name: "inspect",
        arguments: { path: "app/page.tsx" },
      };
      yield { type: "structured-output", value: { valid: true } };
      yield {
        type: "usage",
        usage: {
          inputTokens: 10,
          outputTokens: 4,
          cachedInputTokens: 2,
          reasoningTokens: 1,
        },
      };
      yield { type: "finish", reason: "stop" };
    }

    await expect(collectAIStream(stream())).resolves.toEqual({
      responseId: "response_1",
      text: "Hello OpenForge",
      toolCalls: [
        {
          type: "tool-call",
          id: "call_1",
          name: "inspect",
          arguments: { path: "app/page.tsx" },
        },
      ],
      structuredOutput: { valid: true },
      usage: {
        inputTokens: 10,
        outputTokens: 4,
        cachedInputTokens: 2,
        reasoningTokens: 1,
        totalTokens: 14,
      },
      finishReason: "stop",
    });
  });

  it("rejects malformed JSON values and incomplete sequences", async () => {
    expect(() =>
      parseAIEvent({
        type: "tool-call",
        id: "call_1",
        name: "inspect",
        arguments: [],
      }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_AI_TOOL_EVENT_INVALID" }),
    );

    async function* incomplete() {
      yield { type: "start", responseId: "response_1" };
    }
    await expect(collectAIStream(incomplete())).rejects.toMatchObject({
      code: "OF_AI_STREAM_INCOMPLETE",
    });
  });
});

describe("provider registry", () => {
  it("uses exact selection and records a normalized deterministic call", async () => {
    const provider = createFakeAIProvider({
      capabilities: [textCapabilities],
      scripts: [
        [
          { type: "start", responseId: "response_1" },
          { type: "text-delta", delta: "done" },
          { type: "finish", reason: "stop" },
        ],
      ],
    });
    const registry = createAIProviderRegistry();
    registry.register(provider);

    const result = await collectAIStream(
      registry.stream({
        selection: { provider: "fake", model: "text-model" },
        request,
      }),
    );

    expect(result.text).toBe("done");
    expect(provider.calls).toHaveLength(1);
    expect(provider.calls[0].request).toMatchObject({
      schemaVersion: 1,
      maxOutputTokens: 1_000,
    });
  });

  it("falls back only when explicitly enabled before output", async () => {
    const primary = createFakeAIProvider({
      capabilities: [textCapabilities],
      scripts: [
        [
          {
            type: "throw",
            error: {
              code: "RATE_LIMITED",
              message: "Rate limited.",
              retryable: true,
            },
          },
        ],
      ],
    });
    const backup = createFakeAIProvider({
      capabilities: [backupCapabilities],
      scripts: [
        [
          { type: "start", responseId: "response_backup" },
          { type: "text-delta", delta: "backup" },
          { type: "finish", reason: "stop" },
        ],
      ],
    });
    const registry = createAIProviderRegistry();
    registry.register(primary);
    registry.register(backup);

    const result = await collectAIStream(
      registry.stream({
        selection: { provider: "fake", model: "text-model" },
        fallback: {
          enabled: true,
          candidates: [{ provider: "backup", model: "backup-model" }],
        },
        request,
      }),
    );

    expect(result.text).toBe("backup");
    expect(primary.calls).toHaveLength(1);
    expect(backup.calls).toHaveLength(1);
  });

  it("does not fall back after any provider event is emitted", async () => {
    const primary = createFakeAIProvider({
      capabilities: [textCapabilities],
      scripts: [
        [
          { type: "start", responseId: "response_1" },
          {
            type: "throw",
            error: {
              code: "CONNECTION_LOST",
              message: "Connection lost.",
              retryable: true,
            },
          },
        ],
      ],
    });
    const backup = createFakeAIProvider({
      capabilities: [backupCapabilities],
      scripts: [[]],
    });
    const registry = createAIProviderRegistry();
    registry.register(primary);
    registry.register(backup);

    await expect(
      collectAIStream(
        registry.stream({
          selection: { provider: "fake", model: "text-model" },
          fallback: {
            enabled: true,
            candidates: [{ provider: "backup", model: "backup-model" }],
          },
          request,
        }),
      ),
    ).rejects.toMatchObject({ code: "CONNECTION_LOST" });
    expect(backup.calls).toHaveLength(0);
  });

  it("registers multi-model adapters atomically", () => {
    const registry = createAIProviderRegistry();
    registry.register(
      createFakeAIProvider({
        capabilities: [textCapabilities],
      }),
    );

    expect(() =>
      registry.register(
        createFakeAIProvider({
          capabilities: [
            { ...textCapabilities, model: "new-model" },
            textCapabilities,
          ],
        }),
      ),
    ).toThrowError(expect.objectContaining({ code: "OF_AI_MODEL_DUPLICATE" }));
    expect(registry.list()).toHaveLength(1);
    expect(() =>
      registry.get({ provider: "fake", model: "new-model" }),
    ).toThrowError(expect.any(AIContractError));
  });

  it("normalizes unknown errors without leaking provider details", async () => {
    const registry = createAIProviderRegistry();
    registry.register({
      capabilities: [textCapabilities],
      async *stream() {
        yield* [];
        throw new Error("secret provider response");
      },
    });

    await expect(
      collectAIStream(
        registry.stream({
          selection: { provider: "fake", model: "text-model" },
          request,
        }),
      ),
    ).rejects.toEqual(
      expect.objectContaining({
        code: "OF_AI_PROVIDER_FAILED",
        message: "The AI provider request failed.",
        provider: "fake",
        model: "text-model",
      }),
    );
  });

  it("preserves normalized provider error semantics", () => {
    const error = new AIProviderError({
      code: "RATE_LIMITED",
      message: "Rate limited.",
      retryable: true,
    });

    expect(error).toMatchObject({
      category: "provider",
      retryable: true,
    });
  });
});
