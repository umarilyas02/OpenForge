import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import {
  defaultDesignTokenRegistry,
  defaultDesignTokens,
} from "@openforge/design-tokens";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { DesignTokensForm } from "../../../../../../../src/components/DesignTokensForm.jsx";
import { getDb } from "../../../../../../../src/lib/db.js";
import {
  getMemberships,
  requireUser,
} from "../../../../../../../src/lib/session.js";
import { saveDesignTokens } from "../actions.js";

export default async function DesignTokensPage({ params }) {
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
  const tokens = defaultDesignTokens.tokens.map((token) => ({
    name: token.name,
    cssVariable: token.cssVariable,
    type: token.type,
    tier: token.tier,
    description: token.description,
    resolvedValue:
      overrides[token.name] ??
      defaultDesignTokenRegistry.resolve(token.name).resolvedValue,
  }));

  return (
    <DesignTokensForm
      saveDesignTokens={saveDesignTokens}
      siteId={site.id}
      tokens={tokens}
    />
  );
}
