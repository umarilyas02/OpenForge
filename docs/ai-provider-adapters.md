# Initial AI provider adapters

OpenForge ships optional adapters for OpenAI, Anthropic, and Google Gemini.
Adapters are registered only when a maintainer supplies explicit model
capabilities and a trusted runtime supplies a credential.

## API contracts

- **OpenAI** uses the Responses API with streaming enabled and `store: false`.
  Text deltas, completed function arguments, structured JSON, token details,
  completion state, and errors are normalized.
- **Anthropic** uses the Messages streaming API. Message/content-block events,
  partial tool input JSON, `output_config.format`, cache usage, and stop reasons
  are normalized.
- **Gemini** uses the Interactions streaming API with `store: false`.
  Interaction lifecycle events, text and argument deltas, function-call steps,
  structured response format, and current usage totals are normalized.

The adapters do not hard-code a “latest” model alias. Operators declare the
models and capabilities they have evaluated, while `discoverModels()` returns
the provider's currently visible model IDs for an explicit review/update flow.

## Safety boundaries

Provider SDK clients must be created in a trusted server or worker context.
Image parts contain only managed asset references until an adapter invokes the
configured asset resolver. Provider errors are reduced to safe category, status,
retryability, provider, and model fields; response bodies are not propagated.

The adapter never executes a returned tool call. Tool calls remain normalized
output for OpenForge's proposal and approval pipeline.

## Dependency verification

The implementation pins versions verified against the npm `latest` tag on
2026-07-28:

- `openai@7.0.0`
- `@anthropic-ai/sdk@0.115.0`
- `@google/genai@2.13.0`

Provider request and stream shapes were checked against each provider's official
documentation and the installed SDK declarations before implementation.
