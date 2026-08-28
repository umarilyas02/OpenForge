import { describe, expect, it } from "vitest";

import { AuthError } from "../src/errors.js";
import { createMemorySessionStore } from "../src/memory-session-store.js";
import { createSessionManager } from "../src/session.js";

function withClock(startTime) {
  let now = startTime;
  return {
    clock: () => new Date(now),
    advance: (ms) => {
      now += ms;
    },
  };
}

describe("session manager", () => {
  it("issues a session and verifies it with the raw token", async () => {
    const manager = createSessionManager({ store: createMemorySessionStore() });

    const { token, session } = await manager.issue({ userId: "user_1" });
    const verified = await manager.verify(token);

    expect(verified.userId).toBe("user_1");
    expect(verified.id).toBe(session.id);
  });

  it("rejects an unknown token", async () => {
    const manager = createSessionManager({ store: createMemorySessionStore() });

    await expect(manager.verify("not-a-real-token")).rejects.toThrow(AuthError);
  });

  it("rejects an expired session", async () => {
    const time = withClock(0);
    const manager = createSessionManager({
      store: createMemorySessionStore(),
      clock: time.clock,
      sessionTtlMs: 1000,
    });

    const { token } = await manager.issue({ userId: "user_1" });
    time.advance(2000);

    await expect(manager.verify(token)).rejects.toMatchObject({
      code: "OF_AUTH_SESSION_EXPIRED",
    });
  });

  it("rejects a revoked session", async () => {
    const manager = createSessionManager({ store: createMemorySessionStore() });

    const { token } = await manager.issue({ userId: "user_1" });
    await manager.revoke(token);

    await expect(manager.verify(token)).rejects.toMatchObject({
      code: "OF_AUTH_SESSION_REVOKED",
    });
  });
});
