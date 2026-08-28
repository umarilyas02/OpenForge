const DEFAULT_ORIGIN = "http://localhost:3902";

/**
 * Build the live URL for a site, matching exactly how
 * apps/cms-renderer's resolveSiteByHost() matches requests: a custom
 * domain wins, otherwise the site's slug is inserted as a subdomain of
 * the configured renderer origin.
 *
 * @param {{ slug: string, customDomain: string | null }} site
 */
export function buildSiteUrl(site) {
  if (site.customDomain) {
    return `https://${site.customDomain}/`;
  }

  const origin = process.env.NEXT_PUBLIC_CMS_RENDERER_ORIGIN || DEFAULT_ORIGIN;
  const url = new URL(origin);
  url.hostname = `${site.slug}.${url.hostname}`;
  return url.toString();
}
