import {
  componentPathForBlock,
  readBlocksCss,
  readStandaloneBlockSource,
} from "./block-files.js";

/**
 * The 10 theme packages were built independently and their `exampleSite`
 * export shape drifted (a bare array vs. an object with `pages`/`footer`,
 * `path` vs. `slug`, a footer as a raw node array vs. a page-shaped
 * `{ region, blocks }` object, one theme with no footer at all). Normalizes
 * all of that into one shape so the generator below never has to branch on
 * a specific theme.
 *
 * @param {unknown} exampleSite
 * @returns {{ pages: Array<{ path: string, title: string, blocks: object[] }>, footerBlocks: object[] | null }}
 */
export function normalizeExampleSite(exampleSite) {
  const raw = Array.isArray(exampleSite) ? { pages: exampleSite } : exampleSite;
  const pages = (raw.pages ?? []).map((page) => ({
    path: page.path ?? page.slug,
    title: page.title,
    blocks: page.blocks,
  }));

  const rawFooter = raw.footer;
  let footerBlocks = null;
  if (Array.isArray(rawFooter)) {
    footerBlocks = rawFooter;
  } else if (rawFooter && Array.isArray(rawFooter.blocks)) {
    footerBlocks = rawFooter.blocks;
  }

  return { pages, footerBlocks };
}

function kebabToPascalCase(kebab) {
  return kebab
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("");
}

function localComponentName(blockId) {
  return kebabToPascalCase(blockId.replace("openforge-cms.", ""));
}

function renderAttribute(name, value) {
  if (value === true) return name;
  if (typeof value === "string") return `${name}=${JSON.stringify(value)}`;
  return `${name}={${value === null ? "null" : JSON.stringify(value)}}`;
}

/**
 * Compiles one content-tree node (and its slot children, recursively) into
 * real JSX source text, collecting every block id it touches along the way.
 * Mirrors the exact shape `source-content-tree.js`'s parser expects back:
 * a single-slot block's children are just its direct JSX children, with no
 * slot name present in the markup at all.
 *
 * @param {{ blockId: string, props?: object, slots?: Record<string, object[]> }} node
 * @param {Set<string>} usedBlockIds
 */
function compileNode(node, usedBlockIds) {
  usedBlockIds.add(node.blockId);
  const localName = localComponentName(node.blockId);
  const attributes = Object.entries(node.props ?? {})
    .map(([name, value]) => ` ${renderAttribute(name, value)}`)
    .join("");
  const children = Object.values(node.slots ?? {})
    .flat()
    .map((child) => compileNode(child, usedBlockIds))
    .join("");
  return `<${localName}${attributes}>${children}</${localName}>`;
}

function pagePathToFilePath(urlPath) {
  const segments = urlPath.split("/").filter(Boolean);
  return segments.length === 0
    ? "app/page.jsx"
    : `app/${segments.join("/")}/page.jsx`;
}

/** Import depth from a generated page file back up to the project root. */
function importDepthFor(urlPath) {
  const segments = urlPath.split("/").filter(Boolean);
  return segments.length + 1;
}

function importPrefix(depth) {
  return "../".repeat(depth);
}

function renderImports(blockIds, depth) {
  return [...blockIds]
    .sort()
    .map(
      (id) =>
        `import ${localComponentName(id)} from "${importPrefix(depth)}${componentPathForBlock(id)}";`,
    )
    .join("\n");
}

const DEFAULT_FOOTER_NODE = (siteName) => ({
  blockId: "openforge-cms.footer",
  blockVersion: 1,
  props: {
    copyrightText: `© ${new Date().getFullYear()} ${siteName}. All rights reserved.`,
  },
  slots: {},
});

/**
 * Builds a real, complete Next.js App Router file set for a theme's example
 * site: a persistent header/footer in the root layout (a real Navbar built
 * from the actual generated pages, and the theme's own footer content, or a
 * generic one if it doesn't ship one) plus one real page file per example
 * page. This is what "activating" a theme actually writes into a site's
 * workspace -- see installTheme() in appearance/actions.js.
 *
 * @param {{ manifest: { id: string, name: string } }} theme
 * @param {unknown} exampleSite the theme package's raw `exampleSite` export
 *   (see theme-registry.js's getExampleSiteFor) -- not a field of `theme`
 *   itself, since `createTheme()` doesn't carry it.
 * @param {{ name: string, slug: string }} site
 */
export async function buildThemeSiteFiles(theme, exampleSite, site) {
  const { pages, footerBlocks } = normalizeExampleSite(exampleSite);
  if (pages.length === 0) {
    throw new Error(`Theme "${theme.manifest.id}" has no example pages.`);
  }

  const navLinks = pages
    .map((page) => `${page.title.split(/[-—|]/u)[0].trim()}|${page.path}`)
    .join("\n");
  const navbarNode = {
    blockId: "openforge-cms.navbar",
    blockVersion: 1,
    props: { brand: site.name, links: navLinks },
    slots: {},
  };
  const footerNode = footerBlocks
    ? null
    : DEFAULT_FOOTER_NODE(site.name);

  const usedBlockIds = new Set();

  const navbarJsx = compileNode(navbarNode, usedBlockIds);
  const footerJsx = footerBlocks
    ? footerBlocks.map((node) => compileNode(node, usedBlockIds)).join("")
    : compileNode(footerNode, usedBlockIds);

  const layoutDepth = 1;
  const layoutSource = `import "./blocks.css";
${renderImports([...usedBlockIds], layoutDepth)}

export const metadata = {
  title: ${JSON.stringify(site.name)},
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        ${navbarJsx}
        {children}
        ${footerJsx}
      </body>
    </html>
  );
}
`;

  const pageFiles = pages.map((page) => {
    const pageBlockIds = new Set();
    const body = page.blocks
      .map((node) => compileNode(node, pageBlockIds))
      .join("\n        ");
    for (const id of pageBlockIds) usedBlockIds.add(id);
    const depth = importDepthFor(page.path);

    return {
      path: pagePathToFilePath(page.path),
      source: `${renderImports([...pageBlockIds], depth)}

export default function Page() {
  return (
    <main>
      ${body}
    </main>
  );
}
`,
    };
  });

  const blockFiles = await Promise.all(
    [...usedBlockIds].map(async (id) => ({
      path: componentPathForBlock(id),
      source: await readStandaloneBlockSource(id),
    })),
  );

  const blocksCss = await readBlocksCss();

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
    { path: "app/layout.jsx", source: layoutSource },
    ...pageFiles,
    ...blockFiles,
  ];
}
