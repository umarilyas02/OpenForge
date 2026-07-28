# Integration security

OpenForge treats GitHub and Vercel as untrusted network boundaries. Provider
packages may request operations, but shared security primitives decide how
credentials, permissions, webhook deliveries, retries, and audit data are
handled.

## Secrets and connection references

Provider credentials are stored with AES-256-GCM envelope encryption. Each
secret uses a unique random data-encryption key, which is wrapped by the active
key-encryption key. Callers receive an opaque `secret_*` reference plus
non-sensitive metadata, never the stored plaintext. Encryption authenticates
the reference, provider, connection, secret name, creation timestamp, and key
purpose as associated data.

Plaintext is available only inside `withSecret` and its temporary buffer is
cleared after the callback. A caller can bind access to the expected provider,
connection, and secret name. Key rotation decrypts the envelope and immediately
re-encrypts it with a fresh data key under the active key-encryption key.

Production storage must implement the same `put`, `get`, and `delete` boundary
using a durable database and a managed encryption key. Raw encryption keys do
not belong in project records or logs.

## Least privilege

The application asks for capabilities such as `repository:inspect` or
`deployment:create`. The scope policy derives the exact provider permissions
needed for that operation set and reports both missing and excessive grants.
Connections with extra access fail the strict least-privilege assertion.

Provider scope tables are explicit and version-controlled. They must be reviewed
against provider documentation whenever OpenForge adds an API operation.

## Webhooks

Signature validation runs against the original request bytes before JSON
parsing. GitHub deliveries use HMAC-SHA256 and the `sha256=` signature prefix.
Comparisons are constant-time. A valid signature is still admitted only once per
provider delivery ID; production must back the claim operation with a shared
atomic store and expiry.

## Idempotent mutations

Repository creation/import and deployment creation require a caller-generated
idempotency key. The key is bound to a SHA-256 digest of the operation and
canonical input. Concurrent duplicates share one result; completed requests
replay it. Reusing a key with different input is rejected.

## Audit data

Security-relevant actions create structured events with actor, target, outcome,
request ID, and recursively redacted details. Sensitive field names, bearer
credentials, common GitHub token shapes, and query-style secret values are
removed. Provider response bodies must be reduced to allow-listed metadata
before they reach audit or application logs.
