import { execFileSync } from "node:child_process";

/**
 * Fails if any production dependency carries a license outside this
 * allowlist -- permissive/attribution licenses only, no copyleft that
 * would force this Apache-2.0 project's own source to be relicensed.
 * `@img/sharp-*`'s "Apache-2.0 AND LGPL-3.0-or-later" is a known,
 * reviewed exception: LGPL only obligates sharing modifications to the
 * LGPL-covered component itself when redistributed, not the licensing of
 * code that merely depends on it -- standard, widely-relied-on usage (the
 * same binary Next.js's own image optimization depends on).
 */
const ALLOWED_LICENSES = new Set([
  "MIT",
  "ISC",
  "Apache-2.0",
  "BSD-2-Clause",
  "BSD-3-Clause",
  "0BSD",
  "BlueOak-1.0.0",
  "CC-BY-4.0",
  "SIL OPEN FONT LICENSE",
  "W3C",
  "Apache-2.0 AND LGPL-3.0-or-later", // @img/sharp-* prebuilt binaries -- see comment above
]);

function run() {
  const raw = execFileSync(
    "corepack",
    ["pnpm", "licenses", "list", "--prod", "--json"],
    {
      cwd: new URL("../..", import.meta.url),
      encoding: "utf8",
      maxBuffer: 1024 * 1024 * 16,
      // corepack resolves to a .cmd shim on Windows -- execFileSync can't
      // spawn that without going through a shell, unlike a plain .exe.
      shell: true,
    },
  );
  const byLicense = JSON.parse(raw);

  const violations = [];
  for (const [license, packages] of Object.entries(byLicense)) {
    if (ALLOWED_LICENSES.has(license)) continue;
    for (const pkg of packages) {
      violations.push({ license, name: pkg.name, versions: pkg.versions });
    }
  }

  if (violations.length === 0) {
    console.log(
      `License check passed: every production dependency's license is in the allowlist (${ALLOWED_LICENSES.size} allowed licenses).`,
    );
    return;
  }

  console.error("License check FAILED. Packages outside the allowlist:\n");
  for (const v of violations) {
    console.error(`  ${v.name}@${v.versions.join(",")} -- ${v.license}`);
  }
  console.error(
    "\nIf this is a legitimate license, add it to ALLOWED_LICENSES in tooling/scripts/check-licenses.js with a comment explaining why it's acceptable for this Apache-2.0 project.",
  );
  process.exitCode = 1;
}

run();
