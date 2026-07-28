import { describe, expect, it } from "vitest";

import {
  assertAIProviderAllowed,
  buildAIContext,
  collectAIStream,
  createAIProviderRegistry,
  createFakeAIProvider,
  createMemoryAIContextStore,
  parseAIAdminPolicy,
  redactAISecrets,
} from "../src/index.js";

const files = [
  {
    path: "app/page.js",
    content: 'export default function Page() { return "safe"; }\n',
  },
  {
    path: "app/private.js",
    content: 'const OPENAI_API_KEY = "sk-proj-abcdefghijklmnopqrstuvwxyz";\n',
  },
  { path: "notes/internal.txt", content: "Do not include.\n" },
  { path: ".env", content: "PASSWORD=never-include\n" },
];

describe("least-context assembly", () => {
  it("includes only explicit, non-ignored paths with a reviewable manifest", () => {
    const context = buildAIContext({
      files,
      requestedPaths: [
        "app/page.js",
        "notes/internal.txt",
        ".env",
        "missing.js",
      ],
      openforgeIgnore: "notes/\n",
    });

    expect(context.files).toEqual([
      {
        path: "app/page.js",
        content: files[0].content,
      },
    ]);
    expect(context.manifest).toMatchObject({
      retentionHours: 0,
      expiresAt: null,
      requestedPaths: [
        "app/page.js",
        "notes/internal.txt",
        ".env",
        "missing.js",
      ],
      included: [
        expect.objectContaining({
          path: "app/page.js",
          secretCount: 0,
        }),
      ],
      excluded: [
        { path: "notes/internal.txt", reason: "ignored" },
        { path: ".env", reason: "ignored" },
        { path: "missing.js", reason: "not-found" },
      ],
    });
    expect(context.manifest.included[0].sha256).toMatch(/^[a-f0-9]{64}$/u);
  });

  it("supports .openforgeignore negation with standard ignore semantics", () => {
    const context = buildAIContext({
      files,
      requestedPaths: ["notes/internal.txt"],
      openforgeIgnore: "notes/*\n!notes/internal.txt\n",
    });

    expect(context.files[0].path).toBe("notes/internal.txt");
  });

  it("rejects traversal and duplicate normalized requests", () => {
    expect(() =>
      buildAIContext({
        files,
        requestedPaths: ["../outside.js"],
      }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_AI_CONTEXT_PATH_INVALID" }),
    );
    expect(() =>
      buildAIContext({
        files,
        requestedPaths: ["app/page.js", "./app/page.js"],
      }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_AI_CONTEXT_DUPLICATE" }),
    );
  });

  it("enforces file and byte limits before provider access", () => {
    const policy = {
      context: {
        maxFiles: 1,
        maxBytes: 1_000,
        secretHandling: "redact",
      },
    };

    expect(() =>
      buildAIContext({
        files,
        requestedPaths: ["app/page.js", "app/private.js"],
        policy,
      }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_AI_CONTEXT_FILE_LIMIT" }),
    );
  });
});

describe("secret handling", () => {
  it("redacts detected values without recording them in findings", () => {
    const result = redactAISecrets(
      [
        'const OPENAI_API_KEY = "sk-proj-abcdefghijklmnopqrstuvwxyz";',
        "const token = 'ghp_abcdefghijklmnopqrstuvwxyz123456';",
      ].join("\n"),
    );

    expect(result.content).not.toContain("abcdefghijklmnopqrstuvwxyz");
    expect(result.content).toContain("[REDACTED]");
    expect(result.findings).toEqual([
      { line: 1, kind: "api-key" },
      { line: 1, kind: "secret-assignment" },
      { line: 2, kind: "github-token" },
    ]);
    expect(JSON.stringify(result.findings)).not.toContain("sk-proj");
  });

  it("can block an entire requested file when an admin requires it", () => {
    expect(() =>
      buildAIContext({
        files,
        requestedPaths: ["app/private.js"],
        policy: {
          context: {
            maxFiles: 10,
            maxBytes: 100_000,
            secretHandling: "block",
          },
        },
      }),
    ).toThrowError(expect.objectContaining({ code: "OF_AI_CONTEXT_EMPTY" }));
  });

  it("redacts multiline private keys and bearer tokens", () => {
    const result = redactAISecrets(
      [
        "-----BEGIN PRIVATE KEY-----",
        "sensitive-key-material",
        "-----END PRIVATE KEY-----",
        "Authorization: Bearer abcdefghijklmnopqrstuvwxyz",
      ].join("\n"),
    );

    expect(result.content).not.toContain("sensitive-key-material");
    expect(result.content).not.toContain("abcdefghijklmnopqrstuvwxyz");
    expect(result.findings).toEqual([
      { line: 1, kind: "private-key" },
      { line: 2, kind: "bearer-token" },
    ]);
  });
});

describe("retention and deletion", () => {
  it("persists only retained redacted context and deletes it on expiry", async () => {
    let now = new Date("2026-07-28T00:00:00.000Z");
    const context = buildAIContext({
      files,
      requestedPaths: ["app/private.js"],
      retentionHours: 1,
      clock: () => now,
    });
    const store = createMemoryAIContextStore({ clock: () => now });

    await store.put(context);
    await expect(store.get(context.manifest.id)).resolves.toMatchObject({
      files: [
        {
          path: "app/private.js",
          content: expect.not.stringContaining("sk-proj"),
        },
      ],
    });
    now = new Date("2026-07-28T02:00:00.000Z");
    await expect(store.deleteExpired()).resolves.toEqual({ deleted: 1 });
    await expect(store.get(context.manifest.id)).resolves.toBeNull();
  });

  it("refuses to persist zero-retention context", async () => {
    const store = createMemoryAIContextStore();
    const context = buildAIContext({
      files,
      requestedPaths: ["app/page.js"],
    });

    await expect(store.put(context)).rejects.toMatchObject({
      code: "OF_AI_CONTEXT_EPHEMERAL",
    });
  });

  it("enforces the administrator retention ceiling", () => {
    expect(() =>
      buildAIContext({
        files,
        requestedPaths: ["app/page.js"],
        retentionHours: 2,
        policy: { retention: { maximumHours: 1 } },
      }),
    ).toThrowError(expect.objectContaining({ code: "OF_AI_RETENTION_DENIED" }));
  });
});

describe("administrator provider policy", () => {
  const policy = {
    allowedProviders: {
      openai: {
        models: ["gpt-approved"],
        capabilities: ["text", "structured-output"],
      },
    },
  };

  it("allows only configured providers, models, and capabilities", () => {
    expect(
      assertAIProviderAllowed(
        {
          selection: { provider: "openai", model: "gpt-approved" },
          requiredCapabilities: ["text", "structured-output"],
        },
        policy,
      ),
    ).toBe(true);
    expect(() =>
      assertAIProviderAllowed(
        {
          selection: { provider: "anthropic", model: "claude-model" },
          requiredCapabilities: ["text"],
        },
        policy,
      ),
    ).toThrowError(expect.objectContaining({ code: "OF_AI_PROVIDER_DENIED" }));
    expect(() =>
      assertAIProviderAllowed(
        {
          selection: { provider: "openai", model: "gpt-approved" },
          requiredCapabilities: ["tools"],
        },
        policy,
      ),
    ).toThrowError(
      expect.objectContaining({ code: "OF_AI_CAPABILITY_DENIED" }),
    );
  });

  it("normalizes and freezes policy limits", () => {
    const parsed = parseAIAdminPolicy(policy);

    expect(parsed.context).toMatchObject({
      maxFiles: 50,
      maxBytes: 500_000,
      secretHandling: "redact",
    });
    expect(Object.isFrozen(parsed)).toBe(true);
  });

  it("enforces policy inside the provider registry before adapter access", async () => {
    const provider = createFakeAIProvider({
      capabilities: [
        {
          provider: "openai",
          model: "gpt-approved",
          inputModalities: ["text"],
          outputModalities: ["text", "tool"],
          streaming: true,
          tools: { supported: true, parallel: false },
          structuredOutput: { supported: false, strict: false },
          limits: { inputTokens: 10_000, outputTokens: 1_000 },
        },
      ],
      scripts: [[]],
    });
    const registry = createAIProviderRegistry({ policy });
    registry.register(provider);

    await expect(
      collectAIStream(
        registry.stream({
          selection: { provider: "openai", model: "gpt-approved" },
          request: {
            messages: [
              {
                role: "user",
                content: [{ type: "text", text: "Use a tool." }],
              },
            ],
            tools: [
              {
                name: "inspect",
                description: "Inspect source.",
                inputSchema: { type: "object" },
              },
            ],
          },
        }),
      ),
    ).rejects.toMatchObject({ code: "OF_AI_CAPABILITY_DENIED" });
    expect(provider.calls).toHaveLength(0);
  });
});
