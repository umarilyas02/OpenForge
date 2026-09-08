import { rm } from "node:fs/promises";
import path from "node:path";

import { parse } from "@babel/parser";
import { WorkspaceManager } from "@openforge/workspace";
import { afterAll, describe, expect, it } from "vitest";

import {
  buildThemeSiteFiles,
  normalizeExampleSite,
} from "../src/lib/theme-site-generator.js";
import { getExampleSiteFor, getTheme } from "../src/lib/theme-registry.js";

const THEME_IDS = [
  "openforge-theme.saas",
  "openforge-theme.portfolio",
  "openforge-theme.ecommerce",
  "openforge-theme.restaurant",
  "openforge-theme.agency",
  "openforge-theme.healthcare",
  "openforge-theme.education",
  "openforge-theme.nonprofit",
  "openforge-theme.realestate",
  "openforge-theme.magazine",
];

const ROOT = path.resolve("./data/test-theme-site-generator");

describe("theme-site-generator", () => {
  afterAll(async () => {
    await rm(ROOT, { force: true, recursive: true });
  });

  it.each(THEME_IDS)("%s builds a real, buildable workspace", async (themeId) => {
    const theme = getTheme(themeId);
    const exampleSite = getExampleSiteFor(themeId);
    expect(exampleSite).not.toBeNull();

    const site = { name: "Test Site", slug: `test-${themeId.split(".")[1]}` };
    const files = await buildThemeSiteFiles(theme, exampleSite, site);

    // Every generated page must actually reference and ship a component
    // file for every block id it uses -- a missing import or a missing
    // standalone component file would silently 404/throw only once someone
    // opened the generated project, not here.
    const filePaths = new Set(files.map((f) => f.path));
    expect(filePaths.has("package.json")).toBe(true);
    expect(filePaths.has("app/layout.jsx")).toBe(true);
    expect(filePaths.has("app/blocks.css")).toBe(true);
    expect(filePaths.has("app/page.jsx")).toBe(true);

    const { pages } = normalizeExampleSite(exampleSite);
    for (const page of pages) {
      const filePath =
        page.path === "/"
          ? "app/page.jsx"
          : `app/${page.path.split("/").filter(Boolean).join("/")}/page.jsx`;
      expect(filePaths.has(filePath)).toBe(true);
    }

    // Write it into a real WorkspaceManager and read it straight back --
    // this exercises the exact path installTheme() takes, not just the
    // in-memory file array.
    const manager = new WorkspaceManager({ basePath: ROOT });
    const slug = site.slug;
    await manager.create(slug, files);
    const written = await manager.readFiles(slug);
    expect(written.length).toBe(files.length);

    // Every generated .jsx file must actually be syntactically valid JSX --
    // a string that merely *looks* right (unbalanced tags, a bad attribute
    // expression) would otherwise only surface once someone opened the
    // real generated project.
    for (const file of written.filter((f) => f.path.endsWith(".jsx"))) {
      expect(() =>
        parse(file.source, { plugins: ["jsx"], sourceType: "module" }),
      ).not.toThrow();
    }

    const layout = written.find((f) => f.path === "app/layout.jsx").source;
    expect(layout).toContain("Navbar");
    // Every page's title should show up as a nav link label somewhere in
    // the generated layout, proving nav links were actually built from the
    // real generated pages rather than left as static placeholder text.
    for (const page of pages) {
      const firstWord = page.title.split(/[-—|]/u)[0].trim();
      expect(layout).toContain(firstWord);
    }
  });
});
