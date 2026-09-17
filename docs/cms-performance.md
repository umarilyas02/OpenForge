# CMS performance

Applies to `apps/cms-admin`, the active product. Real measurements against
`agents/progress.md`'s Phase 6.3 targets — not estimates. Reproduce with:

```sh
corepack pnpm --filter @openforge/cms-admin exec vitest run test/performance-report.test.js
```

`test/performance-report.test.js` times the exact functions the live
canvas/page editor calls on every user action, against a real
git-backed workspace (the same fixture pattern
`test/block-add-smoke.test.js` uses) — not mocked operations, only a
redirected storage path. Results below are one real run
(2026-09-17, this development machine); rerun before trusting the exact
numbers on different hardware.

## Results

| Operation | Target (p95) | Measured mean | Measured p50 | Measured p95 | Result |
|---|---|---|---|---|---|
| Editor load (open a page: read files, index project, parse block tree) | < 3000ms | 31.8ms | 13.2ms | 165.4ms | **met**, comfortably |
| Canvas edit: set one block prop (transform + save + git commit) | < 100ms | 253.3ms | 238.7ms | 483.5ms | **not met** |
| Canvas reorder: move a block (transform + save + git commit) | < 100ms | 191.7ms | 191.6ms | 245.8ms | **not met** |
| Insert a new block, first use incl. add-import | < 500ms | 363.1ms | 182.6ms | 961.4ms | **not met** at p95 |

## Why the canvas targets aren't met, and what that actually means for a user

This isn't a bug to just optimize away — it's the direct, expected cost of
a deliberate architectural choice: every edit commits to real git history
(`commitSiteChanges` inside `setBlockProps`/`moveBlock`/`insertBlock`,
`apps/cms-admin/src/lib/source-content-actions.js`), which is what backs
the site history/restore feature (`site-git.js`'s `restoreSiteToCommit`,
Settings > History). A `git add -A && git commit` on every save is real
disk and process-spawn overhead that a purely in-memory or debounced-batch
save wouldn't have — and it's the dominant cost here, not the AST
transform itself (the editor-load number above, which does real file
reads and a full project index build with no git commit, stays under
200ms even at p95).

**The user-facing impact is real, not just a number on a chart.** Checked
directly: `SourceContentEditor.jsx`'s `dispatch()` — the function every
canvas edit funnels through — only calls `applyState()` (which updates
the tree state posted to the canvas iframe) *after* the server round trip
resolves; it is not optimistic. `BlockPropsForm.jsx`'s own text input
feels instant (it tracks `localProps` in local state independent of the
save), but the actual rendered block on the canvas does not visually
update until the full transform-save-commit round trip completes. Typing
in a field is followed by inspector's 450ms idle debounce
(`COMMIT_DEBOUNCE_MS`, `BlockPropsForm.jsx`), *then* this measured
~250-480ms round trip before the canvas shows it — roughly 0.7-1.3s from
"stop typing" to "see it reflected," not the 100ms a design-tool user
would expect from something like Figma or Webflow.

## What would actually close this gap (not done — real scope, not a quick fix)

- **Optimistic canvas updates**: apply the edit to the local `tree` state
  immediately (client-side re-render, matching what the server will very
  likely produce) and only reconcile against the server's real response
  in the background, rather than waiting for the round trip before
  showing anything. This is the standard fix for this exact class of
  latency and wouldn't touch the git-commit durability guarantee at all —
  it only changes when the UI reflects the change, not when it's
  persisted. Real interaction-design and state-management work, not a
  one-line fix.
- **Batching/debouncing the git commit itself**, separate from the
  already-existing UI debounce — e.g. commit on blur/navigation rather
  than on every settled edit — trading finer-grained history for lower
  per-edit latency. Would change what a single "Restore to..." commit
  actually represents, so it's a real product decision, not just an
  implementation detail.
- Given either change, the **3-second editor-load target and this
  500ms/100ms canvas set of targets may simply be the wrong shape of SLA**
  for this architecture to begin with (they read as inherited from the
  shelved, differently-architected editor product line — see
  `CLAUDE.md`'s note that some docs predate the CMS pivot). Worth an
  explicit decision on real, current targets rather than treating the
  original numbers as gospel.

## Not yet benchmarked

- Client-side render cost inside the canvas iframe itself (React
  reconciliation + `@openforge/renderer`'s `renderNode`) — this report
  only measures the server-side pipeline: what determines *when* the
  canvas iframe receives new data to render, not how long that iframe
  takes to paint it once received.
- Behavior under a large, realistic site (many pages, many blocks) —
  measured against a freshly-created starter site (2 blocks, 1 page).
  `buildProjectIndex`'s cost in particular is stated elsewhere in the
  codebase to scale with site size (see its own usage comment in
  `pages/editor/actions.js`), so these numbers are a floor, not a
  worst case.
- Incremental indexing and queue/resource budgets (Phase 6.3's other two
  checklist items) — not addressed at all in this pass.
