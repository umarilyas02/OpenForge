import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import {
  defaultTheme,
  defaultThemeBlockRegistry,
} from "@openforge/theme-default";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDb } from "../../../../../../src/lib/db.js";
import { serializeBlockDefinitions } from "../../../../../../src/lib/content-tree-ops.js";
import {
  getMemberships,
  requireUser,
} from "../../../../../../src/lib/session.js";
import { ContentEditor } from "../../../../../../src/components/ContentEditor.jsx";
import { saveContent } from "./actions.js";

export default async function ContentEditorPage({ params }) {
  const { siteId, contentId } = await params;
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

  const [item] = await db
    .select()
    .from(schema.contentItems)
    .where(
      and(
        eq(schema.contentItems.id, contentId),
        eq(schema.contentItems.siteId, site.id),
      ),
    );
  if (!item) notFound();

  const region = defaultTheme.getRegion(
    item.type === "post" ? "post-body" : "page-body",
  );
  const catalog = serializeBlockDefinitions(
    region.allowedBlockIds,
    defaultThemeBlockRegistry,
  );

  return (
    <div className="stack">
      <Link className="muted" href={`/sites/${site.id}`}>
        ← {site.name}
      </Link>
      <ContentEditor
        allowedBlockIds={region.allowedBlockIds}
        catalog={catalog}
        initialItem={item}
        saveContent={saveContent}
        siteId={site.id}
      />
    </div>
  );
}
