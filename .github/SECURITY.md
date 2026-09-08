# Security Policy

Do not open a public issue for a suspected vulnerability.

Use [GitHub's private security advisory reporting](https://github.com/umarilyas02/OpenForge/security)
for this repository. Include the affected component, reproduction steps,
impact, and a safe proof of concept when possible.

High-priority areas: authentication and authorization, cross-tenant/cross-site
access, secret handling (see `@openforge/integration-security`), preview and
build isolation, plugin permissions, AI provider context leakage, webhook
verification, SSRF, path traversal, and malicious project archives.

The full policy (scope, response process, supported versions) lives at
[`openforge-docs/SECURITY.md`](../openforge-docs/SECURITY.md) — this file
lives under `.github/` (one of the locations GitHub's own security tooling
looks for) rather than duplicating the full policy here.
