# AI provider contracts

OpenForge is fully usable without AI. Provider-assisted features are optional
and must enter through the same proposal, validation, review, and approval
boundaries as any other source change.

## Capabilities

Each adapter publishes immutable per-model capabilities: input and output
modalities, streaming, tools and parallel-tool support, structured output and
strict-schema support, and input/output token limits. Contradictory declarations
are rejected at registration.

Capabilities describe what an adapter can request; they do not grant file,
network, credential, or source-write permission.

## Normalized request and stream

The base request supports role-tagged text messages, managed image asset
references when the model declares image input, JSON-schema tool declarations,
tool choice, structured-response schema, output limit, temperature, and bounded
string metadata. Provider URLs and embedded image credentials are not part of
the contract.

Every provider emits the same event sequence:

1. `start`
2. zero or more `text-delta`, `tool-call`, `structured-output`, and `usage`
3. `finish`

Usage separates input, output, cached-input, and reasoning tokens. Errors use a
safe provider-neutral code, category, retryability, optional HTTP status, and
provider/model identity.

## Selection and fallback

Provider and model selection is exact. Fallback is disabled unless the caller
explicitly enables it and supplies an ordered candidate list. A fallback occurs
only for a retryable error before the provider emits any event. Once output
starts, OpenForge returns that provider's error instead of risking duplicated or
contradictory output from another model.

## Deterministic fake

The fake provider consumes scripted event/error sequences and records normalized
calls. It performs no network access and is the default adapter for contract,
proposal, and evaluation tests.
