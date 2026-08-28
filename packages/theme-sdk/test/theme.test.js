import { describe, expect, it } from "vitest";

import { ThemeError } from "../src/errors.js";
import { createTheme } from "../src/theme.js";

const Hero = () => null;
const RichText = () => null;
const PageTemplate = () => null;

const VALID_MANIFEST = {
  schemaVersion: 1,
  id: "openforge-theme.default",
  name: "Default",
  version: "1.0.0",
  description: "The default OpenForge CMS theme.",
  regions: [
    {
      key: "page-body",
      label: "Page body",
      allowedBlockIds: ["openforge-cms.hero", "openforge-cms.rich-text"],
    },
  ],
  templateNames: ["page"],
  defaultTokenOverrides: {},
};

describe("createTheme", () => {
  it("builds a theme when every template and block component is provided", () => {
    const theme = createTheme({
      manifest: VALID_MANIFEST,
      templates: { page: PageTemplate },
      blockComponents: {
        "openforge-cms.hero": Hero,
        "openforge-cms.rich-text": RichText,
      },
    });

    expect(theme.getTemplate("page")).toBe(PageTemplate);
    expect(theme.getBlockComponent("openforge-cms.hero")).toBe(Hero);
    expect(
      theme.isBlockAllowedInRegion("page-body", "openforge-cms.hero"),
    ).toBe(true);
    expect(theme.isBlockAllowedInRegion("page-body", "openforge-cms.cta")).toBe(
      false,
    );
  });

  it("rejects a theme missing a declared template", () => {
    expect(() =>
      createTheme({
        manifest: VALID_MANIFEST,
        templates: {},
        blockComponents: {
          "openforge-cms.hero": Hero,
          "openforge-cms.rich-text": RichText,
        },
      }),
    ).toThrow(ThemeError);
  });

  it("rejects a theme whose region references an unregistered block", () => {
    expect(() =>
      createTheme({
        manifest: VALID_MANIFEST,
        templates: { page: PageTemplate },
        blockComponents: { "openforge-cms.hero": Hero },
      }),
    ).toThrow(ThemeError);
  });

  it("throws for an unknown region", () => {
    const theme = createTheme({
      manifest: VALID_MANIFEST,
      templates: { page: PageTemplate },
      blockComponents: {
        "openforge-cms.hero": Hero,
        "openforge-cms.rich-text": RichText,
      },
    });

    expect(() => theme.getRegion("footer")).toThrow(ThemeError);
  });
});
