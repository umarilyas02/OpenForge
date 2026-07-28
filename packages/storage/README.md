# `@openforge/storage`

OpenForge asset lifecycle and signed-access contracts.

Uploads are validated by byte signature, size, type, safe file name, project
scope, and SHA-256. The asset manager deduplicates within a project before
analysis, stores originals and bounded WebP variants, tracks dimensions and alt
text, creates short-lived HMAC-signed access, finds source references, and
reports unused assets.

The storage adapter remains replaceable so local memory tests, MinIO, and
production S3-compatible storage share the same control-plane behavior. The
Python analyzer adapter uses a bounded child process without a shell and applies
time and response-size limits.
