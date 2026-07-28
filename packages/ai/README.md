# `@openforge/ai`

Provider-neutral contracts for optional, bring-your-own-key AI features.

The package describes model capabilities, validates normalized requests and
stream events, selects providers explicitly, permits opt-in fallback only before
output begins, and includes a deterministic scripted fake provider. Image input
uses managed `assetRef` values rather than provider URLs or embedded secrets.

It does not contain provider credentials, network SDKs, prompts, or automatic
source mutation.

The credential manager supports organization, project, environment, and
memory-only session ownership. Persistent values use the shared envelope
vault; only metadata leaves management APIs, and plaintext is scoped to a
trusted server/worker consumer callback.
