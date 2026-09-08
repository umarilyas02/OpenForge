import { applyEditorOperation, buildProjectIndex } from "@openforge/compiler";
import { describe, expect, it } from "vitest";

import {
  EditorOperationController,
  createVisualEditorState,
} from "../src/index.js";

const filePath = "app/page.jsx";
const source =
  "export default function Page() { return <main><h1>Hello</h1></main>; }\n";

describe("EditorOperationController", () => {
  it("dispatches optimistically and journals validated operations", async () => {
    const states = [];
    const controller = createController({
      onStateChange: (state) => states.push(state),
    });
    controller.select({ filePath, nodeId: headingId(controller.state.files) });
    const operation = replaceHeadingOperation(
      controller.state.files,
      0,
      "Changed",
    );
    const promise = controller.dispatch(operation);

    expect(controller.state.syncState).toBe("applying");
    expect(controller.state.journal.at(-1).status).toBe("pending");
    await promise;

    expect(controller.state).toMatchObject({
      pendingOperationId: null,
      revision: 1,
      syncState: "synchronized",
    });
    expect(controller.state.journal.at(-1)).toMatchObject({
      status: "applied",
      submittedRevision: 0,
      completedRevision: 1,
    });
    expect(controller.state.selection.revision).toBe(1);
    expect(controller.state.files[0].source).toContain("Changed");
    expect(states.length).toBeGreaterThanOrEqual(3);
  });

  it("undoes and redoes with compiler inverses", async () => {
    const controller = createController();
    await controller.dispatch(
      replaceHeadingOperation(controller.state.files, 0, "Changed"),
    );
    await controller.undo();
    expect(controller.state.revision).toBe(2);
    expect(controller.state.files[0].source).toBe(source);
    expect(controller.state.journal.at(-1).type).toBe("undo");

    await controller.redo();
    expect(controller.state.revision).toBe(3);
    expect(controller.state.files[0].source).toContain("Changed");
    expect(controller.state.journal.at(-1).type).toBe("redo");
  });

  it("uses snapshot fallback when no safe inverse exists", async () => {
    const snapshots = new Map();
    const controller = createController({
      captureSnapshot: async ({ files, revision }) => {
        const snapshotId = `snapshot-${revision}`;
        snapshots.set(snapshotId, structuredClone(files));
        return snapshotId;
      },
      restoreSnapshot: async ({ snapshotId, baseRevision }) => ({
        files: structuredClone(snapshots.get(snapshotId)),
        nextRevision: baseRevision + 1,
      }),
    });
    await controller.dispatch({
      schemaVersion: 1,
      baseRevision: 0,
      filePath,
      type: "add-import",
      payload: {
        source: "react",
        importKind: "named",
        imported: "cache",
      },
    });
    expect(controller.state.files[0].source).toContain(
      'import { cache } from "react";',
    );
    expect(controller.state.undoStack.at(-1).inverseOperation).toBeNull();

    await controller.undo();
    expect(controller.state.files[0].source).toBe(source);
  });

  it("rejects stale operations before optimistic dispatch", async () => {
    const controller = createController();
    await expect(
      controller.dispatch(
        replaceHeadingOperation(controller.state.files, 4, "Stale"),
      ),
    ).rejects.toMatchObject({ code: "OF_OPERATION_STALE_REVISION" });
    expect(controller.state.journal).toEqual([]);
  });

  it("journals validation failures and leaves source unchanged", async () => {
    const controller = createController({
      executeOperation: async () => {
        const error = new Error("rejected");
        error.code = "OF_OPERATION_VALIDATION_FAILED";
        throw error;
      },
    });
    await expect(
      controller.dispatch(
        replaceHeadingOperation(controller.state.files, 0, "Rejected"),
      ),
    ).rejects.toMatchObject({ code: "OF_OPERATION_VALIDATION_FAILED" });
    expect(controller.state.files[0].source).toBe(source);
    expect(controller.state.journal.at(-1)).toMatchObject({
      errorCode: "OF_OPERATION_VALIDATION_FAILED",
      status: "rejected",
    });
    expect(controller.state.syncState).toBe("validation-failed");
  });

  it("clears history and selection at external source boundaries", async () => {
    const controller = createController();
    controller.select({ filePath, nodeId: headingId(controller.state.files) });
    await controller.dispatch(
      replaceHeadingOperation(controller.state.files, 0, "Changed"),
    );
    controller.applyExternalBoundary({
      boundaryId: "git-commit-abc",
      files: [{ path: filePath, source: `${source}// external\n` }],
      revision: 8,
    });
    expect(controller.state).toMatchObject({
      externalBoundary: { boundaryId: "git-commit-abc", revision: 8 },
      revision: 8,
      selection: null,
      syncState: "external-change",
      undoStack: [],
      redoStack: [],
    });
  });
});

function createController(overrides = {}) {
  return new EditorOperationController({
    initialState: createVisualEditorState({
      files: [{ path: filePath, source }],
    }),
    executeOperation: applyEditorOperation,
    ...overrides,
  });
}

function replaceHeadingOperation(files, baseRevision, text) {
  return {
    schemaVersion: 1,
    baseRevision,
    filePath,
    type: "replace-jsx-text",
    target: { nodeId: headingId(files) },
    payload: { text },
  };
}

function headingId(files) {
  return buildProjectIndex({ files }).nodes.find(
    ({ element }) => element === "h1",
  ).id;
}
