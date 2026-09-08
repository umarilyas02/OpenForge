import { randomBytes, randomUUID } from "node:crypto";

import { parse, serialize } from "parse5";
import { z } from "zod";

const DEFAULT_LIMITS = Object.freeze({
  cpuPercent: 100,
  diskBytes: 512 * 1024 * 1024,
  egressRequestsPerMinute: 120,
  memoryBytes: 512 * 1024 * 1024,
  timeoutMs: 30 * 60 * 1000,
});

const MAXIMUM_LIMITS = Object.freeze({
  cpuPercent: 200,
  diskBytes: 2 * 1024 * 1024 * 1024,
  egressRequestsPerMinute: 600,
  memoryBytes: 2 * 1024 * 1024 * 1024,
  timeoutMs: 4 * 60 * 60 * 1000,
});

const previewMessageSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("preview-ready"),
      sessionToken: z.string().min(32).max(256),
      payload: z.object({ pathname: z.string().startsWith("/") }).strict(),
    })
    .strict(),
  z
    .object({
      type: z.literal("preview-log"),
      sessionToken: z.string().min(32).max(256),
      payload: z
        .object({
          level: z.enum(["debug", "info", "warn", "error"]),
          message: z.string().max(16_384),
        })
        .strict(),
    })
    .strict(),
  z
    .object({
      type: z.literal("preview-error"),
      sessionToken: z.string().min(32).max(256),
      payload: z
        .object({
          message: z.string().max(16_384),
          stack: z.string().max(32_768).optional(),
        })
        .strict(),
    })
    .strict(),
  z
    .object({
      type: z.literal("preview-navigation"),
      sessionToken: z.string().min(32).max(256),
      payload: z.object({ pathname: z.string().startsWith("/") }).strict(),
    })
    .strict(),
]);

export class IsolatedPreviewRuntime {
  /**
   * @param {{ manager: PreviewSessionManager, executor: object }} options
   */
  constructor({ manager, executor }) {
    if (!(manager instanceof PreviewSessionManager)) {
      throw new TypeError("manager must be a PreviewSessionManager.");
    }
    const requiredCapabilities = [
      "cpuLimit",
      "diskLimit",
      "egressPolicy",
      "memoryLimit",
      "processIsolation",
      "timeout",
    ];
    const missing = requiredCapabilities.filter(
      (capability) => executor?.capabilities?.[capability] !== true,
    );
    if (
      missing.length > 0 ||
      typeof executor?.start !== "function" ||
      typeof executor?.stop !== "function"
    ) {
      throw new PreviewPolicyError(
        "OF_PREVIEW_EXECUTOR_UNSAFE",
        `Preview executor is missing required isolation: ${missing.join(", ") || "start/stop"}.`,
      );
    }
    this.manager = manager;
    this.executor = executor;
    this.executions = new Map();
  }

  async start(workspaceId, workspacePath) {
    const session = this.manager.allocate(workspaceId);
    try {
      const execution = await this.executor.start({
        allowedEgressOrigins: session.allowedEgressOrigins,
        limits: session.limits,
        networkMode:
          session.allowedEgressOrigins.length === 0 ? "none" : "allowlist",
        sessionId: session.sessionId,
        workspacePath,
      });
      this.executions.set(session.sessionId, execution);
      return { execution, session };
    } catch (error) {
      this.manager.release(session.sessionId);
      throw error;
    }
  }

  async stop(sessionId) {
    const execution = this.executions.get(sessionId);
    if (execution) await this.executor.stop(execution);
    this.executions.delete(sessionId);
    this.manager.release(sessionId);
  }
}

export class PreviewSessionManager {
  /**
   * @param {{
   *   controlOrigin: string,
   *   previewOrigin: string,
   *   limits?: Partial<typeof DEFAULT_LIMITS>,
   *   allowedEgressOrigins?: string[],
   *   now?: () => number
   * }} options
   */
  constructor(options) {
    this.controlOrigin = normalizeOrigin(options.controlOrigin);
    this.previewOrigin = normalizeOrigin(options.previewOrigin);
    if (this.controlOrigin === this.previewOrigin) {
      throw new PreviewPolicyError(
        "OF_PREVIEW_ORIGIN_NOT_ISOLATED",
        "Preview and control origins must be different.",
      );
    }
    this.limits = validateLimits({ ...DEFAULT_LIMITS, ...options.limits });
    this.allowedEgressOrigins = Object.freeze(
      (options.allowedEgressOrigins ?? []).map(normalizeOrigin).sort(),
    );
    this.now = options.now ?? Date.now;
    this.sessions = new Map();
  }

  allocate(workspaceId) {
    if (typeof workspaceId !== "string" || workspaceId.length === 0) {
      throw new TypeError("workspaceId must be a non-empty string.");
    }
    const sessionId = randomUUID();
    const token = randomBytes(32).toString("base64url");
    const createdAt = this.now();
    const session = Object.freeze({
      allowedEgressOrigins: this.allowedEgressOrigins,
      controlOrigin: this.controlOrigin,
      createdAt,
      expiresAt: createdAt + this.limits.timeoutMs,
      iframe: Object.freeze({
        referrerPolicy: "no-referrer",
        sandbox: "allow-forms allow-same-origin allow-scripts",
      }),
      limits: this.limits,
      previewOrigin: this.previewOrigin,
      sessionId,
      token,
      url: `${this.previewOrigin}/sessions/${sessionId}/`,
      workspaceId,
    });
    this.sessions.set(sessionId, session);
    return session;
  }

  get(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new PreviewPolicyError(
        "OF_PREVIEW_SESSION_NOT_FOUND",
        "Preview session does not exist.",
      );
    }
    if (session.expiresAt <= this.now()) {
      this.sessions.delete(sessionId);
      throw new PreviewPolicyError(
        "OF_PREVIEW_SESSION_EXPIRED",
        "Preview session has expired.",
      );
    }
    return session;
  }

  release(sessionId) {
    return this.sessions.delete(sessionId);
  }

  sweepExpired() {
    let released = 0;
    for (const [sessionId, session] of this.sessions) {
      if (session.expiresAt <= this.now()) {
        this.sessions.delete(sessionId);
        released += 1;
      }
    }
    return released;
  }

  assertEgress(sessionId, destination) {
    const session = this.get(sessionId);
    const destinationOrigin = normalizeOrigin(destination);
    if (!session.allowedEgressOrigins.includes(destinationOrigin)) {
      throw new PreviewPolicyError(
        "OF_PREVIEW_EGRESS_DENIED",
        `Preview egress to "${destinationOrigin}" is not allowed.`,
      );
    }
    return destinationOrigin;
  }
}

export function createPreviewSession(options) {
  const { workspaceId, ...managerOptions } = options;
  return new PreviewSessionManager(managerOptions).allocate(workspaceId);
}

export function getPreviewHeaders(session) {
  const connectSources = ["'self'", ...session.allowedEgressOrigins].join(" ");
  return Object.freeze({
    "Cache-Control": "no-store",
    "Content-Security-Policy": [
      "default-src 'self'",
      "base-uri 'none'",
      `connect-src ${connectSources}`,
      "font-src 'self' data:",
      "form-action 'self'",
      `frame-ancestors ${session.controlOrigin}`,
      "img-src 'self' blob: data:",
      "object-src 'none'",
      "script-src 'self' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "worker-src 'self' blob:",
    ].join("; "),
    "Cross-Origin-Opener-Policy": "same-origin",
    "Permissions-Policy":
      "camera=(), geolocation=(), microphone=(), payment=(), usb=()",
    "Referrer-Policy": "no-referrer",
    "X-Content-Type-Options": "nosniff",
  });
}

export function validatePreviewMessage({
  data,
  eventOrigin,
  expectedOrigin,
  sessionToken,
}) {
  const origin = normalizeOrigin(eventOrigin);
  if (origin !== normalizeOrigin(expectedOrigin)) {
    throw new PreviewPolicyError(
      "OF_PREVIEW_MESSAGE_ORIGIN_DENIED",
      "Preview message origin did not match the active session.",
    );
  }
  const result = previewMessageSchema.safeParse(data);
  if (!result.success) {
    throw new PreviewPolicyError(
      "OF_PREVIEW_MESSAGE_INVALID",
      "Preview message failed schema validation.",
      { issues: result.error.issues },
    );
  }
  if (!timingSafeTextEqual(result.data.sessionToken, sessionToken)) {
    throw new PreviewPolicyError(
      "OF_PREVIEW_MESSAGE_TOKEN_DENIED",
      "Preview message token did not match the active session.",
    );
  }
  return result.data;
}

export function sanitizePreviewLog(value) {
  const seen = new WeakSet();
  return JSON.parse(
    JSON.stringify(value, (key, currentValue) => {
      if (isSecretKey(key)) return "[REDACTED]";
      if (typeof currentValue === "string") {
        return redactText(currentValue).slice(0, 16_384);
      }
      if (currentValue && typeof currentValue === "object") {
        if (seen.has(currentValue)) return "[CIRCULAR]";
        seen.add(currentValue);
      }
      return currentValue;
    }),
  );
}

export function stripPreviewMetadata(html) {
  if (typeof html !== "string") throw new TypeError("html must be a string.");
  const document = parse(html);
  walkHtml(document, (node) => {
    if (Array.isArray(node.attrs)) {
      node.attrs = node.attrs.filter(
        ({ name }) => !name.toLowerCase().startsWith("data-openforge-"),
      );
    }
  });
  return serialize(document);
}

function validateLimits(limits) {
  for (const [name, maximum] of Object.entries(MAXIMUM_LIMITS)) {
    const value = limits[name];
    if (!Number.isSafeInteger(value) || value <= 0 || value > maximum) {
      throw new PreviewPolicyError(
        "OF_PREVIEW_LIMIT_INVALID",
        `Preview limit "${name}" must be between 1 and ${maximum}.`,
      );
    }
  }
  return Object.freeze({ ...limits });
}

function normalizeOrigin(value) {
  let url;
  try {
    url = new URL(value);
  } catch {
    throw new PreviewPolicyError(
      "OF_PREVIEW_ORIGIN_INVALID",
      `Invalid origin: "${value}".`,
    );
  }
  if (!["http:", "https:"].includes(url.protocol) || url.origin === "null") {
    throw new PreviewPolicyError(
      "OF_PREVIEW_ORIGIN_INVALID",
      `Unsupported origin: "${value}".`,
    );
  }
  return url.origin;
}

function timingSafeTextEqual(left, right) {
  if (typeof left !== "string" || typeof right !== "string") return false;
  const leftBytes = Buffer.from(left);
  const rightBytes = Buffer.from(right);
  if (leftBytes.length !== rightBytes.length) return false;
  let difference = 0;
  for (let index = 0; index < leftBytes.length; index += 1) {
    difference |= leftBytes[index] ^ rightBytes[index];
  }
  return difference === 0;
}

function isSecretKey(key) {
  return /authorization|cookie|credential|password|secret|token|api[-_]?key/iu.test(
    key,
  );
}

function redactText(value) {
  return value
    .replace(/\bBearer\s+[A-Za-z0-9._~+/=-]+/giu, "Bearer [REDACTED]")
    .replace(/\b(?:sk|pk|ghp|github_pat)_[A-Za-z0-9_-]{8,}\b/gu, "[REDACTED]");
}

function walkHtml(node, visit) {
  visit(node);
  for (const child of node.childNodes ?? []) walkHtml(child, visit);
  if (node.content) walkHtml(node.content, visit);
}

export class PreviewPolicyError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "PreviewPolicyError";
    this.code = code;
    this.details = details;
  }
}
