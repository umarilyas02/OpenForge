import { assertSiteAccess, hashPassword } from "@openforge/auth";
import { createDbClient, schema } from "@openforge/db";
import { defaultThemeBlockRegistry } from "@openforge/theme-default";
import { and, eq } from "drizzle-orm";
import { describe, expect, it } from "vitest";

import { prepareContentTreeForSave } from "../src/lib/content-tree-ops.js";

const connectionString =
  process.env.DATABASE_URL ??
  "postgres://openforge:openforge_dev_only@localhost:5432/openforge";

async function probeDatabase() {
  const client = createDbClient({ connectionString });
  try {
    await client.db.execute("select 1");
    return true;
  } catch {
    return false;
  } finally {
    await client.close();
  }
}

const available = await probeDatabase();

describe.skipIf(!available)(
  "save content — same path the Server Action uses",
  () => {
    it("authorizes, migrates/validates a nested tree, and persists it with a revision", async () => {
      const { db, close } = createDbClient({ connectionString });

      try {
        const [user] = await db
          .insert(schema.users)
          .values({
            email: `save-content-test-${Date.now()}@example.test`,
            displayName: "Save Content Test",
            passwordHash: hashPassword("irrelevant-password"),
          })
          .returning();

        const [organization] = await db
          .insert(schema.organizations)
          .values({
            name: "Save Content Test Org",
            slug: `save-content-org-${Date.now()}`,
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
            name: "Save Content Test Site",
            slug: `save-content-site-${Date.now()}`,
            createdBy: user.id,
          })
          .returning();

        const [item] = await db
          .insert(schema.contentItems)
          .values({
            siteId: site.id,
            type: "page",
            status: "draft",
            slug: "home",
            title: "Draft title",
            blockTree: [],
            authorId: user.id,
          })
          .returning();

        const memberships = await db
          .select()
          .from(schema.organizationMembers)
          .where(eq(schema.organizationMembers.userId, user.id));
        assertSiteAccess({ userId: user.id }, site, memberships);

        const rawTree = [
          {
            blockId: "openforge-cms.columns",
            blockVersion: 1,
            props: { heading: "Why OpenForge" },
            slots: {
              items: [
                {
                  blockId: "openforge-cms.rich-text",
                  blockVersion: 1,
                  props: { content: "Column A" },
                },
                {
                  blockId: "openforge-cms.rich-text",
                  blockVersion: 1,
                  props: { content: "Column B" },
                },
              ],
            },
          },
        ];

        const preparedTree = prepareContentTreeForSave(
          rawTree,
          defaultThemeBlockRegistry,
        );

        await db
          .update(schema.contentItems)
          .set({
            title: "Published title",
            status: "published",
            blockTree: preparedTree,
            publishedAt: new Date(),
          })
          .where(eq(schema.contentItems.id, item.id));

        await db.insert(schema.contentRevisions).values({
          contentItemId: item.id,
          blockTree: preparedTree,
          title: "Published title",
          createdBy: user.id,
        });

        const [readBack] = await db
          .select()
          .from(schema.contentItems)
          .where(
            and(
              eq(schema.contentItems.id, item.id),
              eq(schema.contentItems.siteId, site.id),
            ),
          );

        expect(readBack.status).toBe("published");
        expect(readBack.blockTree[0].blockId).toBe("openforge-cms.columns");
        expect(readBack.blockTree[0].slots.items).toHaveLength(2);
        expect(readBack.blockTree[0].slots.items[0].props.content).toBe(
          "Column A",
        );

        const [revision] = await db
          .select()
          .from(schema.contentRevisions)
          .where(eq(schema.contentRevisions.contentItemId, item.id));
        expect(revision.title).toBe("Published title");
      } finally {
        await close();
      }
    });

    it("denies saving to a site outside the actor's organization", async () => {
      const { db, close } = createDbClient({ connectionString });

      try {
        const [outsider] = await db
          .insert(schema.users)
          .values({
            email: `outsider-${Date.now()}@example.test`,
            displayName: "Outsider",
            passwordHash: hashPassword("irrelevant-password"),
          })
          .returning();

        const [owner] = await db
          .insert(schema.users)
          .values({
            email: `owner-${Date.now()}@example.test`,
            displayName: "Owner",
            passwordHash: hashPassword("irrelevant-password"),
          })
          .returning();

        const [organization] = await db
          .insert(schema.organizations)
          .values({
            name: "Owner Org",
            slug: `owner-org-${Date.now()}`,
            createdBy: owner.id,
          })
          .returning();

        const [site] = await db
          .insert(schema.sites)
          .values({
            organizationId: organization.id,
            name: "Owner Site",
            slug: `owner-site-${Date.now()}`,
            createdBy: owner.id,
          })
          .returning();

        const outsiderMemberships = await db
          .select()
          .from(schema.organizationMembers)
          .where(eq(schema.organizationMembers.userId, outsider.id));

        expect(() =>
          assertSiteAccess({ userId: outsider.id }, site, outsiderMemberships),
        ).toThrow();
      } finally {
        await close();
      }
    });
  },
);
