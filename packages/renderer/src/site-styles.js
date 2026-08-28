import { createDesignTokenRegistry } from "@openforge/design-tokens";

/**
 * Merge site-specific token value overrides into a base token collection
 * and return the resulting CSS text. Only the `value` of an existing token
 * is overridden — unknown override keys are ignored rather than silently
 * inventing new tokens outside the declared set.
 *
 * @param {{ baseTokens: { schemaVersion: number, tokens: object[] }, overrides?: Record<string, string> }} options
 */
export function renderSiteStyles({ baseTokens, overrides = {} }) {
  const tokens = baseTokens.tokens.map((token) =>
    Object.hasOwn(overrides, token.name)
      ? { ...token, value: overrides[token.name] }
      : token,
  );

  const registry = createDesignTokenRegistry({
    ...baseTokens,
    tokens,
  });

  return registry.toCss();
}
