import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const manifestUrl = new URL(
  "../fixtures/compatibility/manifest.json",
  import.meta.url,
);
const fixturesRootUrl = new URL("../fixtures/compatibility/", import.meta.url);
const manifest = JSON.parse(readFileSync(manifestUrl, "utf8"));

export const compatibilityFixtures = Object.freeze(
  manifest.fixtures.map((fixture) =>
    Object.freeze({
      ...fixture,
      entryPath: fileURLToPath(new URL(fixture.entry, fixturesRootUrl)),
      relativeEntryPath: fixture.entry,
    }),
  ),
);
