# CMS operational runbooks

Applies to `apps/cms-admin`, the active product, self-hosted (Docker
Compose or otherwise). Each entry below is grounded in real code read
during the 2026-09-17 hardening pass, not generic advice — file paths are
exact.

## The app won't start / `/healthz` returns 503

`apps/cms-admin/app/healthz/route.js` checks two things and reports which
one is broken in the response body:

- **`database: { ok: false }`** — `DATABASE_URL` is unreachable or wrong.
  Check the Postgres service is actually up
  (`docker compose ps postgres` / `pg_isready`), and that `DATABASE_URL`
  in the app's environment matches the same host/port/credentials the
  `postgres` service in `docker/compose/docker-compose.yml` actually
  uses (they're driven by the same `POSTGRES_*` vars, so a drifted
  `envs/local/infrastructure.env` between the two is the most likely
  cause).
- **`sitesStorage: { ok: false }`** — `SITES_STORAGE_PATH` isn't
  writable. In Docker Compose this is the `cms-admin-sites` named
  volume/bind mount; check the mount actually attached (`docker inspect`
  the container's `Mounts`) and that the container's user (`nextjs`,
  uid 1001 — see the Dockerfile) has write permission on the host path.

If the app fails to boot before `/healthz` is even reachable, check
`DATABASE_URL`'s schema validation first — `packages/config`'s
`cmsAdminEnvSchema` requires it and throws a single actionable error
listing every missing/invalid variable (`packages/config/src/load-env.js`)
on first access, which surfaces in the container's startup logs.

## A site's page won't load, or every save silently fails

This almost always means the site's real on-disk Next.js project
(`SITES_STORAGE_PATH/<slug>/`) is in a state the app doesn't expect —
remember: for this product, **the site's files are its actual content**,
not a cache of something in Postgres (see `CLAUDE.md`'s core
architectural fact).

1. Check the site's own git history via Settings > History
   (`site-git.js`'s `listSiteCommits`) — if it's empty on a site that
   should have real content, the workspace may never have been
   initialized correctly, or `SITES_STORAGE_PATH` may have been swapped
   out from under a running instance.
2. If a save was interrupted mid-write (a crashed process, an OOM kill,
   a forced container restart during a save), the workspace's metadata
   (`.openforge/state.json`, `.openforge/journal.ndjson` — see
   `packages/workspace/src/workspace-manager.js`) can end up with a
   stale revision or leftover `.tmp` files.
   `WorkspaceManager.recover()` reconciles this — remove stale temp
   files, reconcile the revision from the journal — and is real,
   tested code (`packages/workspace/test/workspace-manager.test.js`),
   but as of this writing **nothing in the running app's UI or Server
   Actions calls it** (only `cleanup()`, full deletion via theme
   activation, is wired up). Run it directly:

   ```sh
   node tooling/scripts/recover-site-workspace.js --slug=<site-slug>
   # or, if you only know the site's UUID:
   node tooling/scripts/recover-site-workspace.js --site-id=<uuid>
   ```

   Requires `DATABASE_URL` (only for the `--site-id` lookup) and
   `SITES_STORAGE_PATH` in its environment, same as the app itself.
3. If the workspace directory is missing or corrupted beyond what
   `recover()` reconciles, the real content is only recoverable from
   whatever backup exists — see `docs/cms-backup-and-restore.md`. There
   is no database fallback for a site's actual page content.
4. If pages load but editing throws, check whether the page's JSX is
   still parseable by `@openforge/compiler` — direct edits to a site's
   files outside the app (e.g. a manual git checkout to an old commit
   with a different block API version) can produce source the block-tree
   parser doesn't recognize; per `CLAUDE.md`'s hard constraint, unsupported
   source is meant to fall back to code-only mode rather than being
   rewritten unsafely, not crash the editor.

## Settings > GitHub push fails

`pushToGitHub` (`app/(admin)/(app)/sites/[siteId]/settings/actions.js`)
returns the real git error (truncated to 300 chars) in its response —
read that first. Common real causes, in order of likelihood:

- **The vaulted token expired or was revoked upstream.** Reconnect via
  Settings > GitHub (this re-verifies the token against the real GitHub
  API before saving — `verifyGitHubRepoAccess`,
  `src/lib/github-connection.js`).
- **`ENCRYPTION_MASTER_KEY` changed or is unset.** The vault
  (`@openforge/integration-security`'s `createSecretVault`) can't
  decrypt a secret that was encrypted under a different key — this
  looks like an opaque decryption failure, not an auth error. Confirm
  the running container's `ENCRYPTION_MASTER_KEY` matches what was set
  when the connection was created; if it was legitimately rotated, the
  GitHub connection has to be re-created (disconnect, reconnect), not
  repaired.
- **The branch name changed upstream, or the repo's default branch was
  renamed.** `pushSiteChanges` falls back to `"main"` if the stored
  `defaultBranch` fails `BRANCH_PATTERN` validation, which can silently
  target the wrong branch rather than failing loudly — check the actual
  target branch in the error output against what you expect.

## Everything above looks fine but the canvas editor feels slow

This is a known, measured, *not yet fixed* characteristic of the current
architecture, not necessarily an incident — see `docs/cms-performance.md`.
Every canvas edit does a real `git commit`
(`site-git.js`'s `commitSiteChanges`, called from
`source-content-actions.js`), and the canvas only updates after that
full round trip resolves (`SourceContentEditor.jsx`'s `dispatch()` is
not optimistic). Measured p95 for a single prop edit is ~480ms on
ordinary hardware against a small site. If it's dramatically worse than
that, suspect disk I/O contention or a very large site (this hasn't been
benchmarked against a large real site — see
`docs/cms-performance.md`'s "Not yet benchmarked" section) before
assuming a regression.

## Media Library uploads fail

Asset processing depends on `services/python-analysis`'s real image
analysis (`@openforge/storage`'s `createPythonAssetAnalyzer`, wired in
`apps/cms-admin/src/lib/asset-manager.js`) — a genuine external process
dependency, not just another npm package (see `CLAUDE.md`'s "What this
repo actually is"). If uploads fail specifically at the analysis step
(not at the initial byte-storage step), confirm that service/script is
actually reachable from the container this app runs in.

## Not yet covered here

- Postgres connection pool exhaustion / long-running query behavior
  under real load — not load-tested (see `docs/cms-performance.md`'s
  open items).
- What "safe mode" or an extension-disable path looks like — no
  extension/plugin system is live in this product (`packages/plugin-*`
  are shelved to `future-work/`, see `CLAUDE.md`).
- A documented incident-response process for a suspected secret leak
  (e.g., a compromised `ENCRYPTION_MASTER_KEY` or GitHub PAT) beyond
  "reconnect/rotate the individual credential" — no session-revocation
  UI exists yet either (see `docs/cms-threat-model.md`'s open questions).
