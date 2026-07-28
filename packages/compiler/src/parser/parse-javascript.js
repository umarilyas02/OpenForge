import { parse } from "@babel/parser";

/**
 * Parse JavaScript or JSX using the compiler's shared source profile.
 *
 * @param {{ filePath: string, source: string }} input
 * @returns {import("@babel/types").File}
 */
export function parseJavaScript({ filePath, source }) {
  return parse(source, {
    errorRecovery: false,
    plugins: ["jsx"],
    sourceFilename: filePath,
    sourceType: "unambiguous",
  });
}
