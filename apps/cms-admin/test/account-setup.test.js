import { createDrizzleSessionStore, createSessionManager } from "@openforge/auth";
import { schema } from "@openforge/db";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import pg from "pg";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  createInitialAccount,
  hasAnyUsers,
} from "../src/lib/account-setup.js";

const connectionString =
  process.env.DATABASE_URL ??
  "postgres://openforge:openforge_dev_only@localhost:5432/openforge";

async function probeDatabase() {
  const client = new pg.Client({ connectionString });
  try {
    await client.connect();
    await client.query("select 1");
    return true;
  } catch {
    return false;
  } finally {
    await client.end().catch(() => {});
  }
}

const available = await probeDatabase();

// This suite asserts on the *global* emptiness of the `users` table, which
// the shared dev/test Postgres database is never actually empty of (every
// other integration test in this app permanently inserts users and never
// cleans them up). To test the real first-run behavior against real
// Postgres without touching that shared, already-populated data, each test
// here runs against a throwaway Postgres schema (created fresh, dropped at
// the end) reached through a single dedicated connection with its
// `search_path` pointed at that schema — so the unqualified `users`,
// `organizations`, etc. table names the app code and Drizzle schema use
// resolve to genuinely empty tables, backed by a real Postgres connection
// and real SQL (not an in-memory fake).
describe.skipIf(!available)(
  "first-run account setup — real Postgres, isolated schema",
  () => {
    const schemaName = `test_account_setup_${Date.now()}`;
    let client;
    let db;

    beforeAll(async () => {
      client = new pg.Client({ connectionString });
      await client.connect();
      await client.query(`create schema "${schemaName}"`);
      await client.query(`set search_path to "${schemaName}", public`);
      await client.query("create table users (like public.users including all)");
      await client.query(
        "create table organizations (like public.organizations including all)",
      );
      await client.query(
        "create table organization_members (like public.organization_members including all)",
      );
      await client.query(
        "create table sessions (like public.sessions including all)",
      );
      db = drizzle(client, { schema });
    });

    afterAll(async () => {
      await client.query(`drop schema if exists "${schemaName}" cascade`);
      await client.end();
    });

    it("reports no users on a fresh install, so /login would show the setup form", async () => {
      expect(await hasAnyUsers(db)).toBe(false);
    });

    it("rejects an invalid submission with real validation before touching the database", async () => {
      const missingName = await createInitialAccount(db, {
        email: "owner@example.com",
        password: "a-strong-password",
        displayName: "  ",
      });
      expect(missingName.error).toMatch(/name/i);

      const badEmail = await createInitialAccount(db, {
        email: "not-an-email",
        password: "a-strong-password",
        displayName: "Owner",
      });
      expect(badEmail.error).toMatch(/email/i);

      const shortPassword = await createInitialAccount(db, {
        email: "owner@example.com",
        password: "short",
        displayName: "Owner",
      });
      expect(shortPassword.error).toMatch(/password/i);

      // None of the rejected attempts should have written anything.
      expect(await hasAnyUsers(db)).toBe(false);
    });

    it("creates the real user, a personal organization, and an owner membership, and issues a working session", async () => {
      const result = await createInitialAccount(db, {
        email: "Founder@Example.com",
        password: "correct horse battery staple",
        displayName: "Founder",
      });

      expect(result.error).toBeNull();
      expect(result.user.email).toBe("founder@example.com");
      expect(result.user.passwordHash).toMatch(/^scrypt:/);
      expect(result.organization.createdBy).toBe(result.user.id);

      const [membership] = await db
        .select()
        .from(schema.organizationMembers)
        .where(eq(schema.organizationMembers.userId, result.user.id));
      expect(membership.organizationId).toBe(result.organization.id);
      expect(membership.role).toBe("owner");

      // Logs them in exactly like a successful login() would: a real,
      // verifiable session for the new user.
      const sessionManager = createSessionManager({
        store: createDrizzleSessionStore({ db }),
      });
      const { token } = await sessionManager.issue({ userId: result.user.id });
      const verified = await sessionManager.verify(token);
      expect(verified.userId).toBe(result.user.id);
    });

    it("no longer reports a fresh install, so /login would fall back to the normal sign-in form", async () => {
      expect(await hasAnyUsers(db)).toBe(true);
    });

    it("refuses to create a second account now that one exists, and leaves the database unchanged", async () => {
      const result = await createInitialAccount(db, {
        email: "second-user@example.com",
        password: "another-strong-password",
        displayName: "Second User",
      });

      expect(result.error).toMatch(/already/i);
      expect(result.user).toBeUndefined();

      const allUsers = await db.select().from(schema.users);
      expect(allUsers).toHaveLength(1);
      expect(allUsers[0].email).toBe("founder@example.com");
    });

    it("two concurrent first submissions on separate connections can't both win: exactly one account is created", async () => {
      // A real race needs two genuinely separate Postgres connections (one
      // connection can't run two overlapping transactions at once) — both
      // pointed at a second, equally fresh schema dedicated to this test,
      // since the suite's shared schema above already has its one account.
      const raceSchemaName = `${schemaName}_race`;
      const setupClient = new pg.Client({ connectionString });
      const clientA = new pg.Client({ connectionString });
      const clientB = new pg.Client({ connectionString });
      try {
        await setupClient.connect();
        await setupClient.query(`create schema "${raceSchemaName}"`);
        await setupClient.query(
          `set search_path to "${raceSchemaName}", public`,
        );
        await setupClient.query(
          "create table users (like public.users including all)",
        );
        await setupClient.query(
          "create table organizations (like public.organizations including all)",
        );
        await setupClient.query(
          "create table organization_members (like public.organization_members including all)",
        );

        await Promise.all([clientA.connect(), clientB.connect()]);
        await Promise.all([
          clientA.query(`set search_path to "${raceSchemaName}", public`),
          clientB.query(`set search_path to "${raceSchemaName}", public`),
        ]);
        const dbA = drizzle(clientA, { schema });
        const dbB = drizzle(clientB, { schema });

        const [first, second] = await Promise.all([
          createInitialAccount(dbA, {
            email: "racer-one@example.com",
            password: "racer-one-password",
            displayName: "Racer One",
          }),
          createInitialAccount(dbB, {
            email: "racer-two@example.com",
            password: "racer-two-password",
            displayName: "Racer Two",
          }),
        ]);

        const results = [first, second];
        const succeeded = results.filter((result) => !result.error);
        const failed = results.filter((result) => result.error);
        expect(succeeded).toHaveLength(1);
        expect(failed).toHaveLength(1);
        expect(failed[0].error).toMatch(/already/i);

        const allUsers = await setupClient
          .query('select email from "users"')
          .then((res) => res.rows);
        expect(allUsers).toHaveLength(1);
      } finally {
        await setupClient.query(
          `drop schema if exists "${raceSchemaName}" cascade`,
        );
        await setupClient.end();
        await clientA.end();
        await clientB.end();
      }
    });
  },
);
