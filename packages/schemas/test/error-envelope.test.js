import { describe, expect, it } from "vitest";

import { SchemaError } from "../src/errors.js";
import { toErrorEnvelope, toSuccessEnvelope } from "../src/error-envelope.js";

describe("error envelope", () => {
  it("builds a stable envelope from a coded error", () => {
    const error = new SchemaError("OF_CONFIG_INVALID", "Invalid config.", {
      field: "DATABASE_URL",
    });

    expect(toErrorEnvelope(error, { requestId: "req_1" })).toEqual({
      schemaVersion: 1,
      code: "OF_CONFIG_INVALID",
      message: "Invalid config.",
      details: { field: "DATABASE_URL" },
      requestId: "req_1",
    });
  });

  it("rejects a non-conforming error code", () => {
    const error = new SchemaError("bad-code", "Invalid config.");

    expect(() => toErrorEnvelope(error)).toThrow();
  });

  it("builds a success envelope", () => {
    expect(toSuccessEnvelope({ ok: true })).toEqual({
      schemaVersion: 1,
      data: { ok: true },
    });
  });
});
