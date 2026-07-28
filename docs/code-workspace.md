# Embedded code workspace

`@openforge/editor` provides a Monaco-backed JavaScript/JSX workspace with a
deterministic file list, per-file diagnostics, working-versus-saved buffers,
unified diffs, and explicit save/sync states.

Code-only files remain directly editable and byte-preserved in the code
workspace, while `visualWriteAllowed` prevents visual compiler operations from
targeting them. External changes are distinguished from conflicts when local
buffers are already dirty.
