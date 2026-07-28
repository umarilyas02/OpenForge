# Official AI skills

OpenForge ships four optional AI skills:

- page and section proposals;
- accessibility review;
- responsive review using managed screenshots;
- SEO metadata and copy assistance.

Each definition is transparent and data-only. It declares exact instructions,
provider capabilities, approved context, permissions, input/output JSON
schemas, and the full format/security/compatibility/lint/test/build validation
set. Official skills do not receive a privileged runtime and cannot write to a
project.

## Safety boundary

Project content is treated as untrusted data. A host must supply only the
context types a user approved and only the permissions granted for that run.
The evaluator rejects missing requirements, unsupported provider capabilities,
schema drift, likely credentials in output, and malformed source proposals.

Every source change uses `patchPolicy: "proposal-only"`. The core proposal
pipeline applies the change to an in-memory copy, validates it in a disposable
workspace, produces review diffs, and keeps it unapplied until the user
approves exact paths against an unchanged revision. Applying then requires the
actor-bound, one-time confirmation phrase.

## Deterministic evaluation

`plugins/official/ai-skills/fixtures` contains valid structured runs for all
four skills. `evals/official-skills.eval.json` covers accepted runs and rejected
capability, context, and permission cases without making provider network
calls. The Phase 4 end-to-end test uses the scripted fake provider to prove a
valid proposal remains unapplied through generation, evaluation, validation,
and approval until the exact confirmation is supplied.
