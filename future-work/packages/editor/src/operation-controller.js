import { randomUUID } from "node:crypto";

import {
  CompilerOperationError,
  parseEditorOperation,
} from "@openforge/compiler";

export function createVisualEditorState({
  files,
  revision = 0,
  snapshotId = null,
}) {
  if (!Array.isArray(files)) throw new TypeError("files must be an array.");
  if (!Number.isInteger(revision) || revision < 0) {
    throw new TypeError("revision must be a non-negative integer.");
  }
  return {
    externalBoundary: null,
    files: files.map((file) => ({ ...file })),
    journal: [],
    pendingOperationId: null,
    redoStack: [],
    revision,
    selection: null,
    snapshotId,
    syncState: "synchronized",
    undoStack: [],
  };
}

export class EditorOperationController {
  /**
   * @param {{
   *   initialState: ReturnType<typeof createVisualEditorState>,
   *   executeOperation: (input: object) => Promise<object>,
   *   captureSnapshot?: (input: object) => Promise<string>,
   *   restoreSnapshot?: (input: object) => Promise<object>,
   *   onStateChange?: (state: object) => void
   * }} options
   */
  constructor({
    initialState,
    executeOperation,
    captureSnapshot,
    restoreSnapshot,
    onStateChange = () => {},
  }) {
    if (typeof executeOperation !== "function") {
      throw new TypeError("executeOperation must be a function.");
    }
    this.state = initialState;
    this.executeOperation = executeOperation;
    this.captureSnapshot = captureSnapshot;
    this.restoreSnapshot = restoreSnapshot;
    this.onStateChange = onStateChange;
  }

  select(selection) {
    if (selection === null) {
      this.commit({ ...this.state, selection: null });
      return;
    }
    if (
      typeof selection?.filePath !== "string" ||
      typeof selection?.nodeId !== "string"
    ) {
      throw new TypeError("selection requires filePath and nodeId.");
    }
    this.commit({
      ...this.state,
      selection: { ...selection, revision: this.state.revision },
    });
  }

  async dispatch(rawOperation) {
    if (this.state.pendingOperationId) {
      throw new EditorStateError(
        "OF_EDITOR_OPERATION_PENDING",
        "Wait for the active editor operation to finish.",
      );
    }
    const operation = parseEditorOperation(rawOperation);
    this.assertCurrentRevision(operation.baseRevision);
    const snapshotId = this.captureSnapshot
      ? await this.captureSnapshot({
          files: this.state.files,
          revision: this.state.revision,
        })
      : this.state.snapshotId;
    const journalId = randomUUID();
    const journalEntry = {
      id: journalId,
      operation,
      status: "pending",
      submittedRevision: this.state.revision,
      type: "operation",
    };
    this.commit({
      ...this.state,
      journal: [...this.state.journal, journalEntry],
      pendingOperationId: journalId,
      syncState: "applying",
    });

    try {
      const result = await this.executeOperation({
        currentRevision: this.state.revision,
        files: this.state.files,
        operation,
      });
      const appliedEntry = {
        ...journalEntry,
        completedRevision: result.nextRevision,
        status: "applied",
        summary: result.summary,
      };
      this.commit({
        ...this.state,
        files: result.files,
        journal: replaceJournalEntry(this.state.journal, appliedEntry),
        pendingOperationId: null,
        redoStack: [],
        revision: result.nextRevision,
        selection: advanceSelection(this.state.selection, result.nextRevision),
        snapshotId,
        syncState: "synchronized",
        undoStack: [
          ...this.state.undoStack,
          {
            inverseOperation: result.inverseOperation,
            operation,
            snapshotId,
          },
        ],
      });
      return result;
    } catch (error) {
      const rejectedEntry = {
        ...journalEntry,
        errorCode: error?.code ?? "OF_EDITOR_OPERATION_FAILED",
        status: "rejected",
      };
      this.commit({
        ...this.state,
        journal: replaceJournalEntry(this.state.journal, rejectedEntry),
        pendingOperationId: null,
        syncState:
          error?.code === "OF_OPERATION_STALE_REVISION"
            ? "stale"
            : "validation-failed",
      });
      throw error;
    }
  }

  async undo() {
    const entry = this.state.undoStack.at(-1);
    if (!entry) {
      throw new EditorStateError(
        "OF_EDITOR_UNDO_EMPTY",
        "There is no operation to undo.",
      );
    }

    let result;
    if (entry.inverseOperation) {
      result = await this.executeOperation({
        currentRevision: this.state.revision,
        files: this.state.files,
        operation: {
          ...entry.inverseOperation,
          baseRevision: this.state.revision,
        },
      });
    } else {
      if (!entry.snapshotId || typeof this.restoreSnapshot !== "function") {
        throw new EditorStateError(
          "OF_EDITOR_SNAPSHOT_REQUIRED",
          "This operation requires snapshot fallback.",
        );
      }
      result = await this.restoreSnapshot({
        baseRevision: this.state.revision,
        snapshotId: entry.snapshotId,
      });
    }

    this.commitHistoryResult({
      action: "undo",
      files: result.files,
      nextRevision: result.nextRevision,
      redoStack: [...this.state.redoStack, entry],
      undoStack: this.state.undoStack.slice(0, -1),
    });
    return result;
  }

  async redo() {
    const entry = this.state.redoStack.at(-1);
    if (!entry) {
      throw new EditorStateError(
        "OF_EDITOR_REDO_EMPTY",
        "There is no operation to redo.",
      );
    }
    const result = await this.executeOperation({
      currentRevision: this.state.revision,
      files: this.state.files,
      operation: {
        ...entry.operation,
        baseRevision: this.state.revision,
      },
    });
    this.commitHistoryResult({
      action: "redo",
      files: result.files,
      nextRevision: result.nextRevision,
      redoStack: this.state.redoStack.slice(0, -1),
      undoStack: [
        ...this.state.undoStack,
        {
          ...entry,
          inverseOperation: result.inverseOperation,
        },
      ],
    });
    return result;
  }

  applyExternalBoundary({ boundaryId, files, revision }) {
    if (this.state.pendingOperationId) {
      throw new EditorStateError(
        "OF_EDITOR_OPERATION_PENDING",
        "Cannot cross an external boundary while an operation is pending.",
      );
    }
    if (!Number.isInteger(revision) || revision <= this.state.revision) {
      throw new EditorStateError(
        "OF_EDITOR_EXTERNAL_REVISION_INVALID",
        "External revision must advance the current revision.",
      );
    }
    this.commit({
      ...this.state,
      externalBoundary: { boundaryId, revision },
      files: files.map((file) => ({ ...file })),
      redoStack: [],
      revision,
      selection: null,
      snapshotId: null,
      syncState: "external-change",
      undoStack: [],
    });
  }

  assertCurrentRevision(baseRevision) {
    if (baseRevision !== this.state.revision) {
      throw new CompilerOperationError(
        "OF_OPERATION_STALE_REVISION",
        `Operation revision ${baseRevision} does not match editor revision ${this.state.revision}.`,
      );
    }
  }

  commitHistoryResult({ action, files, nextRevision, redoStack, undoStack }) {
    const journalEntry = {
      completedRevision: nextRevision,
      id: randomUUID(),
      status: "applied",
      type: action,
    };
    this.commit({
      ...this.state,
      files,
      journal: [...this.state.journal, journalEntry],
      redoStack,
      revision: nextRevision,
      selection: advanceSelection(this.state.selection, nextRevision),
      syncState: "synchronized",
      undoStack,
    });
  }

  commit(state) {
    this.state = state;
    this.onStateChange(state);
  }
}

function replaceJournalEntry(journal, replacement) {
  return journal.map((entry) =>
    entry.id === replacement.id ? replacement : entry,
  );
}

function advanceSelection(selection, revision) {
  return selection ? { ...selection, revision } : null;
}

export class EditorStateError extends Error {
  constructor(code, message) {
    super(message);
    this.name = "EditorStateError";
    this.code = code;
  }
}
