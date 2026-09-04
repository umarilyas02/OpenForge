import { readdir, readFile, mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import { generateStandaloneBlock } from "../../packages/cms-blocks/src/generate-standalone-block.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const blocksDir = path.resolve(here, "../../packages/cms-blocks/src/blocks");
const outDir = path.resolve(here, "../../packages/cms-blocks/dist/standalone");

/**
 * Generates a plain, importable React component file (no CMS-registry
 * code) for every block in packages/cms-blocks/src/blocks — this is what
 * gets copied into a real site's components/ directory when a block is
 * used on a file-backed page. Run after changing any block's component
 * body; regenerated output is not hand-edited.
 */
async function main() {
  const entries = await readdir(blocksDir);
  const blockFiles = entries.filter((entry) => entry.endsWith(".jsx"));

  await mkdir(outDir, { recursive: true });

  let count = 0;
  for (const fileName of blockFiles) {
    const source = await readFile(path.join(blocksDir, fileName), "utf8");
    const standalone = generateStandaloneBlock(source);
    await writeFile(path.join(outDir, fileName), standalone, "utf8");
    count += 1;
  }

  process.stdout.write(
    `Generated ${count} standalone block file(s) into ${path.relative(process.cwd(), outDir)}.\n`,
  );
}

main().catch((error) => {
  process.stderr.write(`${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
