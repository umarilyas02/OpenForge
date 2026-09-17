# CMS backup and restore

Applies to `apps/cms-admin`, the active product. (`docs/accessibility-and-recovery.md`
describes the shelved visual-editor product line's own, unrelated
in-session recovery model — see `future-work/README.md`.)

A self-hosted OpenForge install has two durable stores that both need
backing up; losing either one loses real user data:

- **Postgres** (`DATABASE_URL`) — accounts, organizations, site records,
  menus, theme installations, GitHub connections, and vaulted secret
  references.
- **`SITES_STORAGE_PATH`** — every site's actual project files (the real
  `.jsx` pages, real Next.js project) and uploaded media asset bytes. This
  is content, not metadata: a site's real substance lives here, not in
  Postgres. See `CLAUDE.md`'s "Key architectural fact about the CMS."

Back up both together, on the same schedule — a Postgres backup restored
against a newer or older `SITES_STORAGE_PATH` can reference sites, assets,
or GitHub connections that no longer exist on disk (or vice versa).

## Backing up Postgres

```sh
docker run --rm -v "$(pwd)/backups:/dump" -e "DATABASE_URL=$DATABASE_URL" \
  postgres:18-alpine sh -c 'pg_dump "$DATABASE_URL" -Fc -f /dump/openforge-$(date +%Y%m%d-%H%M%S).dump'
```

Use the `postgres` image tag matching the running server's major version
(check with `SELECT version();`, or `docker compose exec postgres pg_isready`'s
banner) — `pg_dump` refuses to run against a *newer* major server version
than its own. `docker/compose/docker-compose.yml` currently pins
`postgres:18-alpine`.

`-Fc` (custom format) is required for `pg_restore` below; a plain SQL dump
(`pg_dump` with no `-F` flag) also works but is restored with `psql`
instead, without `pg_restore`'s parallel restore or selective-table
options.

## Backing up site files

`SITES_STORAGE_PATH` is a plain directory tree — back it up with whatever
file-level backup tool already covers the deployment's other persistent
volumes (the same durability tier as the database, per `CLAUDE.md`). A
minimal manual snapshot:

```sh
tar -czf sites-$(date +%Y%m%d-%H%M%S).tar.gz -C "$SITES_STORAGE_PATH" .
```

## Restoring

```sh
# Postgres, into a database that already exists and is empty:
docker run --rm -v "$(pwd)/backups:/dump" -e "DATABASE_URL=$DATABASE_URL" \
  postgres:18-alpine pg_restore -d "$DATABASE_URL" --no-owner --no-acl /dump/openforge-<timestamp>.dump

# Site files, into a fresh SITES_STORAGE_PATH:
tar -xzf sites-<timestamp>.tar.gz -C "$SITES_STORAGE_PATH"
```

`--no-owner --no-acl` avoids failures when the restore target's Postgres
role name doesn't match the role the dump was taken under (common when
restoring into a fresh local/throwaway instance for a drill, rather than
the exact same managed instance).

## Verified drill (2026-09-17)

Ran the exact commands above against the real development database and a
disposable `postgres:18-alpine` container (not a staging copy, not a dry
run): dumped, restored into an empty database, and compared row counts
directly against the live source for every table with data
(`users`, `organizations`, `sites`, `assets`, `secrets`,
`site_git_connections`) — every count matched exactly. All 15 tables in
the schema were present in the restored database. The dump file and
throwaway container were deleted immediately after, since the dump
contains real data (password hashes, session tokens, vaulted-secret
references).

Not yet drilled: restoring `SITES_STORAGE_PATH` itself (no real site files
existed in this environment's storage path at drill time to exercise
against), and a *combined* Postgres + site-files restore into a fully
fresh environment end to end.
