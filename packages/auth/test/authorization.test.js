import { describe, expect, it } from "vitest";

import { AuthError } from "../src/errors.js";
import {
  assertOrgMembership,
  assertRole,
  assertSiteAccess,
} from "../src/authorization.js";

const MEMBERSHIPS = [
  {
    organizationId: "org_1",
    userId: "user_1",
    role: "owner",
    status: "active",
  },
  {
    organizationId: "org_2",
    userId: "user_2",
    role: "member",
    status: "active",
  },
  {
    organizationId: "org_3",
    userId: "user_1",
    role: "member",
    status: "revoked",
  },
];

describe("cross-tenant authorization", () => {
  it("allows a user with active membership in their own organization", () => {
    const membership = assertOrgMembership(
      { userId: "user_1" },
      "org_1",
      MEMBERSHIPS,
    );
    expect(membership.role).toBe("owner");
  });

  it("denies a user access to an organization they do not belong to", () => {
    expect(() =>
      assertOrgMembership({ userId: "user_1" }, "org_2", MEMBERSHIPS),
    ).toThrow(AuthError);
  });

  it("denies cross-tenant access even for a valid user ID in a different org", () => {
    expect(() =>
      assertOrgMembership({ userId: "user_2" }, "org_1", MEMBERSHIPS),
    ).toThrow(AuthError);
  });

  it("denies access when the membership is not active", () => {
    expect(() =>
      assertOrgMembership({ userId: "user_1" }, "org_3", MEMBERSHIPS),
    ).toThrow(AuthError);
  });

  it("denies site access when the site belongs to another organization", () => {
    expect(() =>
      assertSiteAccess(
        { userId: "user_1" },
        { organizationId: "org_2" },
        MEMBERSHIPS,
      ),
    ).toThrow(AuthError);
  });

  it("allows site access when the site belongs to the actor's organization", () => {
    const membership = assertSiteAccess(
      { userId: "user_1" },
      { organizationId: "org_1" },
      MEMBERSHIPS,
    );
    expect(membership.organizationId).toBe("org_1");
  });

  it("denies an action when the membership's role is not allowed", () => {
    const membership = { role: "member" };
    expect(() => assertRole(membership, ["owner", "admin"])).toThrow(AuthError);
  });

  it("allows an action when the membership's role is allowed", () => {
    expect(() =>
      assertRole({ role: "owner" }, ["owner", "admin"]),
    ).not.toThrow();
  });
});
