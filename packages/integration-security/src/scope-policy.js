import { IntegrationSecurityError, invariant } from "./errors.js";

const LEVEL = Object.freeze({ none: 0, read: 1, write: 2 });

export const PROVIDER_SCOPE_POLICIES = Object.freeze({
  github: Object.freeze({
    "identity:read": Object.freeze({ metadata: "read" }),
    "installation:read": Object.freeze({ metadata: "read" }),
    "repository:inspect": Object.freeze({
      metadata: "read",
      contents: "read",
    }),
    "repository:create": Object.freeze({
      metadata: "read",
      administration: "write",
      contents: "write",
    }),
    "repository:sync": Object.freeze({
      metadata: "read",
      contents: "write",
    }),
    "pull-request:write": Object.freeze({
      metadata: "read",
      contents: "write",
      pull_requests: "write",
    }),
  }),
  vercel: Object.freeze({
    "identity:read": Object.freeze({ user: "read" }),
    "team:read": Object.freeze({ team: "read" }),
    "project:read": Object.freeze({ project: "read" }),
    "project:write": Object.freeze({ project: "write" }),
    "environment:write": Object.freeze({
      project: "read",
      "project-env-vars": "write",
    }),
    "deployment:create": Object.freeze({
      project: "read",
      deployment: "write",
    }),
  }),
});

export function requiredScopes(provider, operations) {
  const policy = PROVIDER_SCOPE_POLICIES[provider];
  invariant(
    policy,
    "OF_SCOPE_PROVIDER_UNKNOWN",
    "The integration provider is unknown.",
    { provider },
  );
  invariant(
    Array.isArray(operations) && operations.length > 0,
    "OF_SCOPE_OPERATIONS_EMPTY",
    "At least one integration operation is required.",
  );
  const result = {};
  for (const operation of operations) {
    const requirement = policy[operation];
    invariant(
      requirement,
      "OF_SCOPE_OPERATION_UNKNOWN",
      "The integration operation is unknown.",
      { provider, operation },
    );
    for (const [scope, level] of Object.entries(requirement)) {
      if ((LEVEL[level] ?? -1) > (LEVEL[result[scope]] ?? -1)) {
        result[scope] = level;
      }
    }
  }
  return Object.freeze(sortObject(result));
}

export function inspectScopes(provider, operations, grantedScopes) {
  const required = requiredScopes(provider, operations);
  const granted = normalizeGrantedScopes(grantedScopes);
  const missing = [];
  const excessive = [];

  for (const [scope, level] of Object.entries(required)) {
    if ((LEVEL[granted[scope]] ?? 0) < LEVEL[level]) {
      missing.push({
        scope,
        required: level,
        granted: granted[scope] ?? "none",
      });
    }
  }
  for (const [scope, level] of Object.entries(granted)) {
    if ((LEVEL[level] ?? 0) > (LEVEL[required[scope]] ?? 0)) {
      excessive.push({
        scope,
        required: required[scope] ?? "none",
        granted: level,
      });
    }
  }

  return {
    provider,
    operations: [...operations],
    required,
    granted,
    missing,
    excessive,
    leastPrivilege: missing.length === 0 && excessive.length === 0,
  };
}

export function assertLeastPrivilege(provider, operations, grantedScopes) {
  const inspection = inspectScopes(provider, operations, grantedScopes);
  if (!inspection.leastPrivilege) {
    throw new IntegrationSecurityError(
      "OF_SCOPE_POLICY_VIOLATION",
      "Granted integration scopes do not match the least-privilege policy.",
      inspection,
    );
  }
  return inspection;
}

function normalizeGrantedScopes(scopes) {
  invariant(
    scopes && typeof scopes === "object" && !Array.isArray(scopes),
    "OF_SCOPE_GRANTS_INVALID",
    "Granted scopes must be an object.",
  );
  const normalized = {};
  for (const [scope, level] of Object.entries(scopes)) {
    invariant(
      LEVEL[level] > 0,
      "OF_SCOPE_LEVEL_INVALID",
      "Scope levels must be read or write.",
      { scope, level },
    );
    normalized[scope] = level;
  }
  return Object.freeze(sortObject(normalized));
}

function sortObject(value) {
  return Object.fromEntries(
    Object.entries(value).sort(([left], [right]) => left.localeCompare(right)),
  );
}
