import { describe, expect, it } from "vitest";

import {
  InspectorValueError,
  createInspectorModel,
  createInspectorValue,
  planInspectorTokenUpdate,
  resolveBreakpointValue,
} from "../src/index.js";

describe("inspector model", () => {
  it("groups content and visual controls with explicit provenance", () => {
    const model = createInspectorModel({
      selection: { nodeId: "node_0123456789abcdef", label: "Hero" },
      viewport: "desktop",
      values: [
        { property: "text", value: "Build clearly", source: "local" },
        {
          property: "paddingBlock",
          value: "4rem",
          source: "semantic-token",
          tokenName: "space.section",
        },
        {
          property: "color",
          value: "#111318",
          source: "inherited",
          inheritedFrom: "Page",
        },
      ],
    });

    expect(model.groups.map(({ id }) => id)).toEqual([
      "content",
      "spacing",
      "typography",
    ]);
    expect(model.groups[1].controls[0]).toMatchObject({
      source: "semantic-token",
      sourceDetail: "space.section",
      token: { resolvedValue: "4rem" },
    });
    expect(model.groups[2].controls[0]).toMatchObject({
      source: "inherited",
      sourceDetail: "Page",
    });
  });

  it("resolves the nearest active breakpoint and supports reset to base", () => {
    const input = {
      baseValue: "1rem",
      breakpoints: {
        mobile: "1.25rem",
        tablet: "2rem",
        laptop: "3rem",
      },
    };
    expect(resolveBreakpointValue({ ...input, viewport: "tablet" })).toEqual({
      breakpoint: "tablet",
      value: "2rem",
    });
    expect(
      resolveBreakpointValue({
        baseValue: input.baseValue,
        breakpoints: {},
        viewport: "tablet",
      }),
    ).toEqual({ breakpoint: "base", value: "1rem" });

    expect(
      createInspectorValue({
        property: "gap",
        value: "1rem",
        breakpoints: { tablet: "2rem" },
        viewport: "desktop",
      }),
    ).toMatchObject({
      value: "2rem",
      source: "breakpoint",
      sourceDetail: "tablet",
    });
  });

  it("plans global token changes with affected usages before mutation", () => {
    const plan = planInspectorTokenUpdate({
      property: "padding",
      tokenName: "space.4",
      value: "1.5rem",
      files: [
        {
          path: "components/Card.jsx",
          source: 'const token = "space.4";',
        },
        {
          path: "app/globals.css",
          source: ".card { padding: var(--of-space-4); }",
        },
      ],
    });

    expect(plan.usage).toMatchObject({
      count: 2,
      files: ["app/globals.css", "components/Card.jsx"],
    });
    expect(plan.warning).toBe(
      "This global change affects 2 usages across 2 files.",
    );
  });

  it("rejects invalid units, unsafe URLs, unknown controls, and bad inheritance", () => {
    expect(() =>
      createInspectorValue({
        property: "padding",
        value: "calc(1rem); color: red",
      }),
    ).toThrowError(expect.objectContaining({ code: "OF_TOKEN_VALUE_UNSAFE" }));

    expect(() =>
      createInspectorValue({
        property: "href",
        value: "javascript:alert(1)",
      }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_INSPECTOR_VALUE_INVALID" }),
    );

    expect(() =>
      createInspectorValue({ property: "unknown", value: "1rem" }),
    ).toThrowError(InspectorValueError);

    expect(() =>
      createInspectorValue({
        property: "color",
        value: "#ffffff",
        source: "inherited",
      }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_INSPECTOR_INHERITANCE_INVALID" }),
    );
  });

  it("rejects token types that do not match the selected property", () => {
    expect(() =>
      createInspectorValue({
        property: "padding",
        value: "1rem",
        source: "semantic-token",
        tokenName: "color.action",
      }),
    ).toThrowError(expect.objectContaining({ code: "OF_TOKEN_VALUE_UNSAFE" }));
  });
});
