import { AsyncLocalStorage } from "node:async_hooks";
import { randomUUID } from "node:crypto";

const traceStorage = new AsyncLocalStorage();

/**
 * Generate a new trace ID.
 */
export function generateTraceId() {
  return `trace_${randomUUID().replaceAll("-", "")}`;
}

/**
 * Run `fn` with the given trace ID attached to the current async context.
 * Nested calls to `getTraceId()` anywhere in `fn`'s call graph observe it.
 *
 * @template T
 * @param {string} traceId
 * @param {() => T} fn
 * @returns {T}
 */
export function withTrace(traceId, fn) {
  return traceStorage.run(traceId, fn);
}

/**
 * @returns {string | undefined}
 */
export function getTraceId() {
  return traceStorage.getStore();
}
