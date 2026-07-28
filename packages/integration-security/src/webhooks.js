import { createHmac, timingSafeEqual } from "node:crypto";

import { invariant } from "./errors.js";

export function verifyHmacWebhook({
  body,
  secret,
  signature,
  algorithm = "sha256",
  prefix = `${algorithm}=`,
}) {
  invariant(
    Buffer.isBuffer(body),
    "OF_WEBHOOK_RAW_BODY_REQUIRED",
    "Webhook verification requires the unmodified raw request body.",
  );
  invariant(
    typeof secret === "string" && secret.length >= 16,
    "OF_WEBHOOK_SECRET_INVALID",
    "Webhook secrets must contain at least 16 characters.",
  );
  invariant(
    typeof signature === "string" && signature.startsWith(prefix),
    "OF_WEBHOOK_SIGNATURE_INVALID",
    "The webhook signature format is invalid.",
  );
  const supplied = Buffer.from(signature.slice(prefix.length), "hex");
  const expected = createHmac(algorithm, secret).update(body).digest();
  return (
    supplied.length === expected.length && timingSafeEqual(supplied, expected)
  );
}

export function verifyGitHubWebhook(input) {
  return verifyHmacWebhook({
    ...input,
    algorithm: "sha256",
    prefix: "sha256=",
  });
}

export function createMemoryDeliveryStore({
  clock = () => Date.now(),
  ttlMs = 24 * 60 * 60 * 1000,
} = {}) {
  const deliveries = new Map();

  return {
    async claim(provider, deliveryId) {
      const now = clock();
      for (const [key, expiresAt] of deliveries) {
        if (expiresAt <= now) deliveries.delete(key);
      }
      const key = `${provider}:${deliveryId}`;
      if (deliveries.has(key)) return false;
      deliveries.set(key, now + ttlMs);
      return true;
    },
  };
}

export function createWebhookGate({ deliveryStore, verifier }) {
  invariant(
    deliveryStore?.claim && typeof verifier === "function",
    "OF_WEBHOOK_GATE_INVALID",
    "A delivery store and signature verifier are required.",
  );

  return {
    async accept({ provider, deliveryId, ...verification }) {
      invariant(
        /^[a-z0-9-]{1,32}$/u.test(provider) &&
          /^[a-zA-Z0-9._:-]{1,160}$/u.test(deliveryId),
        "OF_WEBHOOK_DELIVERY_INVALID",
        "Webhook provider or delivery ID is invalid.",
      );
      invariant(
        verifier(verification),
        "OF_WEBHOOK_SIGNATURE_REJECTED",
        "The webhook signature could not be verified.",
      );
      const claimed = await deliveryStore.claim(provider, deliveryId);
      return { accepted: claimed, duplicate: !claimed };
    },
  };
}
