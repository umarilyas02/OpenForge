# Official block registry

`@openforge/blocks` is the source-independent registry for OpenForge's initial
landing-page library. Its ten blocks cover navigation, opening content, product
benefits, proof, pricing, questions, conversion, and closing navigation.

Every definition includes:

- a schema and block version;
- stable identity, search metadata, and preview metadata;
- editable fields and typed slots with cardinality;
- default props and external dependencies;
- accessibility implementation notes;
- declarative, contiguous prop migrations;
- portable JSX source and its required stylesheet.

The registry never writes project files itself. `createInsertion()` returns
deterministic file and import artifacts for the editor/compiler operation layer
to apply in Phase 2.5. This keeps source changes revision-aware and reviewable.

Official block source changes must update their golden hashes. The package build
also creates a clean temporary Next.js landing page, inserts all ten blocks,
runs a production build, and removes the fixture afterward.
