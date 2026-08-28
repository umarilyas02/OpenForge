import { describe, expect, it } from "vitest";

import { AuthError } from "../src/errors.js";
import { hashPassword, verifyPassword } from "../src/password.js";

describe("password hashing", () => {
  it("verifies a matching password", () => {
    const hash = hashPassword("correct horse battery staple");
    expect(verifyPassword("correct horse battery staple", hash)).toBe(true);
  });

  it("rejects a non-matching password", () => {
    const hash = hashPassword("correct horse battery staple");
    expect(verifyPassword("wrong password", hash)).toBe(false);
  });

  it("produces a different salt (and hash) each time", () => {
    const first = hashPassword("correct horse battery staple");
    const second = hashPassword("correct horse battery staple");
    expect(first).not.toBe(second);
  });

  it("rejects passwords shorter than the minimum length", () => {
    expect(() => hashPassword("short")).toThrow(AuthError);
  });

  it("rejects a malformed stored hash", () => {
    expect(() => verifyPassword("anything", "not-a-real-hash")).toThrow(
      AuthError,
    );
  });
});
