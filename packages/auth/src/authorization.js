import { invariant } from "./errors.js";

/**
 * Assert that `actor` has an active membership in `organizationId`, given
 * an already-fetched list of memberships. Pure and DB-agnostic so it can be
 * unit-tested without a database, and reused wherever membership rows have
 * already been loaded.
 *
 * @param {{ userId: string }} actor
 * @param {string} organizationId
 * @param {Array<{ organizationId: string, userId: string, role: string, status: string }>} memberships
 */
export function assertOrgMembership(actor, organizationId, memberships) {
  const membership = memberships.find(
    (candidate) =>
      candidate.organizationId === organizationId &&
      candidate.userId === actor.userId &&
      candidate.status === "active",
  );

  invariant(
    membership,
    "OF_AUTH_ORG_ACCESS_DENIED",
    "The actor is not an active member of this organization.",
    { organizationId },
  );

  return membership;
}

/**
 * Assert that `actor` can access a site by way of an active membership in
 * the site's owning organization.
 *
 * @param {{ userId: string }} actor
 * @param {{ organizationId: string }} site
 * @param {Array<{ organizationId: string, userId: string, role: string, status: string }>} memberships
 */
export function assertSiteAccess(actor, site, memberships) {
  return assertOrgMembership(actor, site.organizationId, memberships);
}

/**
 * Assert that a membership's role is one of the allowed roles for an
 * action (e.g. only "owner"/"admin" may delete a site).
 *
 * @param {{ role: string }} membership
 * @param {string[]} allowedRoles
 */
export function assertRole(membership, allowedRoles) {
  invariant(
    allowedRoles.includes(membership.role),
    "OF_AUTH_ROLE_DENIED",
    `Role "${membership.role}" is not permitted for this action.`,
    { role: membership.role, allowedRoles },
  );
}
