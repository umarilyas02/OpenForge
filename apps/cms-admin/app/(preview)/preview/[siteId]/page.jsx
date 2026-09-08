import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { defaultDesignTokens } from "@openforge/design-tokens";
import { createRenderer, renderSiteStyles } from "@openforge/renderer";
import {
  defaultTheme,
  defaultThemeBlockRegistry,
} from "@openforge/theme-default";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Fragment } from "react";

import { getDb } from "../../../../src/lib/db.js";
import {
  getMemberships,
  requireUser,
} from "../../../../src/lib/session.js";
import { parsePageToBlockTree } from "../../../../src/lib/source-content-tree.js";
import {
  getWorkspaceManager,
  listPages,
} from "../../../../src/lib/site-workspace.js";

const renderer = createRenderer({
  theme: defaultTheme,
  blockRegistry: defaultThemeBlockRegistry,
});

/**
 * Chrome-free "preview the whole site" route: the same block-tree ->
 * component pipeline the live canvas and apps/cms-renderer use
 * (@openforge/renderer + the default theme's block registry), applied
 * directly to a page's real, on-disk source instead of an editor's live
 * (possibly unsaved) tree. No iframe/postMessage here — this is read-only,
 * so the tree can be computed straight from the workspace on the server.
 */
export default async function SitePreviewPage({ params, searchParams }) {
  const { siteId } = await params;
  const { page: requestedPage } = await searchParams;
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

  const manager = getWorkspaceManager();
  let files;
  try {
    files = await manager.readFiles(site.slug);
  } catch {
    return (
      <PreviewChrome pages={[]} siteId={site.id}>
        <EmptyState message="This site has no workspace files yet." />
      </PreviewChrome>
    );
  }

  const pages = listPages(files);
  const pagePath =
    pages.find((page) => page.filePath === requestedPage)?.filePath ??
    pages.find((page) => page.urlPath === "/")?.filePath ??
    pages[0]?.filePath;

  if (!pagePath) {
    return (
      <PreviewChrome pages={pages} siteId={site.id}>
        <EmptyState message="This site has no pages yet." />
      </PreviewChrome>
    );
  }

  let tree;
  try {
    tree = parsePageToBlockTree(files, pagePath);
  } catch (error) {
    return (
      <PreviewChrome activePagePath={pagePath} pages={pages} siteId={site.id}>
        <EmptyState message={`Could not parse this page: ${error.message}`} />
      </PreviewChrome>
    );
  }

  const css = renderSiteStyles({ baseTokens: defaultDesignTokens, overrides: {} });
  const body = tree.map((node, index) => {
    try {
      return (
        <Fragment key={index}>{renderer.renderNode(node, [index])}</Fragment>
      );
    } catch (renderError) {
      return (
        <div key={index} style={ERROR_STYLE}>
          {renderError.message}
        </div>
      );
    }
  });

  return (
    <PreviewChrome activePagePath={pagePath} pages={pages} siteId={site.id}>
      <style dangerouslySetInnerHTML={{ __html: css }} />
      {tree.length === 0 ? <EmptyState message="This page is empty." /> : body}
    </PreviewChrome>
  );
}

const ERROR_STYLE = {
  background: "#fef2f2",
  border: "1px solid #fecaca",
  borderRadius: 8,
  color: "#b91c1c",
  fontFamily: "sans-serif",
  margin: "8px 0",
  padding: 16,
};

function EmptyState({ message }) {
  return (
    <p style={{ color: "#71717a", fontFamily: "sans-serif", padding: 24 }}>
      {message}
    </p>
  );
}

function PreviewChrome({ activePagePath, children, pages, siteId }) {
  return (
    <div>
      <div
        style={{
          alignItems: "center",
          background: "#111111",
          color: "#ffffff",
          display: "flex",
          fontFamily: "system-ui, sans-serif",
          fontSize: 13,
          gap: 16,
          padding: "10px 16px",
          position: "sticky",
          top: 0,
          zIndex: 2147483000,
        }}
      >
        <Link
          href={`/sites/${siteId}/dashboard`}
          style={{ color: "#ffffff", fontWeight: 600, textDecoration: "none" }}
        >
          ← Back to admin
        </Link>
        <span style={{ color: "#6b7280" }}>Preview</span>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {pages.map((page) => (
            <Link
              href={`/preview/${siteId}?page=${encodeURIComponent(page.filePath)}`}
              key={page.filePath}
              style={{
                background:
                  page.filePath === activePagePath ? "#ffffff" : "transparent",
                borderRadius: 999,
                color: page.filePath === activePagePath ? "#111111" : "#e5e7eb",
                padding: "3px 10px",
                textDecoration: "none",
              }}
            >
              {page.urlPath}
            </Link>
          ))}
        </div>
      </div>
      {children}
    </div>
  );
}
