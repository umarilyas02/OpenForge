import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  readFileSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
import axe from "axe-core";
import { JSDOM, VirtualConsole } from "jsdom";

import { officialBlockRegistry } from "../src/index.js";

const packageRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const fixtureParent = join(packageRoot, ".openforge-fixtures");
mkdirSync(fixtureParent, { recursive: true });
const fixtureRoot = mkdtempSync(join(fixtureParent, "landing-page-"));
const nextPackage = fileURLToPath(import.meta.resolve("next/package.json"));
const nextCli = join(dirname(nextPackage), "dist", "bin", "next");

function write(relativePath, content) {
  const destination = join(fixtureRoot, relativePath);
  mkdirSync(dirname(destination), { recursive: true });
  writeFileSync(destination, content, "utf8");
}

try {
  write(
    "package.json",
    `${JSON.stringify(
      {
        name: "openforge-block-fixture",
        version: "0.0.0",
        private: true,
        type: "module",
        scripts: { build: "next build" },
        dependencies: {
          next: "16.2.12",
          react: "19.2.8",
          "react-dom": "19.2.8",
        },
      },
      null,
      2,
    )}\n`,
  );
  write(
    "app/layout.jsx",
    `import "./globals.css";

export const metadata = {
  title: "OpenForge official blocks",
  description: "Independent build fixture for the official block registry.",
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
`,
  );
  write(
    "app/globals.css",
    `html { scroll-behavior: smooth; }
body { margin: 0; }
a:focus-visible, summary:focus-visible { outline: 3px solid #2563eb; outline-offset: 3px; }
`,
  );

  const imports = [];
  const elements = [];
  for (const block of officialBlockRegistry.list()) {
    const insertion = officialBlockRegistry.createInsertion(block.id);
    for (const file of insertion.files) {
      const destination = join(fixtureRoot, file.path);
      if (!existsSync(destination)) {
        write(file.path, file.content);
      }
    }
    imports.push(
      `import { ${block.exportName} } from "../components/openforge/${block.fileName}";`,
    );
    elements.push(`      <${block.exportName} />`);
  }

  write(
    "app/page.jsx",
    `${imports.join("\n")}

export default function LandingPage() {
  return (
    <main>
${elements.join("\n")}
    </main>
  );
}
`,
  );

  execFileSync(process.execPath, [nextCli, "build"], {
    cwd: fixtureRoot,
    env: {
      ...process.env,
      NEXT_TELEMETRY_DISABLED: "1",
    },
    stdio: "inherit",
  });
  const renderedHtml = readFileSync(
    join(fixtureRoot, ".next", "server", "app", "index.html"),
    "utf8",
  );
  const virtualConsole = new VirtualConsole().forwardTo(console, {
    jsdomErrors: "none",
  });
  const dom = new JSDOM(renderedHtml, {
    runScripts: "outside-only",
    url: "https://fixture.openforge.test/",
    virtualConsole,
  });
  dom.window.eval(axe.source);
  const audit = await dom.window.axe.run(dom.window.document, {
    runOnly: {
      type: "tag",
      values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
    },
  });
  dom.window.close();
  if (audit.violations.length > 0) {
    const summary = audit.violations
      .map(
        ({ id, nodes }) =>
          `${id}: ${nodes.map(({ target }) => target.join(" ")).join(", ")}`,
      )
      .join("\n");
    throw new Error(`Official block accessibility audit failed:\n${summary}`);
  }
} finally {
  rmSync(fixtureRoot, { force: true, recursive: true });
  if (existsSync(fixtureParent)) {
    rmSync(fixtureParent, { force: true, recursive: true });
  }
}
