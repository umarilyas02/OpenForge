# Asset pipeline

`@openforge/storage` owns the Phase 2 asset lifecycle independently of any
specific S3-compatible provider.

## Upload and metadata

Uploads require a project scope, safe base file name, non-empty bytes, an
allowlisted PNG/JPEG/WebP MIME type, and a matching byte signature. The default
limit is 10 MB and 24 million decoded pixels. SHA-256 identifies project-local
duplicates before analysis or storage.

Stored records include dimensions, content hash, original object key, portable
source path, generated variants, size, MIME type, original name, alt text, and
an explicit missing/provided alt status.

## Analysis and derivatives

The Python processor uses Pillow 12.3.0 to decode entirely in memory, reject
format mismatch, animation, decompression bombs, excess pixels, and invalid
variant requests, apply EXIF orientation, strip metadata, and emit bounded WebP
variants. The Node adapter invokes it without a shell and enforces execution
time and response-size limits.

## Access and usage

Originals and variants use project-prefixed object keys. Access URLs are
short-lived HMAC signatures with bounded TTL; verification uses constant-time
comparison. Project ownership remains an input to every asset lookup.

Usage reports scan current project source for the portable asset path and return
exact file, line, and column references. Assets with no references appear in the
unused report. Alt text can be updated without rewriting stored image bytes.
