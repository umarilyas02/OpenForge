import { defaultDesignTokens } from "@openforge/design-tokens";
import { describe, expect, it } from "vitest";

import { renderSiteStyles } from "../src/site-styles.js";

describe("renderSiteStyles", () => {
  it("emits base token CSS with no overrides", () => {
    const css = renderSiteStyles({ baseTokens: defaultDesignTokens });
    expect(css).toContain(":root {");
    expect(css).toContain("--of-color-ink:");
  });

  it("overrides a known token's value", () => {
    const css = renderSiteStyles({
      baseTokens: defaultDesignTokens,
      overrides: { "color.ink": "#010101" },
    });
    expect(css).toContain("--of-color-ink: #010101;");
  });

  it("ignores an override for an unknown token name", () => {
    const css = renderSiteStyles({
      baseTokens: defaultDesignTokens,
      overrides: { "color.does-not-exist": "#010101" },
    });
    expect(css).not.toContain("#010101");
  });
});
