import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { Heading } from "@primer/react";
import { and, eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";

import { getDb } from "../../../../../../src/lib/db.js";
import {
  getMemberships,
  requireUser,
} from "../../../../../../src/lib/session.js";

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

  return (
    <div className="stack">
      <Link className="muted" href={`/sites/${site.id}`}>
        ← {site.name}
      </Link>
      <Heading as="h1">{item.title}</Heading>
      <p className="muted">
        The block-tree editor is coming next — this page exists so the
        create-content flow has somewhere real to land.
      </p>
    </div>
  );
}
