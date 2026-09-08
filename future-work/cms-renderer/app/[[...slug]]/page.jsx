import { defaultDesignTokens } from "@openforge/design-tokens";
import { renderSiteStyles } from "@openforge/renderer";
import { defaultTheme } from "@openforge/theme-default";
import { notFound } from "next/navigation";
import { headers } from "next/headers";

import { getPublishedPageBySlug } from "../../src/lib/get-content.js";
import {
  getSiteTokenOverrides,
  renderContentBody,
} from "../../src/lib/render-page.js";
import { resolveSiteByHost } from "../../src/lib/resolve-site.js";

export default async function SitePage({ params }) {
  const { slug } = await params;
  const requestHeaders = await headers();
  const host = requestHeaders.get("host") ?? "";

  const site = await resolveSiteByHost(host);
  if (!site) notFound();

  const path = slug && slug.length > 0 ? slug.join("/") : "home";
  const contentItem = await getPublishedPageBySlug({
    siteId: site.id,
    slug: path,
  });
  if (!contentItem) notFound();

  const overrides = await getSiteTokenOverrides(site.id);
  const css = renderSiteStyles({ baseTokens: defaultDesignTokens, overrides });
  const Template = defaultTheme.getTemplate(
    contentItem.type === "post" ? "post" : "page",
  );
  const body = renderContentBody(contentItem);

  return (
    <>
      {/* Token CSS is generated and validated by packages/design-tokens, never raw user input. */}
      <style dangerouslySetInnerHTML={{ __html: css }} />
      <Template page={contentItem}>{body}</Template>
    </>
  );
}
