# OpenForge official AI skills

This package contains the four built-in, proposal-only AI skill definitions:
page/section proposals, accessibility review, responsive review, and SEO
metadata/copy assistance.

Definitions are data, not privileged runtimes. Each one declares its required
provider capabilities, approved context, permissions, input/output schemas, and
the complete OpenForge validation pipeline. A returned patch remains unapplied
until the core proposal pipeline validates it and a user explicitly approves
the exact revision and paths.

Fixtures and deterministic evaluations live alongside the definitions so hosts
can verify policy enforcement without calling a paid provider.
