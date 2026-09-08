import { createHash } from "node:crypto";

import { analyzeSourceCompatibility } from "@openforge/compiler";
import { auditOfficialBlockDefinitions } from "@openforge/editor";
import { describe, expect, it } from "vitest";

import {
  BLOCK_SCHEMA_VERSION,
  BlockRegistryError,
  createBlockRegistry,
  officialBlockRegistry,
  officialBlocks,
} from "../src/index.js";

describe("official block registry", () => {
  it("publishes ten valid, deterministic landing-page blocks", () => {
    const blocks = officialBlockRegistry.list();

    expect(blocks).toHaveLength(10);
    expect(blocks.map(({ id }) => id)).toEqual(
      [...blocks.map(({ id }) => id)].sort(),
    );
    expect(new Set(blocks.map(({ id }) => id))).toHaveLength(10);
    expect(blocks.every(({ schemaVersion }) => schemaVersion === 1)).toBe(true);
    expect(blocks.every(({ accessibility }) => accessibility.length > 0)).toBe(
      true,
    );
  });

  it("keeps every golden source compatible and stable", () => {
    const golden = officialBlockRegistry.list().map((block) => ({
      id: block.id,
      version: block.version,
      hash: createHash("sha256").update(block.source).digest("hex"),
      compatibility: analyzeSourceCompatibility({
        filePath: `components/openforge/${block.fileName}`,
        source: block.source,
      }).level,
    }));

    expect(golden).toEqual([
      // Updated deliberately when an official block source changes.
      {
        compatibility: "supported",
        hash: "a433eba8a44ece7ac5b1ed32b88245c90a274f9498e372ffa24063fc14dbc930",
        id: "openforge.cta",
        version: 1,
      },
      {
        compatibility: "supported",
        hash: "5259aa0e3adaeef3e4756664944f614cca5ea6a6714c8a71ab98630532850627",
        id: "openforge.faq",
        version: 1,
      },
      {
        compatibility: "supported",
        hash: "18239b03adeb92f97573eb1e6ef9acb86c2cd08aa2ee35731732868a1440b593",
        id: "openforge.features",
        version: 1,
      },
      {
        compatibility: "supported",
        hash: "093b218a20bd51b090579371c9910e04fd886d2302467671bf281d9af1fb347d",
        id: "openforge.footer",
        version: 1,
      },
      {
        compatibility: "supported",
        hash: "d6a0e899631c6a80cc816d97cf1213906b252739e3a8ce02532b755958e12793",
        id: "openforge.header",
        version: 1,
      },
      {
        compatibility: "supported",
        hash: "4de602691a2733c243a67326ef6d38614955cd53f466954105681dbfad2f954b",
        id: "openforge.hero",
        version: 2,
      },
      {
        compatibility: "supported",
        hash: "bec93f6e1eea1bf53a17866f7c207f6dcf4c234f52c85c4ce9eca5f2dad4a88f",
        id: "openforge.logo-cloud",
        version: 1,
      },
      {
        compatibility: "supported",
        hash: "e43af62108c2e20e6841c388ffbce1f8efef97c49aea083391a9fadc6d51899b",
        id: "openforge.pricing",
        version: 1,
      },
      {
        compatibility: "supported",
        hash: "d461f545772ef32ce44b50d2476610a3b819911a088bd31018e3f5e699e65dd2",
        id: "openforge.stats",
        version: 1,
      },
      {
        compatibility: "supported",
        hash: "28677cabf6b4c56c71529055c1f7c8f8041c83012ee746b22e23b1de984a8849",
        id: "openforge.testimonials",
        version: 1,
      },
    ]);
  });

  it("searches metadata and returns preview-safe summaries", () => {
    expect(
      officialBlockRegistry.search("customer trust").map(({ id }) => id),
    ).toEqual(["openforge.logo-cloud"]);

    const preview = officialBlockRegistry.preview("openforge.hero");
    expect(preview).toMatchObject({
      id: "openforge.hero",
      label: "Editorial hero",
      tone: "light",
    });
    expect(preview).not.toHaveProperty("source");
  });

  it("creates portable component and stylesheet insertion artifacts", () => {
    const insertion =
      officialBlockRegistry.createInsertion("openforge.features");

    expect(insertion).toMatchObject({
      schemaVersion: BLOCK_SCHEMA_VERSION,
      blockId: "openforge.features",
      blockVersion: 1,
      import: {
        source: "@/components/openforge/Features",
        imported: "Features",
      },
      jsx: "<Features />",
    });
    expect(insertion.files.map(({ path }) => path)).toEqual([
      "components/openforge/Features.jsx",
      "components/openforge/openforge-blocks.css",
    ]);
  });

  it("migrates old instances without mutating caller data", () => {
    const original = {
      blockId: "openforge.hero",
      blockVersion: 1,
      props: { ctaText: "Join now" },
    };
    const migrated = officialBlockRegistry.migrateInstance(original);

    expect(migrated).toEqual({
      blockId: "openforge.hero",
      blockVersion: 2,
      props: {
        primaryActionLabel: "Join now",
        secondaryActionLabel: "See how it works",
      },
    });
    expect(original.props).toEqual({ ctaText: "Join now" });
  });

  it("rejects duplicate definitions and unknown block ids", () => {
    expect(() =>
      createBlockRegistry([officialBlocks[0], officialBlocks[0]]),
    ).toThrowError(BlockRegistryError);
    expect(() => officialBlockRegistry.get("openforge.missing")).toThrowError(
      expect.objectContaining({ code: "OF_BLOCK_NOT_FOUND" }),
    );
  });

  it("passes the official source-level accessibility contract", () => {
    expect(auditOfficialBlockDefinitions(officialBlocks)).toEqual([]);
  });
});
