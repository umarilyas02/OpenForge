# Editor operation state

`EditorOperationController` is the revision-aware boundary between visual UI
intent and compiler writes.

It provides:

- revision-stamped selection;
- strict operation validation before optimistic dispatch;
- pending, applied, and rejected journal records;
- one active write at a time;
- source/result updates only after compiler validation;
- inverse-operation undo and snapshot fallback;
- redo against the current revision;
- stale-revision and validation-failure states;
- hard external-source boundaries that clear selection and history.

The controller accepts persistence callbacks for snapshot capture and restore,
so UI state does not bypass the authoritative workspace revision journal.
