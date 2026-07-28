import { createHash } from "node:crypto";
import path from "node:path";

import createIgnore from "ignore";

import { invariant } from "./errors.js";

const DEFAULT_IGNORES = [
  ".git/",
  "node_modules/",
  ".next/",
  ".turbo/",
  ".env",
  ".env.*",
  "*.pem",
  "*.key",
  "*.p12",
  "*.pfx",
];
const PROVIDER_CAPABILITIES = new Set([
  "text",
  "image",
  "tools",
  "structured-output",
]);
const PROVIDER_NAME = /^[a-z0-9][a-z0-9._-]{1,100}$/u;
const MODEL_NAME = /^[a-z0-9][a-z0-9._-]{1,100}$/u;

export function parseAIAdminPolicy(input = {}) {
  invariant(
    input && typeof input === "object" && !Array.isArray(input),
    "OF_AI_ADMIN_POLICY_INVALID",
    "The AI admin policy must be an object.",
  );
  const allowedProviders = Object.fromEntries(
    Object.entries(
      input.allowedProviders ?? {
        "*": {
          models: ["*"],
          capabilities: [...PROVIDER_CAPABILITIES],
        },
      },
    ).map(([provider, rule]) => {
      invariant(
        provider === "*" || PROVIDER_NAME.test(provider),
        "OF_AI_ADMIN_POLICY_INVALID",
        "An allowed AI provider name is invalid.",
      );
      invariant(
        rule && typeof rule === "object" && !Array.isArray(rule),
        "OF_AI_ADMIN_POLICY_INVALID",
        "An AI provider policy rule is invalid.",
      );
      const models = parseUniqueStrings(
        rule.models,
        (model) => model === "*" || MODEL_NAME.test(model),
      );
      const capabilities = parseUniqueStrings(rule.capabilities, (capability) =>
        PROVIDER_CAPABILITIES.has(capability),
      );
      return [
        provider,
        Object.freeze({
          models: Object.freeze(models),
          capabilities: Object.freeze(capabilities),
        }),
      ];
    }),
  );
  const policy = {
    schemaVersion: 1,
    allowedProviders: Object.freeze(allowedProviders),
    context: Object.freeze({
      maxFiles: boundedInteger(input.context?.maxFiles ?? 50, 1, 500),
      maxBytes: boundedInteger(
        input.context?.maxBytes ?? 500_000,
        1_000,
        10_000_000,
      ),
      secretHandling: parseSecretHandling(
        input.context?.secretHandling ?? "redact",
      ),
    }),
    retention: Object.freeze({
      maximumHours: boundedInteger(input.retention?.maximumHours ?? 24, 0, 720),
    }),
  };
  return deepFreeze(policy);
}

export function assertAIProviderAllowed(
  { selection, requiredCapabilities = [] },
  policy,
) {
  const parsedPolicy = parseAIAdminPolicy(policy);
  invariant(
    selection &&
      PROVIDER_NAME.test(selection.provider) &&
      MODEL_NAME.test(selection.model),
    "OF_AI_SELECTION_INVALID",
    "The AI provider selection is invalid.",
  );
  const rule =
    parsedPolicy.allowedProviders[selection.provider] ??
    parsedPolicy.allowedProviders["*"];
  invariant(
    rule,
    "OF_AI_PROVIDER_DENIED",
    "The AI provider is disabled by administrator policy.",
    { provider: selection.provider },
  );
  invariant(
    rule.models.includes("*") || rule.models.includes(selection.model),
    "OF_AI_MODEL_DENIED",
    "The AI model is disabled by administrator policy.",
    { provider: selection.provider, model: selection.model },
  );
  const requested = parseUniqueStrings(requiredCapabilities, (capability) =>
    PROVIDER_CAPABILITIES.has(capability),
  );
  invariant(
    requested.every((capability) => rule.capabilities.includes(capability)),
    "OF_AI_CAPABILITY_DENIED",
    "An AI capability is disabled by administrator policy.",
    {
      denied: requested.filter(
        (capability) => !rule.capabilities.includes(capability),
      ),
    },
  );
  return true;
}

export function buildAIContext({
  files,
  requestedPaths,
  openforgeIgnore = "",
  policy,
  retentionHours = 0,
  clock = () => new Date(),
}) {
  const parsedPolicy = parseAIAdminPolicy(policy);
  invariant(
    Array.isArray(files) && Array.isArray(requestedPaths),
    "OF_AI_CONTEXT_INVALID",
    "AI context files and requested paths must be arrays.",
  );
  invariant(
    requestedPaths.length > 0,
    "OF_AI_CONTEXT_EMPTY",
    "AI context requires at least one explicitly requested file.",
  );
  invariant(
    typeof openforgeIgnore === "string" &&
      Buffer.byteLength(openforgeIgnore, "utf8") <= 1_000_000,
    "OF_AI_IGNORE_INVALID",
    "The .openforgeignore content is invalid.",
  );
  invariant(
    Number.isSafeInteger(retentionHours) &&
      retentionHours >= 0 &&
      retentionHours <= parsedPolicy.retention.maximumHours,
    "OF_AI_RETENTION_DENIED",
    "The requested AI context retention exceeds administrator policy.",
  );

  const requested = requestedPaths.map(normalizeProjectPath);
  invariant(
    new Set(requested).size === requested.length,
    "OF_AI_CONTEXT_DUPLICATE",
    "AI context paths must be unique.",
  );
  invariant(
    requested.length <= parsedPolicy.context.maxFiles,
    "OF_AI_CONTEXT_FILE_LIMIT",
    "The AI context requests too many files.",
  );
  const fileMap = new Map();
  for (const file of files) {
    const normalizedPath = normalizeProjectPath(file?.path);
    invariant(
      typeof file.content === "string",
      "OF_AI_CONTEXT_FILE_INVALID",
      "An AI context file is invalid.",
      { path: normalizedPath },
    );
    invariant(
      !fileMap.has(normalizedPath),
      "OF_AI_CONTEXT_DUPLICATE",
      "The AI context contains a duplicate project path.",
      { path: normalizedPath },
    );
    fileMap.set(normalizedPath, file.content);
  }

  const ignore = createIgnore().add(DEFAULT_IGNORES);
  if (openforgeIgnore.trim()) ignore.add(openforgeIgnore);
  const includedFiles = [];
  const included = [];
  const excluded = [];
  let totalBytes = 0;

  for (const requestedPath of requested) {
    if (ignore.ignores(requestedPath)) {
      excluded.push({ path: requestedPath, reason: "ignored" });
      continue;
    }
    const content = fileMap.get(requestedPath);
    if (content === undefined) {
      excluded.push({ path: requestedPath, reason: "not-found" });
      continue;
    }
    const scan = redactSecrets(content);
    if (
      scan.findings.length > 0 &&
      parsedPolicy.context.secretHandling === "block"
    ) {
      excluded.push({
        path: requestedPath,
        reason: "secret-detected",
        secretCount: scan.findings.length,
      });
      continue;
    }
    const bytes = Buffer.byteLength(scan.content, "utf8");
    invariant(
      totalBytes + bytes <= parsedPolicy.context.maxBytes,
      "OF_AI_CONTEXT_BYTE_LIMIT",
      "The AI context exceeds the administrator byte limit.",
    );
    totalBytes += bytes;
    includedFiles.push({
      path: requestedPath,
      content: scan.content,
    });
    included.push({
      path: requestedPath,
      bytes,
      sha256: digest(scan.content),
      secretCount: scan.findings.length,
      redactions: scan.findings,
    });
  }

  invariant(
    includedFiles.length > 0,
    "OF_AI_CONTEXT_EMPTY",
    "No explicitly requested files remain after context policy.",
  );
  const createdAt = clock();
  const manifest = {
    schemaVersion: 1,
    id: `ai_context_${crypto.randomUUID().replaceAll("-", "")}`,
    createdAt: createdAt.toISOString(),
    expiresAt:
      retentionHours === 0
        ? null
        : new Date(
            createdAt.getTime() + retentionHours * 60 * 60 * 1000,
          ).toISOString(),
    retentionHours,
    requestedPaths: requested,
    included,
    excluded,
    totalBytes,
  };
  return {
    manifest: structuredClone(manifest),
    files: structuredClone(includedFiles),
  };
}

export function createMemoryAIContextStore({ clock = () => new Date() } = {}) {
  const contexts = new Map();

  return {
    async put(context) {
      invariant(
        context?.manifest?.expiresAt,
        "OF_AI_CONTEXT_EPHEMERAL",
        "Ephemeral AI context cannot be persisted.",
      );
      contexts.set(context.manifest.id, structuredClone(context));
      return structuredClone(context.manifest);
    },
    async get(id) {
      const context = contexts.get(id);
      if (!context) return null;
      if (new Date(context.manifest.expiresAt) <= clock()) {
        contexts.delete(id);
        return null;
      }
      return structuredClone(context);
    },
    async delete(id) {
      return contexts.delete(id);
    },
    async deleteExpired() {
      let deleted = 0;
      for (const [id, context] of contexts) {
        if (new Date(context.manifest.expiresAt) <= clock()) {
          contexts.delete(id);
          deleted += 1;
        }
      }
      return { deleted };
    },
  };
}

export function redactAISecrets(content) {
  invariant(
    typeof content === "string",
    "OF_AI_CONTEXT_FILE_INVALID",
    "Secret scanning requires text content.",
  );
  return redactSecrets(content);
}

function redactSecrets(content) {
  const findings = [];
  const withoutPrivateKeys = content.replace(
    /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----[\s\S]*?-----END (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/gu,
    (match, offset) => {
      findings.push({
        line: content.slice(0, offset).split("\n").length,
        kind: "private-key",
      });
      return "[REDACTED PRIVATE KEY]";
    },
  );
  const lines = withoutPrivateKeys.split("\n");
  const redactedLines = lines.map((line, index) => {
    let output = line;
    output = replaceSecret(
      output,
      /\b(?:sk|sk-proj|sk-ant|AIza)[-_a-zA-Z0-9]{16,}\b/gu,
      "api-key",
      index,
      findings,
    );
    output = replaceSecret(
      output,
      /\b(?:gh[pousr]_[a-zA-Z0-9]{20,}|github_pat_[a-zA-Z0-9_]{20,})\b/gu,
      "github-token",
      index,
      findings,
    );
    output = output.replace(
      /(\bBearer\s+)[a-zA-Z0-9._~+/-]{16,}={0,2}\b/gu,
      (match, prefix) => {
        findings.push({ line: index + 1, kind: "bearer-token" });
        return `${prefix}[REDACTED]`;
      },
    );
    output = output.replace(
      /(\b[A-Z][A-Z0-9_]*(?:KEY|TOKEN|SECRET|PASSWORD)\b\s*[:=]\s*["']?)([^"'\s]+)/gu,
      (match, prefix) => {
        findings.push({ line: index + 1, kind: "secret-assignment" });
        return `${prefix}[REDACTED]`;
      },
    );
    return output;
  });
  return {
    content: redactedLines.join("\n"),
    findings,
  };
}

function replaceSecret(content, pattern, kind, line, findings) {
  return content.replace(pattern, () => {
    findings.push({ line: line + 1, kind });
    return "[REDACTED]";
  });
}

function normalizeProjectPath(value) {
  invariant(
    typeof value === "string" &&
      value.length > 0 &&
      value.length <= 500 &&
      !value.includes("\\") &&
      !value.includes("\0"),
    "OF_AI_CONTEXT_PATH_INVALID",
    "An AI context path is invalid.",
  );
  const normalized = path.posix.normalize(value.replace(/^\.\/+/u, ""));
  invariant(
    normalized !== "." &&
      !normalized.startsWith("../") &&
      !path.posix.isAbsolute(normalized),
    "OF_AI_CONTEXT_PATH_INVALID",
    "AI context paths must remain inside the project.",
  );
  return normalized;
}

function digest(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function parseUniqueStrings(value, predicate) {
  invariant(
    Array.isArray(value) &&
      value.length > 0 &&
      new Set(value).size === value.length &&
      value.every(predicate),
    "OF_AI_ADMIN_POLICY_INVALID",
    "An AI administrator policy list is invalid.",
  );
  return [...value];
}

function boundedInteger(value, minimum, maximum) {
  invariant(
    Number.isSafeInteger(value) && value >= minimum && value <= maximum,
    "OF_AI_ADMIN_POLICY_INVALID",
    "An AI administrator policy limit is invalid.",
  );
  return value;
}

function parseSecretHandling(value) {
  invariant(
    ["redact", "block"].includes(value),
    "OF_AI_ADMIN_POLICY_INVALID",
    "The AI secret-handling policy is invalid.",
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
