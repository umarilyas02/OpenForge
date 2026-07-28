import { createHmac, timingSafeEqual } from "node:crypto";

import { AssetError } from "./asset-policy.js";

export function createAssetUrlSigner({
  secret,
  baseUrl,
  clock = () => Date.now(),
  maxTtlSeconds = 3600,
}) {
  if (!Buffer.isBuffer(secret) || secret.length < 32) {
    throw new AssetError(
      "OF_ASSET_SIGNING_KEY_INVALID",
      "Asset signing keys must contain at least 32 bytes.",
    );
  }
  const normalizedBase = new URL(baseUrl);
  if (!["http:", "https:"].includes(normalizedBase.protocol)) {
    throw new AssetError(
      "OF_ASSET_BASE_URL_INVALID",
      "Asset access base URL must use HTTP or HTTPS.",
    );
  }

  function signature(key, expires) {
    return createHmac("sha256", secret)
      .update(`${key}\n${expires}`)
      .digest("base64url");
  }

  return Object.freeze({
    sign({ key, ttlSeconds = 300 }) {
      validateObjectKey(key);
      if (
        !Number.isInteger(ttlSeconds) ||
        ttlSeconds < 1 ||
        ttlSeconds > maxTtlSeconds
      ) {
        throw new AssetError(
          "OF_ASSET_TTL_INVALID",
          `Signed asset TTL must be between 1 and ${maxTtlSeconds} seconds.`,
        );
      }
      const expires = Math.floor(clock() / 1000) + ttlSeconds;
      const url = new URL(
        key
          .split("/")
          .map((segment) => encodeURIComponent(segment))
          .join("/"),
        normalizedBase,
      );
      url.searchParams.set("expires", String(expires));
      url.searchParams.set("signature", signature(key, expires));
      return { url: url.toString(), expires };
    },

    verify({ key, expires, candidateSignature }) {
      validateObjectKey(key);
      if (!Number.isInteger(expires) || expires < Math.floor(clock() / 1000)) {
        return false;
      }
      const expected = Buffer.from(signature(key, expires));
      const candidate = Buffer.from(candidateSignature ?? "");
      return (
        expected.length === candidate.length &&
        timingSafeEqual(expected, candidate)
      );
    },
  });
}

function validateObjectKey(key) {
  if (
    typeof key !== "string" ||
    !/^projects\/[a-zA-Z0-9_-]+\/assets\/[a-zA-Z0-9_./-]+$/u.test(key) ||
    key.includes("..") ||
    key.includes("\\")
  ) {
    throw new AssetError(
      "OF_ASSET_KEY_INVALID",
      "Asset object key is outside the allowed project asset prefix.",
    );
  }
}
