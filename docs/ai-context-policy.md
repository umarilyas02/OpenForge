# AI context and policy

OpenForge does not send an entire repository to an AI provider. Every request
starts with an explicit list of project-relative files, and the resulting
context has a reviewable manifest.

## Least context

Context assembly:

1. validates every requested path remains inside the project;
2. applies built-in secret/build exclusions and the project
   `.openforgeignore`;
3. includes only exact requested files, never an implicit directory or
   repository scan;
4. detects and redacts secrets, or blocks affected files under stricter policy;
5. enforces administrator file-count and byte limits; and
6. returns included paths, redacted byte counts, SHA-256 digests, secret
   finding categories and line numbers, and exclusion reasons.

The manifest never contains a detected secret value.

## `.openforgeignore`

`.openforgeignore` follows standard gitignore-style patterns, including comments,
directory patterns, wildcards, and negation. It adds to built-in exclusions for
Git metadata, dependency/build directories, environment files, private keys,
and certificate bundles.

## Retention and deletion

Context is ephemeral by default and cannot be inserted into a context store.
Callers may request a bounded retention period only within the administrator
maximum. Persisted context already contains redactions, expires automatically,
and supports explicit deletion by manifest ID.

## Administrator restrictions

Policy allow-lists providers, model identifiers, and capabilities (`text`,
`image`, `tools`, and `structured-output`). It also caps context files, bytes,
retention, and selects `redact` or `block` handling for detected secrets.
Provider/model selection is denied before credential access or a provider
network request.
