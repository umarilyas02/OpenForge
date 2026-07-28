# AI credential lifecycle

AI credentials are optional, provider-specific secrets. They are never required
to use the editor and are not returned by credential-management APIs.

## Ownership modes

- **Organization** credentials are available to projects in one organization.
- **Project** credentials override organization credentials for one project.
- **Environment** credentials override project credentials for development,
  preview, or production.
- **Session** credentials are memory-only, bound to one project session, and
  must expire within 24 hours.

Resolution uses the most specific exact match: session, environment, project,
then organization. Scope fields are validated strictly so a credential cannot
silently cross an organization, project, environment, or session boundary.

## Encryption and access

Persistent credential values are protected by AES-256-GCM envelope encryption.
Every secret receives a random data-encryption key; that key is separately
wrapped by the active key-encryption key. Ciphertext, metadata, and wrapped keys
are authenticated. Rotation can re-encrypt under the active key or replace the
provider credential, deleting the prior encrypted record.

Plaintext access requires an exact credential scope and an explicitly trusted
`server` or `worker` execution context with the `ai-provider-request` purpose.
The value exists only inside a consumer callback and is never included in list,
resolve, create, rotate, delete, or audit results.

Session values never enter the persistent credential store or encrypted vault.
Their in-memory byte buffers are zeroed when rotated or deleted.
