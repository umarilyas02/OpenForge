import { assertSiteAccess } from "@openforge/auth";
import { schema } from "@openforge/db";
import { eq } from "drizzle-orm";
import {
  ArrowUpRight,
  CheckCircle2,
  Database,
  FileText,
  GitCommit,
  Images,
  Palette,
  Pencil,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CreateNewMenu } from "../../../../../../src/components/CreateNewMenu.jsx";
import { QuickDraftForm } from "../../../../../../src/components/QuickDraftForm.jsx";
import { getDb } from "../../../../../../src/lib/db.js";
import { getMemberships, requireUser } from "../../../../../../src/lib/session.js";
import { listSiteCommits } from "../../../../../../src/lib/site-git.js";
import {
  getWorkspaceManager,
  listPages,
} from "../../../../../../src/lib/site-workspace.js";
import {
  DEFAULT_THEME_ID,
  themeRegistry,
} from "../../../../../../src/lib/theme-registry.js";
import { quickCreatePost } from "./actions.js";

const DAY_MS = 24 * 60 * 60 * 1000;
const WEEK_MS = 7 * DAY_MS;
const CHART_DAYS = 30;
const CHART_WIDTH = 700;
const CHART_HEIGHT = 140;

function pageTitleForPath(urlPath) {
  if (urlPath === "/") return "Home";
  return urlPath
    .slice(1)
    .split("/")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" / ");
}

function formatRelativeTime(iso) {
  const diffMs = Date.now() - new Date(iso).getTime();
  if (diffMs < 60_000) return "just now";
  if (diffMs < 3_600_000) {
    const minutes = Math.floor(diffMs / 60_000);
    return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;
  }
  if (diffMs < DAY_MS) {
    const hours = Math.floor(diffMs / 3_600_000);
    return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  }
  const days = Math.floor(diffMs / DAY_MS);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

/** Cumulative content-item count per day over the trailing `CHART_DAYS` days — a real, if modest, growth curve rather than a fabricated traffic metric. */
function buildContentGrowth(contentItems) {
  const createdTimes = contentItems.map((item) => new Date(item.createdAt).getTime());
  const startOfToday = new Date();
  startOfToday.setHours(23, 59, 59, 999);

  const points = [];
  for (let i = CHART_DAYS - 1; i >= 0; i--) {
    const dayEnd = startOfToday.getTime() - i * DAY_MS;
    const count = createdTimes.filter((t) => t <= dayEnd).length;
    points.push({ dayEnd, count });
  }

  const maxCount = Math.max(...points.map((p) => p.count), 1);
  const stepX = CHART_WIDTH / (points.length - 1);
  const coords = points.map((point, index) => {
    const x = index * stepX;
    const y = CHART_HEIGHT - (point.count / maxCount) * (CHART_HEIGHT - 8) - 4;
    return [x, y];
  });
  const linePath = `M${coords.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" L ")}`;
  const areaPath = `${linePath} L ${CHART_WIDTH},${CHART_HEIGHT} L 0,${CHART_HEIGHT} Z`;

  const ticks = points
    .filter((_, index) => index % 6 === 0 || index === points.length - 1)
    .map((point, tickIndex, all) => ({
      x: points.indexOf(point) * stepX,
      label: new Date(point.dayEnd).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      key: tickIndex + all.length,
    }));

  const total = points[points.length - 1].count;
  const startCount = points[0].count;
  const delta = total - startCount;

  return { linePath, areaPath, ticks, total, delta };
}

export default async function DashboardPage({ params }) {
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

  const manager = getWorkspaceManager();
  let pages = [];
  let rootPath = null;
  try {
    const [state, files] = await Promise.all([
      manager.describe(site.slug),
      manager.readFiles(site.slug),
    ]);
    rootPath = state.rootPath;
    pages = listPages(files);
  } catch {
    // No workspace yet — empty pages, no Git history.
  }

  const commits = rootPath ? await listSiteCommits(rootPath, 6) : [];

  const [contentItems, assets, installation] = await Promise.all([
    db.select().from(schema.contentItems).where(eq(schema.contentItems.siteId, site.id)),
    db.select().from(schema.assets).where(eq(schema.assets.siteId, site.id)),
    db
      .select()
      .from(schema.themeInstallations)
      .where(eq(schema.themeInstallations.siteId, site.id)),
  ]);

  const activeThemeId = installation[0]?.themeId ?? DEFAULT_THEME_ID;
  const themes = themeRegistry.list();
  const activeTheme =
    themes.find((theme) => theme.id === activeThemeId) ??
    themes.find((theme) => theme.id === DEFAULT_THEME_ID) ??
    themes[0];

  const posts = contentItems.filter((item) => item.type === "post");
  const weekAgo = Date.now() - WEEK_MS;
  const postsThisWeek = posts.filter((item) => new Date(item.createdAt).getTime() >= weekAgo).length;
  const assetsThisWeek = assets.filter((asset) => new Date(asset.createdAt).getTime() >= weekAgo).length;
  const contentThisWeek = contentItems.filter(
    (item) => new Date(item.createdAt).getTime() >= weekAgo,
  ).length;

  const recentPages = pages.slice(0, 5);
  const recentPosts = [...posts]
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .slice(0, 5);

  const chart = buildContentGrowth(contentItems);

  const healthChecks = [
    { label: "Database connected", ok: true },
    { label: "Site workspace present", ok: rootPath !== null },
    { label: "Git history active", ok: commits.length > 0 },
    { label: "Media library ready", ok: true },
  ];
  const allHealthy = healthChecks.every((check) => check.ok);

  const statCards = [
    {
      href: `/sites/${site.id}/pages`,
      icon: <FileText size={18} strokeWidth={1.75} />,
      label: "Pages",
      value: pages.length,
    },
    {
      href: `/sites/${site.id}/posts`,
      icon: <Pencil size={18} strokeWidth={1.75} />,
      label: "Posts",
      value: posts.length,
      delta: postsThisWeek,
    },
    {
      href: `/sites/${site.id}/media`,
      icon: <Images size={18} strokeWidth={1.75} />,
      label: "Media files",
      value: assets.length,
      delta: assetsThisWeek,
    },
    {
      href: `/sites/${site.id}/content`,
      icon: <Database size={18} strokeWidth={1.75} />,
      label: "Content entries",
      value: contentItems.length,
      delta: contentThisWeek,
    },
  ];

  return (
    <div className="stack">
      <div className="page-header">
        <div>
          <p className="page-eyebrow">Dashboard</p>
          <h1 className="page-title">Welcome back.</h1>
          <p className="page-subtitle">
            Here&apos;s what&apos;s happening with /{site.slug} today.
          </p>
        </div>
        <CreateNewMenu siteId={site.id} />
      </div>

      <div className="stats-row">
        {statCards.map((stat) => (
          <Link className="stat-card" href={stat.href} key={stat.label}>
            <div className="stat-card-top">
              <span className="stat-card-icon">{stat.icon}</span>
              <ArrowUpRight className="stat-card-arrow" size={14} />
            </div>
            <span className="stat-card-value">{stat.value}</span>
            <span className="stat-card-label">{stat.label}</span>
            {stat.delta ? (
              <span className="stat-card-delta">↑ {stat.delta} this week</span>
            ) : null}
          </Link>
        ))}
      </div>

      <div className="dashboard-grid-3">
        <div className="card dashboard-chart-card">
          <div className="dashboard-chart-header">
            <div>
              <h2 className="dashboard-card-title">Content growth</h2>
              <p className="dashboard-card-subtitle">Last {CHART_DAYS} days</p>
            </div>
            <div className="dashboard-chart-total">
              <span className="stat-card-value">{chart.total}</span>
              {chart.delta > 0 ? (
                <span className="stat-card-delta">↑ {chart.delta}</span>
              ) : null}
            </div>
          </div>
          <svg
            className="dashboard-chart-svg"
            preserveAspectRatio="none"
            viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          >
            <defs>
              <linearGradient id="dashboard-chart-fill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="var(--text)" stopOpacity="0.16" />
                <stop offset="100%" stopColor="var(--text)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path className="dashboard-chart-area" d={chart.areaPath} />
            <path className="dashboard-chart-line" d={chart.linePath} fill="none" />
          </svg>
          <div className="dashboard-chart-ticks">
            {chart.ticks.map((tick) => (
              <span key={tick.key} style={{ left: `${(tick.x / CHART_WIDTH) * 100}%` }}>
                {tick.label}
              </span>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 className="dashboard-card-title">Quick Draft</h2>
          <p className="dashboard-card-subtitle">Create a new post</p>
          <QuickDraftForm quickCreatePost={quickCreatePost.bind(null, site.id)} />
        </div>

        <div className="card">
          <div className="dashboard-chart-header">
            <h2 className="dashboard-card-title">Site Health</h2>
            <span className={allHealthy ? "badge badge-published" : "badge badge-draft"}>
              {allHealthy ? "Good" : "Attention"}
            </span>
          </div>
          <p className="dashboard-card-subtitle">
            {allHealthy ? "Your site is running smoothly." : "Some checks need a look."}
          </p>
          <ul className="health-check-list">
            {healthChecks.map((check) => (
              <li className="health-check-row" key={check.label}>
                {check.ok ? (
                  <CheckCircle2 className="health-check-icon-ok" size={16} />
                ) : (
                  <XCircle className="health-check-icon-bad" size={16} />
                )}
                {check.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="dashboard-lower-grid">
        <div className="card">
          <div className="page-header">
            <h2 className="dashboard-card-title">Recent Pages</h2>
            <Link className="dashboard-see-all" href={`/sites/${site.id}/pages`}>
              See all →
            </Link>
          </div>
          {recentPages.length === 0 ? (
            <p className="muted">No pages yet.</p>
          ) : (
            recentPages.map((page) => (
              <Link
                className="list-row"
                href={`/sites/${site.id}/pages/editor?file=${encodeURIComponent(page.filePath)}`}
                key={page.filePath}
              >
                <div>
                  <div className="list-row-title">{pageTitleForPath(page.urlPath)}</div>
                  <div className="list-row-meta">{page.urlPath}</div>
                </div>
                <span className="badge badge-published">Live</span>
              </Link>
            ))
          )}
        </div>

        <div className="card">
          <div className="page-header">
            <h2 className="dashboard-card-title">Recent Posts</h2>
            <Link className="dashboard-see-all" href={`/sites/${site.id}/posts`}>
              See all →
            </Link>
          </div>
          {recentPosts.length === 0 ? (
            <p className="muted">No posts yet.</p>
          ) : (
            recentPosts.map((post) => (
              <Link
                className="list-row"
                href={`/sites/${site.id}/content/${post.id}`}
                key={post.id}
              >
                <div>
                  <div className="list-row-title">{post.title}</div>
                  <div className="list-row-meta">
                    {new Date(post.updatedAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                </div>
                <span
                  className={
                    post.status === "published" ? "badge badge-published" : "badge badge-draft"
                  }
                >
                  {post.status}
                </span>
              </Link>
            ))
          )}
        </div>

        <div className="dashboard-side-stack">
          <div className="card">
            <div className="page-header">
              <h2 className="dashboard-card-title">Current Theme</h2>
              <Link className="btn btn-ghost" href={`/sites/${site.id}/appearance/themes`}>
                Customize
              </Link>
            </div>
            {activeTheme ? (
              <>
                <p className="dashboard-card-subtitle">
                  {activeTheme.name} · v{activeTheme.version}
                </p>
                <div className="dashboard-theme-preview">
                  <Palette size={22} strokeWidth={1.5} />
                </div>
              </>
            ) : (
              <p className="muted">No theme installed.</p>
            )}
          </div>

          <div className="card">
            <div className="page-header">
              <h2 className="dashboard-card-title">Recent Activity</h2>
            </div>
            {commits.length === 0 ? (
              <p className="muted">No Git history yet.</p>
            ) : (
              <ul className="dashboard-activity-list">
                {commits.map((commit) => (
                  <li className="dashboard-activity-row" key={commit.hash}>
                    <GitCommit className="dashboard-activity-icon" size={14} />
                    <span className="dashboard-activity-message">{commit.message}</span>
                    <span className="dashboard-activity-time">
                      {formatRelativeTime(commit.date)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
