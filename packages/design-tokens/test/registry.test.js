import { describe, expect, it } from "vitest";

import {
  DesignTokenError,
  collectTokenUsage,
  createDesignTokenRegistry,
  defaultDesignTokenRegistry,
  defaultDesignTokens,
  validateStyleValue,
} from "../src/index.js";

describe("design token registry", () => {
  it("resolves typed global and semantic references deterministically", () => {
    expect(defaultDesignTokenRegistry.resolve("color.action")).toMatchObject({
      tier: "semantic",
      value: "{color.orange-500}",
      resolvedValue: "#ff5a1f",
    });
    expect(defaultDesignTokenRegistry.resolve("space.section")).toMatchObject({
      type: "dimension",
      resolvedValue: "4rem",
    });
    expect(defaultDesignTokenRegistry.list().map(({ name }) => name)).toEqual(
      [...defaultDesignTokenRegistry.list().map(({ name }) => name)].sort(),
    );
  });

  it("emits portable CSS variables while retaining reference relationships", () => {
    const css = defaultDesignTokenRegistry.toCss();
    expect(css).toContain("--of-color-orange-500: #ff5a1f;");
    expect(css).toContain("--of-color-action: var(--of-color-orange-500);");
    expect(css).toContain("--of-space-section: var(--of-space-16);");
  });

  it("reports exact project impact before a global change", () => {
    const files = [
      {
        path: "app/globals.css",
        source:
          ".button { color: var(--of-color-action); padding: var(--of-space-4); }",
      },
      {
        path: "components/Card.jsx",
        source: 'export const spacingToken = "space.4";',
      },
    ];
    const plan = defaultDesignTokenRegistry.planUpdate({
      name: "space.4",
      value: "1.25rem",
      files,
    });

    expect(plan.usage).toMatchObject({
      count: 2,
      files: ["app/globals.css", "components/Card.jsx"],
    });
    expect(plan.nextValue).toBe("1.25rem");
  });

  it("finds each source offset once even when token forms overlap", () => {
    const usage = collectTokenUsage({
      files: [
        {
          path: "app/a.css",
          source: "gap: var(--of-space-4); gap: var(--of-space-4);",
        },
      ],
      tokens: defaultDesignTokenRegistry.list(),
    });
    expect(
      usage.locations.filter(({ token }) => token === "space.4"),
    ).toHaveLength(2);
  });

  it("rejects injection values, type mismatches, and reference cycles", () => {
    expect(() =>
      validateStyleValue({
        property: "backgroundColor",
        value: "url(https://attacker.test)",
      }),
    ).toThrowError(expect.objectContaining({ code: "OF_TOKEN_VALUE_UNSAFE" }));

    expect(() =>
      defaultDesignTokenRegistry.planUpdate({
        name: "space.4",
        value: "{color.action}",
      }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_TOKEN_REFERENCE_INVALID" }),
    );

    const cyclic = structuredClone(defaultDesignTokens);
    cyclic.tokens.find(({ name }) => name === "color.ink").value =
      "{color.action}";
    cyclic.tokens.find(({ name }) => name === "color.orange-500").value =
      "{color.ink}";
    expect(() => createDesignTokenRegistry(cyclic)).toThrowError(
      expect.objectContaining({ code: "OF_TOKEN_REFERENCE_CYCLE" }),
    );
  });

  it("rejects duplicate token identities", () => {
    expect(() =>
      createDesignTokenRegistry({
        schemaVersion: 1,
        tokens: [defaultDesignTokens.tokens[0], defaultDesignTokens.tokens[0]],
      }),
    ).toThrowError(DesignTokenError);
  });
});
