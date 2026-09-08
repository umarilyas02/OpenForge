import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

import { getDb } from "../../../../../../../src/lib/db.js";
import {
  getMemberships,
  requireUser,
} from "../../../../../../../src/lib/session.js";
import {
  DEFAULT_THEME_ID,
  themeRegistry,
} from "../../../../../../../src/lib/theme-registry.js";
import { installTheme } from "../actions.js";

const SWATCH_TOKEN_NAMES = ["color.orange-500", "color.action", "color.ink"];

function Swatches({ overrides }) {
  const colors = SWATCH_TOKEN_NAMES.map((name) => overrides?.[name]).filter(
    (value) => typeof value === "string" && /^#/u.test(value),
  );
  if (colors.length === 0) return null;

  return (
    <div style={{ display: "flex", gap: "0.25rem" }}>
      {colors.map((color, index) => (
        <span
          key={color + index}
          style={{
            background: color,
            border: "1px solid var(--border)",
            borderRadius: "999px",
            display: "inline-block",
            height: "1rem",
            width: "1rem",
          }}
        />
      ))}
    </div>
  );
}

export default async function ThemesPage({ params }) {
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
  const activeThemeId = installation?.themeId ?? DEFAULT_THEME_ID;

  const themes = themeRegistry.list();

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Appearance / Themes</p>
          <h1 className="page-title">Themes</h1>
          <p className="page-subtitle">
            The theme controls layout, block palette, and default colors for
            /{site.slug}. Switching themes resets any custom color overrides
            saved on the Design Tokens page.
          </p>
        </div>
      </div>

      <div className="grid-responsive">
        {themes.map((manifest) => {
          const isActive = manifest.id === activeThemeId;
          return (
            <div className="card stack-sm" key={manifest.id}>
              <div
                style={{
                  aspectRatio: "16 / 10",
                  background: "var(--surface-raised)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius)",
                }}
              />
              <div className="quick-link-title">{manifest.name}</div>
              <div className="quick-link-body">{manifest.description}</div>
              <Swatches overrides={manifest.defaultTokenOverrides} />
              {isActive ? (
                <span className="badge badge-published">Active</span>
              ) : (
                <form action={installTheme.bind(null, site.id, manifest.id)}>
                  <button className="btn btn-ghost" type="submit">
                    Activate
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
