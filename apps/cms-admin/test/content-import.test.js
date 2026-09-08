import { describe, expect, it } from "vitest";

import {
  parseImportFile,
  parseJsonImport,
  parseMarkdownImport,
} from "../src/lib/content-import.js";

describe("parseMarkdownImport", () => {
  it("reads frontmatter fields and strips Markdown syntax from the body", () => {
    const [entry] = parseMarkdownImport(
      [
        "---",
        "title: Hello World",
        "slug: hello-world",
        "type: page",
        "status: published",
        "---",
        "",
        "# Hello World",
        "",
        "This is **bold** and this is [a link](https://example.com).",
      ].join("\n"),
    );

    expect(entry.title).toBe("Hello World");
    expect(entry.slug).toBe("hello-world");
    expect(entry.type).toBe("page");
    expect(entry.status).toBe("published");
    expect(entry.body).toContain("Hello World");
    expect(entry.body).toContain("This is bold and this is a link.");
    expect(entry.body).not.toContain("**");
    expect(entry.body).not.toContain("[a link]");
  });

  it("falls back to the first body line as the title with no frontmatter", () => {
    const [entry] = parseMarkdownImport("Just a plain paragraph.\n\nAnd another.");
    expect(entry.title).toBe("Just a plain paragraph.");
    expect(entry.type).toBe("post");
    expect(entry.status).toBe("draft");
  });

  it("falls back to the provided filename when the body is empty", () => {
    const [entry] = parseMarkdownImport("---\ntitle:\n---\n", "my-file");
    const [untitled] = parseMarkdownImport("", "my-file");
    expect(untitled.title).toBe("my-file");
    expect(entry).toBeDefined();
  });

  it("always returns exactly one entry", () => {
    expect(parseMarkdownImport("# One\n\nBody.")).toHaveLength(1);
  });
});

describe("parseJsonImport", () => {
  it("normalizes a JSON array of entries", () => {
    const entries = parseJsonImport(
      JSON.stringify([
        { title: "First", type: "page", status: "published", body: "Hi." },
        { title: "Second" },
      ]),
    );

    expect(entries).toHaveLength(2);
    expect(entries[0]).toMatchObject({
      title: "First",
      type: "page",
      status: "published",
      body: "Hi.",
    });
    expect(entries[1]).toMatchObject({ title: "Second", type: "post", status: "draft" });
  });

  it("accepts a single object as well as an array", () => {
    const entries = parseJsonImport(JSON.stringify({ title: "Solo" }));
    expect(entries).toHaveLength(1);
    expect(entries[0].title).toBe("Solo");
  });

  it("throws with a 1-indexed position when an entry has no title", () => {
    expect(() =>
      parseJsonImport(JSON.stringify([{ title: "Ok" }, { body: "No title" }])),
    ).toThrow(/Entry 2/u);
  });

  it("throws on invalid JSON", () => {
    expect(() => parseJsonImport("not json")).toThrow();
  });
});

describe("parseImportFile", () => {
  it("dispatches .json files to the JSON parser", () => {
    const entries = parseImportFile("posts.json", JSON.stringify([{ title: "A" }]));
    expect(entries).toEqual(parseJsonImport(JSON.stringify([{ title: "A" }])));
  });

  it("treats any other extension as Markdown/plain text", () => {
    const entries = parseImportFile("notes.txt", "Some plain text.");
    expect(entries).toHaveLength(1);
    expect(entries[0].title).toBe("Some plain text.");
  });
});
