# Core visual operations

OpenForge exposes two versioned compiler boundaries for Phase 2 editing:

- `applyEditorOperation()` handles literal JSX props, token-aware class strings,
  direct text, and deterministic imports.
- `applyVisualOperation()` handles structure, semantic link/asset changes, and
  App Router page lifecycle operations.

Both boundaries require a base revision, normalize and guard paths, resolve
visual targets through the derived AST index, validate transformed JavaScript
and JSX, materialize the complete candidate in a temporary workspace, run
optional validators, and return exact unified source diffs.

## Structural operations

- `insert-jsx`
- `remove-jsx`
- `move-jsx`
- `wrap-jsx`
- `unwrap-jsx`
- `duplicate-jsx`

Inserted fragments must parse as exactly one JSX child. Moves within a target's
own subtree are rejected. Ambiguous, missing, self-closing, or code-only targets
fail with stable error codes and do not modify caller input.

## Content and source properties

- `replace-jsx-text`
- `set-jsx-attribute`
- `remove-jsx-attribute`
- `change-link`
- `replace-asset`

Literal `className` edits are the initial token-aware class operation. Link label
changes require one direct plain-text child. Asset replacement always updates
both `src` and `alt`.

## Page operations

- `add-page`
- `rename-page`
- `delete-page`
- `update-page-metadata`

Routes are limited to static lowercase App Router segments in the MVP.
Collisions and non-page targets are rejected. Metadata updates preserve
unrelated fields and only rewrite supported string-literal title/description
values. Unsafe dynamic metadata falls back to code editing.

Safe file-add and route-rename operations return inverse operations. Structural
or destructive changes without a stable post-transform target use the editor's
snapshot fallback instead of claiming an unsafe inverse.
