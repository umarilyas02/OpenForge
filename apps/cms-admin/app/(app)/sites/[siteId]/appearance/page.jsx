import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import {
  defaultDesignTokenRegistry,
  defaultDesignTokens,
} from "@openforge/design-tokens";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { AppearanceForm } from "../../../../../src/components/AppearanceForm.jsx";
import { getDb } from "../../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../../src/lib/session.js";
import { saveAppearance } from "./actions.js";

export default async function AppearancePage({ params }) {
  const { siteId } = await params;
  const user = await requireUser();

  const db = getDb();
  const [site] = await db
    .select()
    .from(schema.sites)
    .where(eq(schema.sites.id, siteId));
  if (!site) notFound();

  const memberships = await getMemberships(user.id);
  try {
    assertSiteAccess({ userId: user.id }, site, memberships);
  } catch {
    notFound();
  }

  const [installation] = await db
    .select()
    .from(schema.themeInstallations)
    .where(eq(schema.themeInstallations.siteId, site.id));

  const overrides = installation?.config ?? {};
  const colorTokens = defaultDesignTokens.tokens
    .filter((token) => token.type === "color")
    .map((token) => ({
      name: token.name,
      cssVariable: token.cssVariable,
      description: token.description,
      value:
        overrides[token.name] ??
        defaultDesignTokenRegistry.resolve(token.name).resolvedValue,
    }));

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <h1 className="page-title">Appearance</h1>
          <p className="page-subtitle">
            Overrides the active theme&apos;s color tokens for this site only.
          </p>
        </div>
      </div>

      <AppearanceForm
        saveAppearance={saveAppearance}
        siteId={site.id}
        tokens={colorTokens}
      />
    </div>
  );
}
