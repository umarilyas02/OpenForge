# `@openforge/integration-security`

Security primitives shared by OpenForge's GitHub and Vercel integrations:

- opaque, AES-256-GCM encrypted secret references;
- operation-derived least-privilege scope policies;
- raw-body webhook signature verification and delivery deduplication;
- request-bound idempotency;
- structured audit events with recursive redaction.

The package deliberately has no provider SDK dependency. Provider packages own
network transport while this package enforces the security boundary around it.
