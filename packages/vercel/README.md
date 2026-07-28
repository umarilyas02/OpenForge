# `@openforge/vercel`

Vercel integration connection and project configuration for OpenForge.

The package validates external installation state, exchanges installation codes
without exposing credentials, constrains account/project selection to the
installed scope, creates projects idempotently, and writes environment variables
without returning their values.

Tests use a fake transport and never mutate a real Vercel account.
