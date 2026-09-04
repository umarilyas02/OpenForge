import { buildProjectIndex } from "@openforge/compiler";
import { describe, expect, it } from "vitest";

import { componentPathForBlock } from "../src/lib/block-files.js";
import { parsePageToBlockTree } from "../src/lib/source-content-tree.js";
import { buildStarterFiles } from "../src/lib/starter-template.js";

describe("parsePageToBlockTree", () => {
  it("parses the generated starter page into the canvas's node tree shape", async () => {
    const files = await buildStarterFiles({
      name: "Verify Parse Site",
      slug: "verify-parse-site",
    });

    const tree = parsePageToBlockTree(files, "app/page.jsx");

    expect(tree).toHaveLength(2);
    expect(tree[0]).toMatchObject({
      blockId: "openforge-cms.hero",
      blockVersion: 1,
      props: {
        heading: "Welcome to Verify Parse Site",
        ctaLabel: "Get started",
        ctaHref: "#",
      },
      slots: {},
    });
    expect(tree[1]).toMatchObject({
      blockId: "openforge-cms.rich-text",
      blockVersion: 1,
      props: {
        content:
          "Edit this page from the admin, or right here in the code — they stay in sync.",
      },
      slots: {},
    });
  });

  it("assigns each node the exact id buildProjectIndex gives that JSX element", async () => {
    const files = await buildStarterFiles({
      name: "Id Check Site",
      slug: "id-check-site",
    });
    const tree = parsePageToBlockTree(files, "app/page.jsx");
    const index = buildProjectIndex({ files });
    const pageNodeIds = new Set(
      index.nodes
        .filter((node) => node.filePath === "app/page.jsx")
        .map((node) => node.id),
    );

    for (const node of tree) {
      expect(node.id).toBeTruthy();
      expect(pageNodeIds.has(node.id)).toBe(true);
    }
  });

  it("recurses into a block's single named slot, matching its definition's slot name", () => {
    const files = [
      { path: "package.json", source: '{"name":"slot-test"}' },
      {
        path: "app/page.jsx",
        source: `import Accordion from "../${componentPathForBlock("openforge-cms.accordion")}";
import FaqItem from "../${componentPathForBlock("openforge-cms.faq-item")}";

export default function Page() {
  return (
    <Accordion>
      <FaqItem question="Q1" answer="A1" />
      <FaqItem question="Q2" answer="A2" />
    </Accordion>
  );
}
`,
      },
    ];

    const tree = parsePageToBlockTree(files, "app/page.jsx");

    expect(tree).toHaveLength(1);
    expect(tree[0].blockId).toBe("openforge-cms.accordion");
    expect(tree[0].slots.items).toHaveLength(2);
    expect(tree[0].slots.items[0]).toMatchObject({
      blockId: "openforge-cms.faq-item",
      props: { question: "Q1", answer: "A1" },
    });
    expect(tree[0].slots.items[0].id).toBeTruthy();
  });

  it("skips JSX elements that don't resolve to a known components/openforge block", () => {
    const files = [
      { path: "package.json", source: '{"name":"skip-test"}' },
      {
        path: "app/page.jsx",
        source: `import RichText from "../${componentPathForBlock("openforge-cms.rich-text")}";

export default function Page() {
  return (
    <div className="wrapper">
      <RichText content="kept" />
    </div>
  );
}
`,
      },
    ];

    const tree = parsePageToBlockTree(files, "app/page.jsx");
    expect(tree).toEqual([]);
  });

  it("throws when the page path doesn't exist in the given files", () => {
    expect(() => parsePageToBlockTree([], "app/missing/page.jsx")).toThrow(
      /not found/i,
    );
  });
});
