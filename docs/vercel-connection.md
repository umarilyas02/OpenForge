# Vercel connection

OpenForge uses Vercel's external integration flow. The returned installation
token belongs to the personal or team scope selected during installation; it is
not a general-purpose user token.

## Installation

OpenForge issues 256-bit state, stores only its SHA-256 digest, expires it after
ten minutes, and consumes it once. The callback team must match the team from
the code exchange. The integration client secret and returned access token live
behind context-bound encrypted references.

The Vercel-provided completion URL is accepted only when it uses HTTPS on
`vercel.com` or a Vercel subdomain. Application return paths must be local paths,
which prevents either flow from becoming an open redirect.

## Account and project

An installation exposes one selected scope: its team, or its personal account.
Project lists and all mutations carry that `teamId` when present. OpenForge
validates that an existing project is visible through the installation before
connecting it. New project creation is idempotent and supports an optional
GitHub repository plus safe monorepo root directory.

The connection requests exactly the current user, team, project, and
integration-owned project-environment permissions. Deployment access is added
separately with the deployment lifecycle.

## Environment variables

Targets use Vercel's `development`, `preview`, and `production` names.
Sensitive variables are accepted only for Preview and Production, where Vercel
stores them in a write-only format. Development variables use encrypted provider
storage and are marked `provider-readable`.

OpenForge sends a value once and never returns or stores it in connection
metadata, audit events, or normalized provider responses. Listing variables
returns only key, targets, type, branch, timestamps, and value policy.

Tests use a deterministic fake transport. They do not install an integration,
create a real project, or write real environment variables.

## Deployment lifecycle

Preview creation is allowed only after project validation, a high-confidence
source secret scan, required Preview environment-key checks, and confirmation
that the GitHub repository matches the connected Vercel project. Every request
is idempotently bound to the exact repository, ref, repository ID, and commit
SHA.

Deployment status is reduced to queued, building, ready, failed, or canceled.
Provider error payloads are converted to safe messages. Build events are
allow-listed, credential patterns are redacted, individual messages are
truncated, and at most 100 events are returned. Preview URLs must be
credential-free HTTPS hosts.

Production is a separate action. A ready Preview deployment creates a short
lived confirmation bound to its Vercel project and deployment ID. After exact
target confirmation, OpenForge rechecks the Preview and idempotently requests a
new `target: production` build from the same Git source. This intentionally uses
Production environment variables and can affect live traffic; Preview variables
are never copied forward.
