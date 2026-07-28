# GitHub connection

OpenForge connects through a GitHub App. Authentication and installation access
are separate: the OAuth web flow identifies the user, while installation and
repository selectors limit which repositories OpenForge may operate on.

## Authentication

The login flow issues 256-bit state, stores only its SHA-256 digest, expires it
after ten minutes, and consumes it exactly once. Callback URLs must use HTTPS,
except for localhost development. GitHub App client secrets and returned user
tokens are decrypted only for the outbound request and otherwise remain opaque
vault references.

GitHub may return expiring access and refresh tokens. OpenForge records their
expiry and stores each credential separately; token length and shape are never
assumed.

## Repository selection

Installations are loaded through the authenticated user's GitHub App access.
Repository choices are then restricted to the selected installation. A branch
must exist in GitHub's branch response before it can be connected. A protected
branch selects pull-request write mode automatically; an unprotected branch may
use direct mode after later explicit push confirmation.

Repository creation is bound to an idempotency key and to the selected
installation owner. A retry returns the existing OpenForge connection rather
than creating a second repository.

## Compatibility inspection

Inspection reads only bounded JavaScript and JSX blobs through the provider
transport. Files are materialized in a disposable compiler workspace and
removed before the compatibility report is returned. Source remains
authoritative; the derived report records supported, partial, and code-only
counts without persisting a provider checkout.

## Network boundary

`createGitHubRestTransport` uses GitHub's versioned REST API and follows
provider redirects. API errors expose only the status, GitHub request ID, and
provider message. Tokens and raw response headers are never included.

Tests use a deterministic fake transport. No test creates, connects, or modifies
a real GitHub repository.
