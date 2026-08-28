import { hashPassword } from "@openforge/auth";
import { createDbClient, schema } from "@openforge/db";

const connectionString =
  process.env.DATABASE_URL ??
  "postgres://openforge:openforge_dev_only@localhost:5432/openforge";

async function main() {
  const { db, close } = createDbClient({ connectionString });

  try {
    const [user] = await db
      .insert(schema.users)
      .values({
        email: `demo-${Date.now()}@openforge.dev`,
        displayName: "Demo Author",
        passwordHash: hashPassword("demo-password-please-change"),
      })
      .returning();

    const [organization] = await db
      .insert(schema.organizations)
      .values({
        name: "Demo Organization",
        slug: `demo-org-${Date.now()}`,
        createdBy: user.id,
      })
      .returning();

    await db.insert(schema.organizationMembers).values({
      organizationId: organization.id,
      userId: user.id,
      role: "owner",
    });

    const [site] = await db
      .insert(schema.sites)
      .values({
        organizationId: organization.id,
        name: "Demo Site",
        slug: "demo",
        status: "published",
        createdBy: user.id,
      })
      .returning();

    await db.insert(schema.themeInstallations).values({
      siteId: site.id,
      themeId: "openforge-theme.default",
      themeVersion: "1.0.0",
      config: {},
    });

    const [page] = await db
      .insert(schema.contentItems)
      .values({
        siteId: site.id,
        type: "page",
        status: "published",
        slug: "home",
        title: "Welcome to OpenForge CMS",
        authorId: user.id,
        publishedAt: new Date(),
        blockTree: [
          {
            blockId: "openforge-cms.hero",
            blockVersion: 1,
            props: {
              heading: "Welcome to OpenForge CMS",
              subheading: "This page is rendered entirely from the database.",
              ctaLabel: "Learn more",
              ctaHref: "https://github.com/umarilyas02/OpenForge",
            },
          },
          {
            blockId: "openforge-cms.rich-text",
            blockVersion: 1,
            props: {
              content:
                "This page was created by tooling/scripts/seed-cms-demo.mjs and is served by apps/cms-renderer.",
            },
          },
        ],
      })
      .returning();

    process.stdout.write(
      `Seeded site "${site.slug}" with page "${page.slug}" (site id: ${site.id}, page id: ${page.id}).\n` +
        `Request it from apps/cms-renderer with a "Host: demo.localhost:<port>" header.\n`,
    );
  } finally {
    await close();
  }
}

main().catch((error) => {
  process.stderr.write(`${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
