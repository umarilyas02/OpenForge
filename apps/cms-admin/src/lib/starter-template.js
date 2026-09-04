import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

// Plain relative paths, not `import.meta.resolve("@openforge/cms-blocks/...")`:
// confirmed live that a standalone production build's file tracer doesn't
// resolve @openforge/cms-blocks as a package at all when it's only ever
// reached via a dynamic, block-id-parameterized specifier (the whole point,
// since any of the 38 blocks can be inserted into a site) — the package
// silently isn't copied into .next/standalone/node_modules, and site
// creation fails at runtime with no build-time warning. next.config.js's
// outputFileTracingIncludes instead copies these files to a path that
// mirrors the monorepo's own layout, which a plain relative path (computed
// from this file's own location) resolves identically in both the source
// tree and the deployed standalone tree.
const CMS_BLOCKS_STANDALONE_DIR = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../../packages/cms-blocks/dist/standalone",
);
const CMS_BLOCKS_CSS_PATH = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../../../../packages/cms-blocks/src/blocks.css",
);

/**
 * @param {string} blockFileName e.g. "hero.jsx"
 */
async function readStandaloneBlock(blockFileName) {
  return readFile(path.join(CMS_BLOCKS_STANDALONE_DIR, blockFileName), "utf8");
}

async function readBlocksCss() {
  return readFile(CMS_BLOCKS_CSS_PATH, "utf8");
}

/**
 * Builds the initial file set for a brand-new site: a minimal, real,
 * buildable Next.js App Router project seeded with one starter page
 * composed from two blocks. This is what gets written into the site's
 * workspace directory (see site-workspace.js) the moment it's created —
 * from then on, the project IS the site; there is no separate database
 * representation of its content.
 *
 * @param {{ name: string, slug: string }} site
 */
export async function buildStarterFiles(site) {
  const [heroSource, richTextSource, blocksCss] = await Promise.all([
    readStandaloneBlock("hero.jsx"),
    readStandaloneBlock("rich-text.jsx"),
    readBlocksCss(),
  ]);

  return [
    {
      path: "package.json",
      source: `${JSON.stringify(
        {
          name: site.slug,
          version: "0.0.0",
          private: true,
          type: "module",
          scripts: {
            dev: "next dev",
            build: "next build",
            start: "next start",
          },
          dependencies: {
            next: "16.2.12",
            react: "19.2.8",
            "react-dom": "19.2.8",
          },
        },
        null,
        2,
      )}\n`,
    },
    {
      path: "next.config.js",
      source: `/** @type {import("next").NextConfig} */\nconst nextConfig = {\n  reactStrictMode: true,\n};\n\nexport default nextConfig;\n`,
    },
    { path: "app/blocks.css", source: blocksCss },
    {
      path: "app/layout.jsx",
      source: `import "./blocks.css";\n\nexport const metadata = {\n  title: ${JSON.stringify(site.name)},\n};\n\nexport default function RootLayout({ children }) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}\n`,
    },
    {
      path: "app/page.jsx",
      source: `import Hero from "../components/openforge/Hero.jsx";\nimport RichText from "../components/openforge/RichText.jsx";\n\nexport default function Page() {\n  return (\n    <>\n      <Hero heading=${JSON.stringify(`Welcome to ${site.name}`)} ctaLabel="Get started" ctaHref="#" />\n      <RichText content="Edit this page from the admin, or right here in the code — they stay in sync." />\n    </>\n  );\n}\n`,
    },
    { path: "components/openforge/Hero.jsx", source: heroSource },
    { path: "components/openforge/RichText.jsx", source: richTextSource },
  ];
}
