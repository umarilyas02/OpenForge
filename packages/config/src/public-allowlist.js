import { ConfigError } from "./errors.js";

const SECRET_SHAPED_KEY =
  /secret|password|credential|private.?key|token|api.?key/iu;

/**
 * Assert that every key in an object about to be exposed to the browser is
 * either `NEXT_PUBLIC_`-prefixed or explicitly allowlisted, and that no
 * secret-shaped key slips through even when prefixed. Throws on the first
 * violation so unsafe browser exposure fails loudly at build/startup time.
 *
 * @param {Record<string, unknown>} publicEnv
 * @param {{ allow?: string[] }} [options]
 */
export function assertPublicSafe(publicEnv, { allow = [] } = {}) {
  for (const key of Object.keys(publicEnv)) {
    const isPrefixed = key.startsWith("NEXT_PUBLIC_");
    const isAllowed = allow.includes(key);

    if (!isPrefixed && !isAllowed) {
      throw new ConfigError(
        "OF_CONFIG_PUBLIC_NOT_ALLOWLISTED",
        `"${key}" is not prefixed with NEXT_PUBLIC_ and is not explicitly allowlisted for browser exposure.`,
        { key },
      );
    }

    if (SECRET_SHAPED_KEY.test(key)) {
      throw new ConfigError(
        "OF_CONFIG_PUBLIC_LEAK",
        `"${key}" looks like a secret and must never be exposed to the browser, even when prefixed or allowlisted.`,
        { key },
      );
    }
  }
}
