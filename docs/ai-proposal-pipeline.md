# AI proposal pipeline

AI output never mutates an OpenForge project directly. A provider can return
only a structured proposal that moves through validation, review, approval, and
an explicit source-writer boundary.

## Proposal schema

A proposal contains:

- a versioned intent summary and optional rationale;
- the exact project base revision;
- one to 100 unique project-relative changes;
- `create`, `update`, or `delete` operations;
- full proposed source for creates and updates; and
- the captured SHA-256 digest for every update or delete.

Traversal, duplicate paths, environment files, credentials, Git metadata, and
OpenForge control metadata are rejected before files are materialized.

## Validation

Validation applies the proposal to an in-memory copy, then:

1. runs the configured formatter and rejects changes outside proposal paths;
2. blocks detected secrets, install lifecycle scripts, dynamic evaluation, and
   process-execution primitives;
3. parses changed JavaScript/TypeScript through the compiler compatibility
   analyzer;
4. materializes the resulting project under an OS temporary directory;
5. runs configured lint, test, and production-build validators; and
6. removes the temporary workspace unconditionally.

Results contain safe diagnostics and unified per-file diffs. Raw validator
exceptions are not returned.

## Selective approval

Reviewers choose one or more proposal paths. The selected subset is reconstructed
from the original base files and passes the complete validation pipeline again;
this prevents an apparently safe subset from bypassing build or test failures.

Approval is bound to the actor, base revision, exact original file digests,
selected paths, and a one-time confirmation phrase. Apply rechecks all of those
values before invoking an external source writer. Failed writes return a safe
error, and approval can be used successfully only once.

Validation, approval, apply start, success, and failure are audit events that
contain IDs and paths but no proposed source or secrets.
