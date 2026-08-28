import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";

import { getDb } from "./db.js";

function extractSubdomainSlug(hostname) {
  const parts = hostname.split(".");
  return parts.length > 1 ? parts[0] : null;
}

/**
 * Resolve a `sites` row from a request's Host header: a custom domain
 * match wins, falling back to the site's slug as a subdomain
 * (`{slug}.openforge.site` or `{slug}.localhost` for local development).
 *
 * @param {string} hostHeader
 */
export async function resolveSiteByHost(hostHeader) {
  const db = getDb();
  const hostname = hostHeader.split(":")[0];

  const [byDomain] = await db
    .select()
    .from(schema.sites)
    .where(eq(schema.sites.customDomain, hostname));
  if (byDomain) return byDomain;

  const slug = extractSubdomainSlug(hostname);
  if (!slug) return null;

  const [bySlug] = await db
    .select()
    .from(schema.sites)
    .where(eq(schema.sites.slug, slug));
  return bySlug ?? null;
}
