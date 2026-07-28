import { spawn } from "node:child_process";

import { AssetError } from "./asset-policy.js";

export function createPythonAssetAnalyzer({
  command,
  scriptPath,
  timeoutMs = 5000,
  maxOutputBytes = 24 * 1024 * 1024,
}) {
  if (!command || !scriptPath) {
    throw new TypeError(
      "Python command and analyzer script path are required.",
    );
  }

  return async function analyze({ bytes, mimeType, maxPixels, variantWidths }) {
    const args = [
      scriptPath,
      "--mime",
      mimeType,
      "--max-pixels",
      String(maxPixels),
      "--widths",
      variantWidths.join(","),
    ];

    return new Promise((resolve, reject) => {
      const child = spawn(command, args, {
        shell: false,
        stdio: ["pipe", "pipe", "pipe"],
        windowsHide: true,
      });
      const stdout = [];
      const stderr = [];
      let outputSize = 0;
      const timer = setTimeout(() => {
        child.kill();
        reject(
          new AssetError(
            "OF_ASSET_ANALYSIS_TIMEOUT",
            "Asset analysis exceeded its time limit.",
          ),
        );
      }, timeoutMs);

      child.stdout.on("data", (chunk) => {
        outputSize += chunk.length;
        if (outputSize > maxOutputBytes) {
          child.kill();
          return;
        }
        stdout.push(chunk);
      });
      child.stderr.on("data", (chunk) => stderr.push(chunk));
      child.on("error", (error) => {
        clearTimeout(timer);
        reject(
          new AssetError(
            "OF_ASSET_ANALYSIS_FAILED",
            "The Python analyzer could not start.",
            { cause: error.message },
          ),
        );
      });
      child.on("close", (code) => {
        clearTimeout(timer);
        if (outputSize > maxOutputBytes) {
          reject(
            new AssetError(
              "OF_ASSET_ANALYSIS_OUTPUT_LIMIT",
              "Asset analysis exceeded its output limit.",
            ),
          );
          return;
        }
        if (code !== 0) {
          reject(
            new AssetError(
              "OF_ASSET_ANALYSIS_FAILED",
              "The Python analyzer rejected the asset.",
              { cause: Buffer.concat(stderr).toString("utf8").slice(0, 1000) },
            ),
          );
          return;
        }
        try {
          const result = JSON.parse(Buffer.concat(stdout).toString("utf8"));
          resolve({
            ...result,
            variants: result.variants.map((variant) => ({
              ...variant,
              bytes: Buffer.from(variant.base64, "base64"),
              base64: undefined,
            })),
          });
        } catch (error) {
          reject(
            new AssetError(
              "OF_ASSET_ANALYSIS_INVALID",
              "Asset analyzer returned an invalid response.",
              { cause: error.message },
            ),
          );
        }
      });

      child.stdin.end(bytes);
    });
  };
}
