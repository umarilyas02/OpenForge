import { AIProviderError, invariant } from "./errors.js";

export function createFakeAIProvider({ capabilities, scripts = [] }) {
  const queue = scripts.map((script) => structuredClone(script));
  const calls = [];

  return {
    capabilities,
    calls,
    async *stream(input) {
      calls.push(
        structuredClone({ model: input.model, request: input.request }),
      );
      invariant(
        queue.length > 0,
        "OF_AI_FAKE_SCRIPT_MISSING",
        "The fake AI provider has no remaining script.",
      );
      const script = queue.shift();
      for (const step of script) {
        if (input.signal?.aborted) {
          throw new DOMException("The operation was aborted.", "AbortError");
        }
        if (step.type === "throw") {
          throw new AIProviderError(step.error);
        }
        yield structuredClone(step);
      }
    },
  };
}
