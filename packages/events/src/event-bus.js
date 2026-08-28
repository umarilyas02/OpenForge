import { invariant } from "./errors.js";

/**
 * Create an in-process, schema-validated domain event bus. Every event name
 * must have a registered zod schema before it can be published — this
 * keeps event payloads as much of a stable contract as any other boundary
 * in the codebase. A cross-process (Redis/BullMQ-backed) bus is a
 * deliberate later addition, not something this stubs out.
 *
 * @param {{ schemas: Record<string, import("zod").ZodType> }} options
 */
export function createEventBus({ schemas = {} } = {}) {
  const listeners = new Map();

  function on(eventName, handler) {
    invariant(
      Object.hasOwn(schemas, eventName),
      "OF_EVENT_UNKNOWN",
      `No schema registered for event "${eventName}".`,
      { eventName },
    );
    const handlers = listeners.get(eventName) ?? new Set();
    handlers.add(handler);
    listeners.set(eventName, handlers);
    return () => off(eventName, handler);
  }

  function off(eventName, handler) {
    listeners.get(eventName)?.delete(handler);
  }

  async function publish(eventName, payload) {
    const schema = schemas[eventName];
    invariant(
      schema,
      "OF_EVENT_UNKNOWN",
      `No schema registered for event "${eventName}".`,
      { eventName },
    );

    const parsed = schema.parse(payload);
    const handlers = listeners.get(eventName);
    if (handlers) {
      await Promise.all([...handlers].map((handler) => handler(parsed)));
    }
    return parsed;
  }

  return Object.freeze({ on, off, publish });
}
