# OpenForge compatibility profile

This document defines the initial source profile OpenForge can inspect without
changing the portability of a project. Project source remains authoritative.
Compatibility is reported per file and can be aggregated for a project.

## Target project

The initial profile targets a normal Next.js App Router project with:

- JavaScript and JSX source;
- function components, including async server components;
- `"use client"` client components;
- statically analyzable ESM imports and exports;
- conventional props and standard JSX children;
- nested App Router routes;
- CSS Modules imported through a static relative import;
- Tailwind utility classes expressed as static strings;
- source that installs, runs, and builds without OpenForge.

TypeScript, the Pages Router, and other frontend frameworks are outside the
initial profile. Their files must remain available in the code workspace and
must never be rewritten merely because OpenForge cannot analyze them.

## Compatibility levels

### Supported

OpenForge understands every detected construct required for the requested
operation. The file may participate in deterministic visual operations after
the relevant operation-specific confidence checks pass.

### Partially supported

OpenForge understands a safe subset of the file, but one or more constructs
cannot be mapped confidently. Supported regions may be inspected; writes must
be limited to unambiguous targets and must preserve all other source.

Examples include JSX embedded in complex conditional expressions and dynamic
values around otherwise static component structure.

### Code-only

OpenForge cannot safely map the file to the visual model. The file remains
editable as code and must be preserved byte-for-byte unless the user directly
edits it in the code workspace.

Examples include component factories, runtime-generated element trees,
metaprogramming, custom compiler syntax, and parser failures.

## Preservation guarantees

Compatibility analysis is read-only. It must not format, normalize line
endings, reorder imports, or otherwise rewrite input.

When a file is partially supported or code-only:

1. unsupported regions remain unchanged;
2. no visual operation may target an ambiguous node;
3. a rejected operation produces diagnostics instead of a best-effort rewrite;
4. snapshots and exports contain the original bytes unless an explicit,
   validated edit changed them;
5. derived compatibility indexes can be discarded and rebuilt from source.

## Initial diagnostic contract

Each diagnostic has a stable code, severity, message, source location when
available, and an explanation of its compatibility effect. Initial codes:

- `OF_COMPAT_PARSE_ERROR`: source could not be parsed; code-only;
- `OF_COMPAT_DYNAMIC_IMPORT`: a non-literal dynamic import was found; partial;
- `OF_COMPAT_RUNTIME_ELEMENT`: runtime-generated React elements were found;
  code-only;
- `OF_COMPAT_COMPONENT_FACTORY`: a function returns another component;
  code-only;
- `OF_COMPAT_COMPLEX_CONDITIONAL`: JSX participates in a nested conditional;
  partial.

The absence of a diagnostic does not authorize a write. Compiler write
operations apply their own schema, revision, target, and confidence checks.
