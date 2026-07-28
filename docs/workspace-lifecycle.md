# Project workspace lifecycle

`@openforge/workspace` manages untrusted project source beneath an explicitly
configured base directory. Workspace identifiers and every project-relative
path are validated before filesystem access.

The lifecycle provides:

- atomic isolated creation and file import;
- byte quotas before imports, saves, and restores;
- optimistic numeric revisions and newline-delimited journals;
- atomic file autosaves;
- content-addressed source snapshots and revision-aware restore;
- deterministic source-only `tar.gz` exports;
- removal of abandoned temporary writes and journal-based recovery;
- guarded cleanup of one selected workspace.

The `.openforge` metadata directory contains state, journal, and snapshots. It
is derived workspace state and is never included in source exports.

Symlinks, traversal paths, absolute paths, malformed workspace identifiers,
duplicate import paths, and stale revisions are rejected with stable error
codes. Failed initial imports remove their partially created workspace.
