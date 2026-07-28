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

Context assembly is explicit and least-privilege: only requested project paths
can be included, built-in exclusions and `.openforgeignore` are applied, secret
values are redacted or blocked, and a digest-bearing included-file manifest is
returned for review. Administrator policy restricts context size, retention,
providers, models, and provider capabilities.

Initial adapters target the current OpenAI Responses, Anthropic Messages, and
Gemini Interactions streaming APIs. They keep model capability declarations
explicit, expose provider model-ID discovery, resolve images only through the
managed asset boundary, disable provider-side response storage where supported,
and normalize SDK errors without returning provider response bodies.

AI-generated source is accepted only as a digest-bound structured proposal.
The proposal pipeline formats and validates a copy in a disposable workspace,
blocks secrets and dangerous source, checks compiler compatibility, runs
lint/test/build gates, produces review diffs, revalidates selected files, and
requires an actor-bound one-time confirmation before an external source writer
can apply anything.
