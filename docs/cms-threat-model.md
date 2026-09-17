# CMS threat model

Applies to `apps/cms-admin`, the active product — a self-hosted,
single-user, WordPress+Elementor-style CMS. Written from direct reading of
the current code, not a generic template; every control cited names the
file that implements it. Last reviewed 2026-09-17.

## What this system actually is, for threat-modeling purposes

- **Single admin user by design.** The org/membership data model still
  exists underneath (`packages/auth`'s `assertOrgMembership`), but the
  product surfaces no signup, no org switcher, no invite flow beyond
  `users/actions.js`'s "add a member to my one site's org." The realistic
  threat actor is therefore **not** another tenant on the same install —
  it's the public internet (if this instance is reachable from it) and,
  for supply-chain concerns, this repository's own dependency tree.
- **The instance's own files are its most valuable asset.** Per
  `CLAUDE.md`'s core architectural fact, a site's real content *is* its
  on-disk Next.js project — there's no separate "content database" to
  restore from if `SITES_STORAGE_PATH` is lost or corrupted. Postgres
  holds metadata (accounts, which sites exist, theme/menu config, vaulted
  secret references) but not the sites' actual substance.
- **BYOK GitHub push is the one place this app reaches out to a live
  third-party credential** (a user-supplied PAT). AI assistance
  (`packages/ai`) is part of the shelved editor product line, not wired
  into `apps/cms-admin` — not a live attack surface here.

## Assets, ranked by what actually breaks if compromised

1. **`SITES_STORAGE_PATH`** — every site's real files. Loss = data loss
   with no fallback. Tampering = a site silently serves attacker content.
2. **`DATABASE_URL` credential / Postgres data** — account records, which
   sites exist, theme/menu config, and `secrets.encrypted_value` (opaque
   ciphertext without `ENCRYPTION_MASTER_KEY`).
3. **`ENCRYPTION_MASTER_KEY`** — decrypts every vaulted secret (currently:
   connected GitHub PATs) via `@openforge/integration-security`'s
   AES-256-GCM envelope encryption (`packages/integration-security`). Its
   compromise, *combined with* database access, decrypts every vaulted
   secret; alone (without DB access) it decrypts nothing.
4. **Session cookie / session table** — full admin control of the
   instance for that session's lifetime (session TTL default 30 days,
   `packages/auth/src/session.js`).
5. **A connected GitHub PAT** — whatever that token itself is scoped to
   (the app's own guidance in `GitHubConnectionPanel.jsx` recommends a
   fine-grained, single-repo, Contents-only token specifically to bound
   this).

## Trust boundaries and what actually guards them

| Boundary | Control | Evidence |
|---|---|---|
| Anonymous → authenticated | Session cookie, `httpOnly`, `secure` in production, `sameSite: lax` | `app/(admin)/login/actions.js` |
| Session token at rest | Only a SHA-256 hash is stored; the raw token exists only in the cookie and at issue time | `packages/auth/src/session.js` |
| Authenticated → site-scoped action | `assertSiteAccess` against real org membership, checked per-request (not cached) | `packages/auth`, audited 2026-09-17 across every `app/(admin)/(app)/sites/[siteId]/**` `actions.js`/`route.js` — see `agents/progress.md`'s "Current handoff"; found and fixed one real gap (`getSiteGitConnection`) |
| Site-scoped page render → Server Action/Route Handler | **Not the same boundary** — Next.js layouts (which is where `[siteId]/layout.jsx` puts its `assertSiteAccess` check) do not wrap Route Handlers or Server Actions (`CLAUDE.md`'s own hard constraint, and the exact class of bug the 2026-09-17 audit found) | `app/(admin)/(app)/sites/[siteId]/layout.jsx` vs. every sibling `actions.js` |
| A route param used as a Postgres `uuid` lookup | `isUuid()` validated before the query runs, so a malformed id 404s instead of surfacing a raw driver error | `apps/cms-admin/src/lib/uuid.js`, `preview/[siteId]`, `tools/export/route.js` |
| A workspace id used as a filesystem path segment | Validated against `/^[a-z0-9][a-z0-9_-]{0,63}$/u` before path resolution — rejects `../` and any other traversal attempt | `packages/workspace/src/workspace-manager.js`'s `getWorkspacePath` |
| A GitHub PAT in transit to `git push` | Passed as a one-off `-c http.extraheader`, scoped to that single invocation — never written to `.git/config`, never logged | `apps/cms-admin/src/lib/site-git.js`'s `pushSiteChanges`, covered by a real local-bare-repo test in `test/site-git.test.js` |
| A GitHub PAT at rest | AES-256-GCM envelope encryption; only a vault reference (`secretRef`) is stored in Postgres, never the plaintext | `packages/integration-security`, `secret-db-storage.js` |
| Asset bytes served to `<img>` tags | HMAC-signed URL with a short TTL, verified in the route itself — deliberately outside the `(admin)` auth group since a browser `<img>` request can't carry the session cookie's auth context the way a fetch could | `app/assets/[...key]/route.js` |
| CSRF on Server Actions | Next.js's built-in Origin-header check for Server Action POSTs (framework-level, not app code) — not independently verified in this pass | *(not yet audited — see Open questions)* |

## Concrete attack scenarios considered

**Cross-tenant/cross-site data leak via a Server Action.** Real, found,
fixed (`getSiteGitConnection`, 2026-09-17 — see `agents/progress.md`).
The general shape: any exported function in a `"use server"` module is a
real client-callable RPC endpoint regardless of which page happens to
render a form that calls it, so *every* export needs its own
authorization check, not just the ones a page's own UI currently exposes.
The rest of the site-scoped surface was hand-audited the same day and
found correctly covered by a shared `loadAuthorizedSite` helper per file
— but this is exactly the class of bug most likely to recur the next time
a new Server Action is added without following that convention, and nothing
currently *enforces* the convention beyond code review.

**Path traversal via a crafted site slug or workspace id.** Not exploitable
as far as this review found — `WORKSPACE_ID`'s regex is checked before any
filesystem operation, and slugs are separately validated
(`SLUG_PATTERN`) before ever reaching `WorkspaceManager`.

**A malformed/adversarial `uuid` route param causing a raw 500 that leaks
a stack trace or query shape.** Mitigated where `isUuid()` is used, per
the table above. Not verified: whether *every* route accepting a param
destined for a `uuid` column actually calls it (this pass checked the
ones `CLAUDE.md` calls out by name; a full sweep wasn't done).

**Supply-chain: a known-vulnerable dependency shipping in production.**
Real, found, fixed 2026-09-17: two critical unauthenticated Next.js RCEs
were actually present in the pinned version (see `agents/progress.md`).
A `dependency-audit` CI job now runs `pnpm audit --prod --audit-level
high` on every push specifically because this class of issue had zero
automated coverage before that point.

**Secret leakage into logs or error responses.** `pushToGitHub`'s error
path truncates and returns `error.stderr`/`error.message` to the client
(`settings/actions.js`) — reviewed and found to not embed the token
itself (the token is passed via `http.extraheader`, never interpolated
into a command string git would echo back on failure), but this wasn't
independently fuzzed against every possible git failure mode.

**A user with a valid session but a revoked/expired token continuing to
act.** Covered structurally — `verify()` throws on `revokedAt` or an
expired `expiresAt` before returning a usable session record
(`packages/auth/src/session.js`) — but there's no session-list/"sign out
everywhere" UI surface to actually revoke a suspected-compromised session
today; only `tooling/scripts/create-user.js`-level access to the database
could do it.

## Out of scope for this instance's actual deployment shape

- **Multi-tenant isolation hardening beyond what's already audited** — the
  product is single-user by explicit design (see CMS.12 in
  `agents/progress.md`); the org/membership model exists but isn't a live
  multi-tenant boundary anyone currently depends on.
- **Plugin/extension sandboxing** — `packages/plugin-runtime`/
  `plugin-sdk` are shelved to `future-work/`, not part of the active
  build.
- **AI-proposal-pipeline threats** (prompt injection into proposed diffs,
  context leakage) — `packages/ai` is part of the shelved editor product
  line; not reachable from `apps/cms-admin` today.

## Open questions / not yet done

- CSRF behavior for Server Actions has not been independently verified
  beyond trusting the framework's built-in Origin check — worth an actual
  adversarial test (cross-origin form POST attempt) rather than relying on
  Next.js's documentation of the behavior.
- No full sweep of every `uuid`-typed route param for `isUuid()` coverage
  — only the ones already known/documented were checked.
- No fuzzing of git error paths for secret leakage in `pushToGitHub`'s
  error message.
- No session-revocation UI (a real gap for "I think my session leaked" —
  currently requires direct database access to fix).
- This document itself has not had independent/second-party review
  (`agents/progress.md`'s Phase 6.2 "Independent review where feasible" is
  still unstarted) — treat it as a single reviewer's pass, not a
  guarantee.
