import { randomBytes } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  AssetError,
  createAssetManager,
  createAssetUrlSigner,
  createMemoryAssetStorage,
  sniffImageMimeType,
  validateAssetUpload,
} from "../src/index.js";

const PNG_BYTES = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=",
  "base64",
);

describe("asset upload policy", () => {
  it("checks actual byte signatures instead of trusting browser MIME data", () => {
    expect(sniffImageMimeType(PNG_BYTES)).toBe("image/png");
    expect(
      validateAssetUpload({
        originalName: "pixel.png",
        mimeType: "image/png",
        bytes: PNG_BYTES,
      }),
    ).toMatchObject({ size: PNG_BYTES.length });

    expect(() =>
      validateAssetUpload({
        originalName: "pixel.jpg",
        mimeType: "image/jpeg",
        bytes: PNG_BYTES,
      }),
    ).toThrowError(
      expect.objectContaining({ code: "OF_ASSET_SIGNATURE_MISMATCH" }),
    );
    expect(() =>
      validateAssetUpload({
        originalName: "../pixel.png",
        mimeType: "image/png",
        bytes: PNG_BYTES,
      }),
    ).toThrowError(expect.objectContaining({ code: "OF_ASSET_NAME_INVALID" }));
  });
});

describe("asset manager", () => {
  it("stores analyzed originals and variants with complete metadata", async () => {
    const { manager, storage } = fixture();
    const result = await manager.upload({
      projectId: "project_1",
      originalName: "pixel.png",
      mimeType: "image/png",
      bytes: PNG_BYTES,
      altText: "Orange product mark",
    });

    expect(result).toMatchObject({
      duplicate: false,
      asset: {
        id: expect.stringMatching(/^asset_[a-f0-9]{16}$/u),
        width: 1,
        height: 1,
        altText: "Orange product mark",
        altStatus: "provided",
        variants: [
          {
            name: "w640",
            mimeType: "image/webp",
            width: 1,
            height: 1,
          },
        ],
      },
    });
    expect(await storage.getObject(result.asset.originalKey)).toMatchObject({
      bytes: PNG_BYTES,
    });
    expect(await storage.getObject(result.asset.variants[0].key)).toMatchObject(
      { metadata: { mimeType: "image/webp" } },
    );
  });

  it("deduplicates by project-scoped SHA-256 without analyzing twice", async () => {
    let calls = 0;
    const { manager } = fixture({
      analyze: async () => {
        calls += 1;
        return analysis();
      },
    });
    const input = {
      projectId: "project_1",
      originalName: "pixel.png",
      mimeType: "image/png",
      bytes: PNG_BYTES,
    };
    const first = await manager.upload(input);
    const duplicate = await manager.upload({
      ...input,
      originalName: "copy.png",
    });

    expect(first.duplicate).toBe(false);
    expect(duplicate).toMatchObject({
      duplicate: true,
      asset: { id: first.asset.id },
    });
    expect(calls).toBe(1);
  });

  it("updates alt text and reports used and unused assets", async () => {
    const { manager } = fixture();
    const first = await manager.upload({
      projectId: "project_1",
      originalName: "pixel.png",
      mimeType: "image/png",
      bytes: PNG_BYTES,
    });
    const secondBytes = Buffer.concat([PNG_BYTES, Buffer.from("different")]);
    const second = await manager.upload({
      projectId: "project_1",
      originalName: "other.png",
      mimeType: "image/png",
      bytes: secondBytes,
      altText: "Other",
    });
    const updated = await manager.updateAltText({
      projectId: "project_1",
      assetId: first.asset.id,
      altText: "One pixel",
    });
    expect(updated).toMatchObject({
      altText: "One pixel",
      altStatus: "provided",
    });

    const report = await manager.getUsageReport({
      projectId: "project_1",
      files: [
        {
          path: "components/Hero.jsx",
          source: `export const src = ${JSON.stringify(first.asset.sourcePath)};`,
        },
      ],
    });
    expect(
      report.assets.find(({ assetId }) => assetId === first.asset.id),
    ).toMatchObject({
      used: true,
      references: [{ filePath: "components/Hero.jsx", line: 1 }],
    });
    expect(report.unused).toEqual([second.asset.id]);
  });

  it("creates expiring signed access scoped to the requested project", async () => {
    const clock = () => 1_800_000_000_000;
    const { manager, signer } = fixture({ clock });
    const uploaded = await manager.upload({
      projectId: "project_1",
      originalName: "pixel.png",
      mimeType: "image/png",
      bytes: PNG_BYTES,
    });
    const access = await manager.getSignedAccess({
      projectId: "project_1",
      assetId: uploaded.asset.id,
      variant: "w640",
      ttlSeconds: 120,
    });
    const url = new URL(access.url);

    expect(
      signer.verify({
        key: uploaded.asset.variants[0].key,
        expires: Number(url.searchParams.get("expires")),
        candidateSignature: url.searchParams.get("signature"),
      }),
    ).toBe(true);
    await expect(
      manager.getSignedAccess({
        projectId: "project_2",
        assetId: uploaded.asset.id,
      }),
    ).rejects.toMatchObject({ code: "OF_ASSET_NOT_FOUND" });
  });

  it("rejects invalid analyzer output before storing an asset record", async () => {
    const { manager } = fixture({
      analyze: async () => ({
        width: 100_000,
        height: 100_000,
        variants: [],
      }),
    });
    await expect(
      manager.upload({
        projectId: "project_1",
        originalName: "pixel.png",
        mimeType: "image/png",
        bytes: PNG_BYTES,
      }),
    ).rejects.toMatchObject({ code: "OF_ASSET_ANALYSIS_INVALID" });
  });
});

describe("signed asset access", () => {
  it("rejects short secrets, broad keys, excessive TTLs, and tampering", () => {
    expect(() =>
      createAssetUrlSigner({
        secret: Buffer.from("short"),
        baseUrl: "https://assets.example.test/",
      }),
    ).toThrowError(AssetError);

    const signer = createAssetUrlSigner({
      secret: randomBytes(32),
      baseUrl: "https://assets.example.test/",
      clock: () => 1_800_000_000_000,
    });
    expect(() =>
      signer.sign({ key: "../secret", ttlSeconds: 60 }),
    ).toThrowError(expect.objectContaining({ code: "OF_ASSET_KEY_INVALID" }));
    expect(() =>
      signer.sign({
        key: "projects/a/assets/asset_x/original/a.png",
        ttlSeconds: 7200,
      }),
    ).toThrowError(expect.objectContaining({ code: "OF_ASSET_TTL_INVALID" }));
    expect(
      signer.verify({
        key: "projects/a/assets/asset_x/original/a.png",
        expires: 1_800_000_120,
        candidateSignature: "tampered",
      }),
    ).toBe(false);
  });
});

function analysis() {
  return {
    width: 1,
    height: 1,
    variants: [
      {
        name: "w640",
        mimeType: "image/webp",
        width: 1,
        height: 1,
        bytes: Buffer.from("webp-variant"),
      },
    ],
  };
}

function fixture({ analyze = async () => analysis(), clock } = {}) {
  const storage = createMemoryAssetStorage();
  const signer = createAssetUrlSigner({
    secret: Buffer.alloc(32, 7),
    baseUrl: "https://assets.example.test/content/",
    ...(clock ? { clock } : {}),
  });
  const manager = createAssetManager({
    storage,
    analyze,
    signer,
    ...(clock ? { clock: () => new Date(clock()) } : {}),
  });
  return { manager, signer, storage };
}
