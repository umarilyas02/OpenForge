import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { getDb } from "../../../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../../../src/lib/session.js";
import { getWorkspaceManager } from "../../../../../../src/lib/site-workspace.js";

function CheckRow({ ok, label }) {
  return (
    <div className="list-row">
      <div className="list-row-title">{label}</div>
      <span className={ok ? "badge badge-published" : "badge badge-draft"}>
        {ok ? "OK" : "Unavailable"}
      </span>
    </div>
  );
}

export default async function ToolsPage({ params }) {
  const { siteId } = await params;
  const user = await requireUser();
  const exportHref = `/sites/${siteId}/tools/export`;

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

  let workspaceOk = true;
  try {
    await getWorkspaceManager().describe(site.slug);
  } catch {
    workspaceOk = false;
  }

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Tools</p>
          <h1 className="page-title">Tools</h1>
          <p className="page-subtitle">Import, export, and site health.</p>
        </div>
      </div>

      <div className="grid-responsive">
        <div className="card stack-sm">
          <h2 style={{ margin: 0, fontSize: "var(--text-md)" }}>Import</h2>
          <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
            Bring in content from WordPress, JSON, or Markdown.
          </p>
          <button className="btn btn-ghost" disabled type="button">
            Coming soon
          </button>
        </div>
        <div className="card stack-sm">
          <h2 style={{ margin: 0, fontSize: "var(--text-md)" }}>Export</h2>
          <p className="muted" style={{ fontSize: "var(--text-sm)" }}>
            Download this site&apos;s real Next.js project as a .tar.gz —
            the same files behind the editor, ready to run anywhere.
          </p>
          <a className="btn btn-primary" href={exportHref}>
            Download .tar.gz
          </a>
        </div>
      </div>

      <div className="stack-sm">
        <h2 style={{ margin: 0, fontSize: "var(--text-md)" }}>Site Health</h2>
        <div className="card">
          <CheckRow label="Database connection" ok />
          <CheckRow label="Site workspace files" ok={workspaceOk} />
          <CheckRow
            label="Publish status"
            ok={site.status === "published"}
          />
        </div>
      </div>
    </div>
  );
}
