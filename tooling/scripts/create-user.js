import { hashPassword } from "@openforge/auth";
import { createDbClient, schema } from "@openforge/db";

const connectionString =
  process.env.DATABASE_URL ??
  "postgres://openforge:openforge_dev_only@localhost:5432/openforge";

function readArg(flag) {
  const prefix = `--${flag}=`;
  const match = process.argv.find((arg) => arg.startsWith(prefix));
  return match ? match.slice(prefix.length) : undefined;
}

const email = (readArg("email") ?? process.env.CREATE_USER_EMAIL ?? "")
  .trim()
  .toLowerCase();
const password = readArg("password") ?? process.env.CREATE_USER_PASSWORD;
const displayName =
  readArg("name") ?? process.env.CREATE_USER_NAME ?? "OpenForge Admin";

if (!email || !password) {
  process.stderr.write(
    'Usage: node tooling/scripts/create-user.js --email=you@example.com --password=secret [--name="Your Name"]\n' +
      "(or set CREATE_USER_EMAIL / CREATE_USER_PASSWORD / CREATE_USER_NAME)\n",
  );
  process.exitCode = 1;
  process.exit();
}

/**
 * Provision this OpenForge CMS install's one local user, with a personal
 * organization behind the scenes so packages/auth's existing org-scoped
 * authorization (assertOrgMembership/assertSiteAccess) keeps working
 * unchanged even though the product only ever shows one person's sites.
 * Safe to re-run: an existing user is left as-is, and only gets a personal
 * organization provisioned if they don't already belong to one.
 */
async function main() {
  const { db, close } = createDbClient({ connectionString });

  try {
    const allUsers = await db.select().from(schema.users);
    let user = allUsers.find((candidate) => candidate.email === email);

    if (!user) {
      [user] = await db
        .insert(schema.users)
        .values({
          email,
          displayName,
          passwordHash: hashPassword(password),
        })
        .returning();
      process.stdout.write(`Created user ${email}.\n`);
    } else {
      process.stdout.write(`User ${email} already exists.\n`);
    }

    const allMemberships = await db.select().from(schema.organizationMembers);
    const memberships = allMemberships.filter(
      (membership) => membership.userId === user.id,
    );

    if (memberships.some((membership) => membership.status === "active")) {
      process.stdout.write(
        "Already has an active organization. Nothing to do.\n",
      );
      return;
    }

    const [organization] = await db
      .insert(schema.organizations)
      .values({
        name: `${displayName}'s Workspace`,
        slug: `workspace-${user.id.slice(0, 8)}`,
        createdBy: user.id,
      })
      .returning();

    await db.insert(schema.organizationMembers).values({
      organizationId: organization.id,
      userId: user.id,
      role: "owner",
    });

    process.stdout.write(
      `Provisioned personal workspace for ${email}. Log in at /login and create a site.\n`,
    );
  } finally {
    await close();
  }
}

main().catch((error) => {
  process.stderr.write(`${error.stack ?? error.message}\n`);
  process.exitCode = 1;
});
