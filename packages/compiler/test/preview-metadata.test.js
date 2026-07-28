import { describe, expect, it } from "vitest";

import { injectPreviewMetadata } from "../src/index.js";

describe("injectPreviewMetadata", () => {
  it("maps host JSX elements without rewriting component calls", () => {
    const source = `
      export function Hero() {
        return <section><h1>Hello</h1><Action /></section>;
      }
    `;
    const result = injectPreviewMetadata({
      filePath: "components/Hero.jsx",
      source,
    });

    expect(result.mappedNodeIds).toHaveLength(2);
    expect(result.source).toContain("<section data-openforge-node=");
    expect(result.source).toContain("<h1 data-openforge-node=");
    expect(result.source).toContain("<Action />");
    expect(result.source).toContain(
      'data-openforge-file="components/Hero.jsx"',
    );
    expect(result.source).toContain("data-openforge-component=");
    expect(result.source).toContain("data-openforge-source=");
  });

  it("leaves code-only source byte-identical", () => {
    const source =
      'import React from "react";\nexport const Legacy = ({ tag }) => React.createElement(tag, null, "Legacy");\n';
    expect(
      injectPreviewMetadata({
        filePath: "components/Legacy.jsx",
        source,
      }),
    ).toEqual({ source, mappedNodeIds: [] });
  });

  it("rejects user source that spoofs reserved metadata", () => {
    expect(() =>
      injectPreviewMetadata({
        filePath: "app/page.jsx",
        source:
          'export default function Page() { return <main data-openforge-node="spoofed" />; }',
      }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_PREVIEW_METADATA_RESERVED" }),
    );
  });

  it("is deterministic for identical source", () => {
    const input = {
      filePath: "app/page.jsx",
      source: "export default function Page() { return <main>Hello</main>; }",
    };
    expect(injectPreviewMetadata(input)).toEqual(injectPreviewMetadata(input));
  });
});
