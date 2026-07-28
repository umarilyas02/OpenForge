# Compiler read pipeline

The OpenForge compiler treats project files as authoritative input and produces
a disposable index. Deleting the index and rebuilding it from identical source
must produce identical component, node, dependency, and diagnostic records.

## Input boundary

`buildProjectIndex({ files })` accepts an array of `{ path, source }` records.
Before parsing, every path is converted to a project-relative POSIX path.

The boundary rejects:

- absolute POSIX, Windows drive, and UNC paths;
- `..` traversal segments;
- empty/root-only paths;
- NUL and other control characters;
- duplicate normalized paths;
- paths that differ only by case.

Case-insensitive collisions are rejected even on case-sensitive hosts so an
archive behaves consistently when moved between operating systems.

## Derived records

The version 1 index contains:

- file compatibility and related record identifiers;
- function-component mappings;
- JSX element mappings with source ranges;
- static imports, re-exports, and literal dynamic imports;
- compatibility diagnostics with file paths and locations.

Identifiers are SHA-256-derived opaque strings based on normalized paths and
structural AST positions. They are stable across repeated builds and formatting
changes that do not alter AST structure. They are not permanent database
identifiers and may change after structural source edits.

## Dependency resolution

Relative imports resolve against known project files using direct paths,
`.js`/`.jsx` extensions, and `index.js`/`index.jsx`. Package imports are
recorded as external. Unknown aliases and missing relative files remain
unresolved instead of being guessed.

## Safety and preservation

The read pipeline never writes project files. Parser failures produce code-only
compatibility diagnostics and no AST-derived records for that file. Unresolved
or unsupported source remains present in snapshots and exports.
