import { describe, expect, it } from "vitest";

import { createTheme } from "../src/theme.js";
import { createThemeRegistry } from "../src/registry.js";
import { ThemeError } from "../src/errors.js";

const Hero = () => null;
const PageTemplate = () => null;

const MANIFEST = {
  schemaVersion: 1,
  id: "openforge-theme.default",
  name: "Default",
  version: "1.0.0",
  description: "The default OpenForge CMS theme.",
  regions: [
    {
      key: "page-body",
      label: "Page body",
      allowedBlockIds: ["openforge-cms.hero"],
    },
  ],
  templateNames: ["page"],
  defaultTokenOverrides: {},
};

function buildTheme() {
  return createTheme({
    manifest: MANIFEST,
    templates: { page: PageTemplate },
    blockComponents: { "openforge-cms.hero": Hero },
  });
}

describe("createThemeRegistry", () => {
  it("registers and retrieves a theme by id", () => {
    const registry = createThemeRegistry();
    registry.register(buildTheme());

    expect(registry.get("openforge-theme.default").manifest.name).toBe(
      "Default",
    );
  });

  it("rejects registering the same theme id twice", () => {
    const registry = createThemeRegistry();
    registry.register(buildTheme());

    expect(() => registry.register(buildTheme())).toThrow(ThemeError);
  });

  it("throws for an unknown theme id", () => {
    const registry = createThemeRegistry();
    expect(() => registry.get("openforge-theme.missing")).toThrow(ThemeError);
  });

  it("lists registered theme manifests", () => {
    const registry = createThemeRegistry();
    registry.register(buildTheme());

    expect(registry.list()).toHaveLength(1);
    expect(registry.list()[0].id).toBe("openforge-theme.default");
  });
});
