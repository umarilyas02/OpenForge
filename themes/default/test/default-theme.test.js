import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { defaultTheme } from "../src/index.js";

describe("default theme", () => {
  it("registers all three declared templates", () => {
    expect(() => defaultTheme.getTemplate("page")).not.toThrow();
    expect(() => defaultTheme.getTemplate("post")).not.toThrow();
    expect(() => defaultTheme.getTemplate("notFound")).not.toThrow();
  });

  it("resolves every block referenced by a region", () => {
    for (const region of defaultTheme.manifest.regions) {
      for (const blockId of region.allowedBlockIds) {
        expect(() => defaultTheme.getBlockComponent(blockId)).not.toThrow();
      }
    }
  });

  it("renders the page template with page metadata and body content", () => {
    const PageTemplate = defaultTheme.getTemplate("page");
    const html = renderToStaticMarkup(
      createElement(
        PageTemplate,
        { page: { title: "About Us" } },
        createElement("p", null, "Body content"),
      ),
    );

    expect(html).toContain("About Us");
    expect(html).toContain("Body content");
  });

  it("renders the post template with a formatted published date", () => {
    const PostTemplate = defaultTheme.getTemplate("post");
    const html = renderToStaticMarkup(
      createElement(PostTemplate, {
        page: { title: "Launch Day", publishedAt: "2026-08-28T00:00:00.000Z" },
      }),
    );

    expect(html).toContain("Launch Day");
    expect(html).toContain("2026");
  });

  it("renders the not-found template", () => {
    const NotFoundTemplate = defaultTheme.getTemplate("notFound");
    const html = renderToStaticMarkup(createElement(NotFoundTemplate));

    expect(html).toContain("Page not found");
  });
});
