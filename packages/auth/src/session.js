import { createHash, randomBytes } from "node:crypto";

import { invariant } from "./errors.js";

const DEFAULT_SESSION_TTL_MS = 30 * 24 * 60 * 60 * 1000;

function hashToken(token) {
  return createHash("sha256").update(token).digest("hex");
}

/**
 * Create a session manager over an injectable store. The store only ever
 * sees a hashed token; the raw token is returned once, at issue time, for
 * the caller to set as a cookie.
 *
 * @param {{ store: { create: Function, findByTokenHash: Function, revoke: Function }, clock?: () => Date, sessionTtlMs?: number }} options
 */
export function createSessionManager({
  store,
  clock = () => new Date(),
  sessionTtlMs = DEFAULT_SESSION_TTL_MS,
}) {
  async function issue({ userId, deviceMetadata = {} }) {
    const token = randomBytes(32).toString("hex");
    const tokenHash = hashToken(token);
    const expiresAt = new Date(clock().getTime() + sessionTtlMs);

    const session = await store.create({
      userId,
      tokenHash,
      deviceMetadata,
      expiresAt,
    });

    return { token, session };
  }

  async function verify(token) {
    const record = await store.findByTokenHash(hashToken(token));

    invariant(
      record,
      "OF_AUTH_SESSION_INVALID",
      "The session token is invalid.",
    );
    invariant(
      !record.revokedAt,
      "OF_AUTH_SESSION_REVOKED",
      "The session has been revoked.",
    );
    invariant(
      new Date(record.expiresAt).getTime() > clock().getTime(),
      "OF_AUTH_SESSION_EXPIRED",
      "The session has expired.",
    );

    return record;
  }

  async function revoke(token) {
    await store.revoke(hashToken(token), clock());
  }

  return Object.freeze({ issue, verify, revoke });
}
