import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

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
} finally {
  rmSync(fixtureRoot, { force: true, recursive: true });
  if (existsSync(fixtureParent)) {
    rmSync(fixtureParent, { force: true, recursive: true });
  }
}
