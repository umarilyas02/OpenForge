# `@openforge/blocks`

OpenForge's official, portable landing-page block registry.

The package exposes a versioned runtime schema, ten JavaScript/JSX blocks,
search and preview metadata, deterministic insertion artifacts, accessibility
notes, and sequential instance migrations. Inserted components are ordinary
source files and do not depend on OpenForge at runtime.

## Public API

- `officialBlockRegistry.list()` returns cloned definitions in stable ID order.
- `search(query)` matches IDs, names, descriptions, categories, and tags.
- `preview(id)` returns UI-safe preview metadata without component source.
- `createInsertion(id)` returns the component, shared stylesheet, import, and
  initial JSX required for a source operation.
- `migrateInstance(instance)` advances stored props through contiguous
  declarative migrations.

`pnpm --filter @openforge/blocks build` materializes a temporary standalone
Next.js project containing every official block and requires its production
build to pass. The temporary project is always removed.
