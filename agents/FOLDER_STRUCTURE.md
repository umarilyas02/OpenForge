# Repository Folder Structure

This is the planned monorepo layout. Placeholder files keep empty boundaries
visible before implementation begins.

```text
openforge/
|-- apps/
|   |-- web/                 Next.js dashboard and editor
|   |-- api/                 Express control-plane REST API
|   |-- worker/              BullMQ background consumers
|   |-- preview/             isolated preview coordination
|   `-- docs/                future documentation application
|-- services/
|   `-- python-analysis/
|       |-- app/
|       |   |-- api/
|       |   |-- core/
|       |   |-- jobs/
|       |   |-- models/
|       |   |-- processors/
|       |   `-- schemas/
|       `-- tests/
|-- packages/
|   |-- ai/
|   |-- auth/
|   |-- blocks/
|   |-- cli/
|   |-- compiler/
|   |-- config/
|   |-- design-tokens/
|   |-- editor/
|   |-- events/
|   |-- github/
|   |-- logger/
|   |-- plugin-runtime/
|   |-- plugin-sdk/
|   |-- schemas/
|   |-- storage/
|   |-- ui/
|   `-- vercel/
|-- plugins/
|   |-- official/
|   `-- examples/
|-- templates/
|   |-- blank-next/
|   |-- marketing/
|   `-- portfolio/
|-- tooling/
|   |-- eslint/
|   |-- scripts/
|   `-- test-utils/
|       `-- fixtures/
|           |-- compatibility/
|           |-- compiler/
|           |-- e2e/
|           |-- plugins/
|           `-- security/
|-- docker/
|   |-- compose/
|   |-- config/
|   `-- images/
|-- envs/
|   |-- examples/
|   `-- local/               ignored except for .gitkeep
|-- docs/
|   |-- architecture/
|   |-- community/
|   |-- design/
|   |-- operations/
|   |-- platform/
|   `-- product/
|-- rfcs/
|-- .github/
|   `-- workflows/
|-- IMPLEMENTATION_PLAN.md
|-- progress.md
|-- .env.example
`-- .gitignore
```

## Dependency direction

- applications compose packages; packages do not import application internals;
- browser packages cannot depend on Node-only packages;
- providers depend on public interfaces, not control-plane internals;
- schemas/config/logger/events are low-level boundaries;
- compiler stays independent of editor UI and provider integrations;
- plugin SDK is public; plugin runtime owns enforcement;
- Python never performs JavaScript/JSX structural mutation;
- no circular workspace dependencies or private deep imports.

## Files intentionally not created yet

The following are Phase 0 implementation outputs and are deliberately absent:

- `package.json`, `pnpm-workspace.yaml`, `turbo.json`;
- app/package manifests and source entrypoints;
- Dockerfiles and Compose manifests;
- database schemas and migrations;
- CI workflow definitions;
- executable scripts;
- production or local secret files.
