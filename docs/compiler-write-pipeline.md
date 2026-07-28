# Compiler write pipeline

OpenForge applies editor changes as validated, revision-aware operations.
Project source remains authoritative, and an operation either produces a fully
validated result or produces no project change.

## Version 1 operations

Every operation includes:

- `schemaVersion: 1`;
- a non-negative `baseRevision`;
- a normalized project-relative `filePath`;
- an operation `type`;
- a type-specific `payload`;
- a deterministic JSX `nodeId` target when applicable.

The initial operation types are:

- `set-jsx-attribute`;
- `remove-jsx-attribute`;
- `replace-jsx-text`;
- `add-import`.

Zod validates the complete operation at the public boundary. Objects are
strict, so unknown fields, malformed targets, unsupported schema versions, and
invalid payload combinations are rejected.

## Deterministic edits

The compiler rebuilds the project index from current source and resolves the
operation target through its AST mapping. MagicString applies changes only to
AST-confirmed source ranges. Regular expressions are not used to discover or
rewrite JSX structure.

Writes are rejected when:

- `baseRevision` is stale;
- the file or node does not exist;
- the file is code-only;
- multiple possible attributes or imports make the edit ambiguous;
- text is not a single direct JSX text child;
- import comments, assertions, or incompatible specifiers would be lost;
- the operation produces no source change;
- formatting, parsing, or a workspace validator fails.

## Validation transaction

`applyEditorOperation` works on cloned in-memory file records. The optional
formatter runs on the changed source, then the shared Babel parser confirms
valid JavaScript/JSX. The complete candidate project is materialized beneath a
random operating-system temporary directory for caller-provided lint, build, or
policy validators.

Temporary paths use the same traversal-safe project-path boundary as indexing.
The workspace is removed in a `finally` block after success or failure.

## Results and recovery

A successful operation returns:

- the next numeric revision;
- cloned project files;
- exact changed-file paths;
- a deterministic unified file patch;
- a semantic operation summary;
- an inverse operation when it can be represented safely.

Literal JSX attribute edits and simple text edits normally produce inverses.
Complex expression attributes, entity spellings, and import restructuring
return no inverse; callers must use the revision journal or snapshot fallback.
