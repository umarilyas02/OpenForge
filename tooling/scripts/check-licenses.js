import { execFileSync } from "node:child_process";

/**
 * Fails if any production dependency carries a license outside this
 * allowlist -- permissive/attribution licenses only, no copyleft that
 * would force this Apache-2.0 project's own source to be relicensed.
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
]);

/**
 * Package-name-scoped exceptions, not blanket license strings: sharp
 * ships a different prebuilt-binary package per OS/arch (confirmed by
 * actually running `pnpm licenses list` on both Windows --
 * @img/sharp-win32-x64, "Apache-2.0 AND LGPL-3.0-or-later" -- and Linux
 * -- @img/sharp-libvips-linux-x64, plain "LGPL-3.0-or-later"), so a
 * single allowed license string doesn't generalize across CI runners.
 * Scoping to the package name (not just the license) means a future,
 * unrelated LGPL package still fails the check rather than silently
 * passing because some other reviewed exception happened to share its
 * license string. LGPL only obligates sharing modifications to the
 * LGPL-covered component itself when redistributed, not the licensing of
 * code that merely depends on it -- standard, widely-relied-on usage
 * (the same binary Next.js's own image optimization depends on).
 */
const REVIEWED_PACKAGE_EXCEPTIONS = [{ namePattern: /^(@img\/)?sharp(-|$)/u }];

function isReviewedException(name) {
  return REVIEWED_PACKAGE_EXCEPTIONS.some((exception) =>
    exception.namePattern.test(name),
  );
}

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
      // Only set there: it's unnecessary (and triggers a Node deprecation
      // warning for execFileSync + shell:true + an args array) on
      // POSIX, where corepack is a plain executable.
      shell: process.platform === "win32",
    },
  );
  const byLicense = JSON.parse(raw);

  const violations = [];
  for (const [license, packages] of Object.entries(byLicense)) {
    if (ALLOWED_LICENSES.has(license)) continue;
    for (const pkg of packages) {
      if (isReviewedException(pkg.name)) continue;
      violations.push({ license, name: pkg.name, versions: pkg.versions });
    }
  }

  if (violations.length === 0) {
    console.log(
      `License check passed: every production dependency's license is in the allowlist (${ALLOWED_LICENSES.size} allowed licenses, plus reviewed package-scoped exceptions).`,
    );
    return;
  }

  console.error("License check FAILED. Packages outside the allowlist:\n");
  for (const v of violations) {
    console.error(`  ${v.name}@${v.versions.join(",")} -- ${v.license}`);
  }
  console.error(
    "\nIf this is a legitimate license, add it to ALLOWED_LICENSES (a whole license class) or REVIEWED_PACKAGE_EXCEPTIONS (a specific reviewed package) in tooling/scripts/check-licenses.js with a comment explaining why it's acceptable for this Apache-2.0 project.",
  );
  process.exitCode = 1;
}

run();
