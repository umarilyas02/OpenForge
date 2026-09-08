import { redactConfigValue } from "@openforge/config";

import { getTraceId } from "./trace.js";

const LEVELS = Object.freeze({ debug: 10, info: 20, warn: 30, error: 40 });

/**
 * Create a structured JSON logger. Each entry is one line of JSON written
 * to `destination`, carrying the service name, level, message, redacted
 * metadata, and the current trace ID (if any) from `withTrace`.
 *
 * @param {{ service: string, level?: keyof typeof LEVELS, destination?: { write: (chunk: string) => void }, errorDestination?: { write: (chunk: string) => void }, clock?: () => Date }} options
 */
export function createLogger({
  service,
  level = "info",
  destination = process.stdout,
  errorDestination = process.stderr,
  clock = () => new Date(),
} = {}) {
  const threshold = LEVELS[level];

  function write(entryLevel, message, meta) {
    if (LEVELS[entryLevel] < threshold) return;

    const entry = {
      timestamp: clock().toISOString(),
      level: entryLevel,
      service,
      traceId: getTraceId() ?? null,
      message,
      meta: redactConfigValue(meta ?? {}),
    };

    const target = entryLevel === "error" ? errorDestination : destination;
    target.write(`${JSON.stringify(entry)}\n`);
  }

  return {
    debug: (message, meta) => write("debug", message, meta),
    info: (message, meta) => write("info", message, meta),
    warn: (message, meta) => write("warn", message, meta),
    error: (message, meta) => write("error", message, meta),
  };
}
