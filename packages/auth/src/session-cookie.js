export const SESSION_COOKIE_NAME = "of_session";

/**
 * Build a `Set-Cookie` header value for a session token. Pure and
 * framework-agnostic since no HTTP framework is wired up yet.
 *
 * @param {string} token
 * @param {{ maxAgeSeconds?: number, secure?: boolean }} [options]
 */
export function buildSessionCookie(
  token,
  { maxAgeSeconds, secure = true } = {},
) {
  const attributes = [
    `${SESSION_COOKIE_NAME}=${token}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
  ];

  if (secure) attributes.push("Secure");
  if (typeof maxAgeSeconds === "number") {
    attributes.push(`Max-Age=${maxAgeSeconds}`);
  }

  return attributes.join("; ");
}

/**
 * Build a `Set-Cookie` header value that immediately clears the session
 * cookie (for logout).
 *
 * @param {{ secure?: boolean }} [options]
 */
export function buildExpiredSessionCookie({ secure = true } = {}) {
  return buildSessionCookie("", { maxAgeSeconds: 0, secure });
}
