import {
  OFFICIAL_CMS_BLOCKS,
  createCmsBlockRegistry,
} from "@openforge/cms-blocks";
import { createTheme } from "@openforge/theme-sdk";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";

import { RendererError } from "../src/errors.js";
import { createRenderer } from "../src/renderer.js";

const blockRegistry = createCmsBlockRegistry(OFFICIAL_CMS_BLOCKS);

const theme = createTheme({
  manifest: {
    schemaVersion: 1,
    id: "openforge-theme.test",
    name: "Test Theme",
    version: "1.0.0",
    description: "A theme used only in tests.",
    regions: [
      {
        key: "page-body",
        label: "Page body",
        allowedBlockIds: [
          "openforge-cms.hero",
          "openforge-cms.rich-text",
          "openforge-cms.columns",
        ],
      },
    ],
    templateNames: ["page"],
    defaultTokenOverrides: {},
  },
  templates: { page: () => null },
  blockComponents: blockRegistry.componentsById(),
});

function markup(element) {
  return renderToStaticMarkup(element);
}

describe("createRenderer", () => {
  it("renders a simple content tree", () => {
    const renderer = createRenderer({ theme, blockRegistry });

    const html = markup(
      renderer.renderTree([
        {
          blockId: "openforge-cms.hero",
          blockVersion: 1,
          props: { heading: "Hello" },
        },
      ]),
    );

    expect(html).toContain("Hello");
  });

  it("renders nested slot content recursively", () => {
    const renderer = createRenderer({ theme, blockRegistry });

    const html = markup(
      renderer.renderTree([
        {
          blockId: "openforge-cms.columns",
          blockVersion: 1,
          props: { heading: "Features" },
          slots: {
            items: [
              {
                blockId: "openforge-cms.rich-text",
                blockVersion: 1,
                props: { content: "Column one" },
              },
              {
                blockId: "openforge-cms.rich-text",
                blockVersion: 1,
                props: { content: "Column two" },
              },
            ],
          },
        },
      ]),
    );

    expect(html).toContain("Features");
    expect(html).toContain("Column one");
    expect(html).toContain("Column two");
  });

  it("rejects an unknown block id", () => {
    const renderer = createRenderer({ theme, blockRegistry });

    expect(() =>
      renderer.renderTree([
        { blockId: "openforge-cms.does-not-exist", blockVersion: 1, props: {} },
      ]),
    ).toThrow();
  });

  it("rejects a node that fails required-prop validation", () => {
    const renderer = createRenderer({ theme, blockRegistry });

    expect(() =>
      renderer.renderTree([
        { blockId: "openforge-cms.hero", blockVersion: 1, props: {} },
      ]),
    ).toThrow(/missing required props/u);
  });

  it("rejects an empty top-level tree", () => {
    const renderer = createRenderer({ theme, blockRegistry });

    expect(() => renderer.renderTree([])).toThrow(RendererError);
  });

  it("calls wrapNode with the correct path for every node, including nested slot children", () => {
    const calls = [];
    const renderer = createRenderer({
      theme,
      blockRegistry,
      wrapNode: (element, path, migrated) => {
        calls.push({ path, blockId: migrated.blockId });
        return element;
      },
    });

    markup(
      renderer.renderTree([
        {
          blockId: "openforge-cms.hero",
          blockVersion: 1,
          props: { heading: "Hello" },
        },
        {
          blockId: "openforge-cms.columns",
          blockVersion: 1,
          props: { heading: "Features" },
          slots: {
            items: [
              {
                blockId: "openforge-cms.rich-text",
                blockVersion: 1,
                props: { content: "Column one" },
              },
            ],
          },
        },
      ]),
    );

    expect(calls).toEqual([
      { path: [0], blockId: "openforge-cms.hero" },
      { path: [1, "slots", "items", 0], blockId: "openforge-cms.rich-text" },
      { path: [1], blockId: "openforge-cms.columns" },
    ]);
  });

  it("renders byte-identical output whether or not wrapNode is provided", () => {
    const tree = [
      {
        blockId: "openforge-cms.hero",
        blockVersion: 1,
        props: { heading: "Hello" },
      },
    ];

    const withoutHook = markup(
      createRenderer({ theme, blockRegistry }).renderTree(tree),
    );
    const withPassthroughHook = markup(
      createRenderer({
        theme,
        blockRegistry,
        wrapNode: (element) => element,
      }).renderTree(tree),
    );

    expect(withPassthroughHook).toBe(withoutHook);
  });
});
