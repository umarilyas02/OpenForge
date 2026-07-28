import path from "node:path";

export const DEFAULT_ASSET_POLICY = Object.freeze({
  maxUploadBytes: 10 * 1024 * 1024,
  maxPixels: 24_000_000,
  variantWidths: Object.freeze([640, 1280]),
  allowedMimeTypes: Object.freeze(["image/png", "image/jpeg", "image/webp"]),
});

export class AssetError extends Error {
  constructor(code, message, details = {}) {
    super(message);
    this.name = "AssetError";
    this.code = code;
    this.details = details;
  }
}

export function validateAssetUpload(
  { originalName, mimeType, bytes },
  policy = DEFAULT_ASSET_POLICY,
) {
  if (!Buffer.isBuffer(bytes) || bytes.length === 0) {
    throw new AssetError(
      "OF_ASSET_EMPTY",
      "Asset upload must contain non-empty bytes.",
    );
  }
  if (bytes.length > policy.maxUploadBytes) {
    throw new AssetError(
      "OF_ASSET_TOO_LARGE",
      `Asset exceeds the ${policy.maxUploadBytes} byte upload limit.`,
    );
  }
  if (
    typeof originalName !== "string" ||
    originalName.length === 0 ||
    originalName.length > 160 ||
    path.basename(originalName) !== originalName ||
    /[<>:"/\\|?*]/u.test(originalName) ||
    hasUnsafeControlCharacters(originalName)
  ) {
    throw new AssetError(
      "OF_ASSET_NAME_INVALID",
      "Asset name is empty, unsafe, or contains a path.",
    );
  }
  if (!policy.allowedMimeTypes.includes(mimeType)) {
    throw new AssetError(
      "OF_ASSET_TYPE_UNSUPPORTED",
      `Unsupported asset type: "${mimeType}".`,
    );
  }
  const detectedMimeType = sniffImageMimeType(bytes);
  if (detectedMimeType !== mimeType) {
    throw new AssetError(
      "OF_ASSET_SIGNATURE_MISMATCH",
      "Declared asset type does not match its byte signature.",
      { declared: mimeType, detected: detectedMimeType },
    );
  }
  return {
    originalName,
    mimeType,
    size: bytes.length,
  };
}

export function sniffImageMimeType(bytes) {
  if (
    bytes.length >= 8 &&
    bytes.subarray(0, 8).equals(Buffer.from("89504e470d0a1a0a", "hex"))
  ) {
    return "image/png";
  }
  if (
    bytes.length >= 3 &&
    bytes[0] === 0xff &&
    bytes[1] === 0xd8 &&
    bytes[2] === 0xff
  ) {
    return "image/jpeg";
  }
  if (
    bytes.length >= 12 &&
    bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
    bytes.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }
  return null;
}

export function normalizeAltText(value) {
  if (
    typeof value !== "string" ||
    value.length > 500 ||
    [...value].some((character) => {
      const code = character.codePointAt(0);
      return code < 32 && ![9, 10, 13].includes(code);
    })
  ) {
    throw new AssetError(
      "OF_ASSET_ALT_INVALID",
      "Alt text must be a safe string no longer than 500 characters.",
    );
  }
  return value.trim();
}

function hasUnsafeControlCharacters(value) {
  return [...value].some((character) => character.codePointAt(0) < 32);
}
