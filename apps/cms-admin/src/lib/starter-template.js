import {
  componentPathForBlock,
  readBlocksCss,
  readStandaloneBlockSource,
} from "./block-files.js";

/**
 * Builds the initial file set for a brand-new site: a minimal, real,
 * buildable Next.js App Router project seeded with one starter page
 * composed from two blocks. This is what gets written into the site's
 * workspace directory (see site-workspace.js) the moment it's created —
 * from then on, the project IS the site; there is no separate database
 * representation of its content.
 *
 * Every page's root is a real, non-self-closing <main> element (not a bare
 * `<>...</>` fragment) so it always has a valid @openforge/compiler
 * insertion target: a Fragment can only be targeted with "before"/"after",
 * not "inside-start"/"inside-end", so a page emptied down to zero blocks
 * would have nowhere for the next inserted block to land.
 *
 * @param {{ name: string, slug: string }} site
 */
export async function buildStarterFiles(site) {
  const [heroSource, richTextSource, blocksCss] = await Promise.all([
    readStandaloneBlockSource("openforge-cms.hero"),
    readStandaloneBlockSource("openforge-cms.rich-text"),
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
      source: `import Hero from "../${componentPathForBlock("openforge-cms.hero")}";\nimport RichText from "../${componentPathForBlock("openforge-cms.rich-text")}";\n\nexport default function Page() {\n  return (\n    <main>\n      <Hero heading=${JSON.stringify(`Welcome to ${site.name}`)} ctaLabel="Get started" ctaHref="#" />\n      <RichText content="Edit this page from the admin, or right here in the code — they stay in sync." />\n    </main>\n  );\n}\n`,
    },
    { path: componentPathForBlock("openforge-cms.hero"), source: heroSource },
    {
      path: componentPathForBlock("openforge-cms.rich-text"),
      source: richTextSource,
    },
  ];
}
