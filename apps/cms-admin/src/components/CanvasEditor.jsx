"use client";

import { useEffect, useRef, useState } from "react";

import { getNodeAtPath } from "../lib/tree-path.js";
import { BlockPalette } from "./BlockPalette.jsx";
import { BlockPropsForm } from "./BlockPropsForm.jsx";

/** /canvas renders through @openforge/renderer's strict content-tree schema, which only allows {blockId, blockVersion, props, slots} — this app's own `id` field (added so edits can target a real compiler node) has to come off before the tree crosses that boundary. */
function stripNodeIds(tree) {
  return tree.map((node) => ({
    blockId: node.blockId,
    blockVersion: node.blockVersion,
    props: node.props,
    slots: Object.fromEntries(
      Object.entries(node.slots ?? {}).map(([slotName, children]) => [
        slotName,
        stripNodeIds(children),
      ]),
    ),
  }));
}

function findNodeById(tree, nodeId) {
  for (const node of tree) {
    if (node.id === nodeId) return node;
    for (const children of Object.values(node.slots ?? {})) {
      const match = findNodeById(children, nodeId);
      if (match) return match;
    }
  }
  return null;
}

/** Identifies the one top-level node whose position changed, and which of its new neighbors to anchor the move to. Reorder in /canvas only ever moves one top-level item via a single splice, so exactly one such pair always exists. */
function diffTopLevelReorder(previousTree, nextTree) {
  for (let i = 0; i < nextTree.length; i += 1) {
    if (nextTree[i].id !== previousTree[i]?.id) {
      const movedNodeId = nextTree[i].id;
      if (i > 0) {
        return {
          movedNodeId,
          destinationNodeId: nextTree[i - 1].id,
          position: "after",
        };
      }
      return {
        movedNodeId,
        destinationNodeId: nextTree[1]?.id,
        position: "before",
      };
    }
  }
  return null;
}

/**
 * The live-canvas view: a block palette on the left, the real rendered page
 * in an iframe pointed at /canvas in the middle, and (when a block is
 * selected on the canvas) its props form on the right. The iframe is fed
 * the current tree over postMessage on every change and reports clicks
 * back by path — see apps/cms-admin/app/(canvas)/canvas/page.jsx for the
 * other side of this bridge.
 *
 * Every interaction here is applied immediately as a real edit to the
 * site's own files (there is no separate "Save" step) — onPropsChange,
 * onInsert, onRemove, and onMove all persist through a compiler operation
 * and hand back the freshly re-parsed tree, which becomes `tree` on the
 * next render.
 *
 * @param {{
 *   tree: object[],
 *   pageRootNodeId: string,
 *   allowedBlockIds: string[],
 *   catalog: object[],
 *   onPropsChange: (nodeId: string, nextProps: object) => void,
 *   onInsert: (blockId: string, containerNodeId: string) => void,
 *   onRemove: (nodeId: string) => void,
 *   onMove: (movedNodeId: string, destinationNodeId: string, position: "before"|"after") => void,
 * }} props
 */
export function CanvasEditor({
  tree,
  pageRootNodeId,
  allowedBlockIds,
  catalog,
  onPropsChange,
  onInsert,
  onRemove,
  onMove,
}) {
  const iframeRef = useRef(null);
  const [canvasAcked, setCanvasAcked] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);

  useEffect(() => {
    function handleMessage(event) {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type === "of-canvas-ack") {
        setCanvasAcked(true);
      } else if (event.data?.type === "of-canvas-select") {
        const node = event.data.path
          ? getNodeAtPath(tree, event.data.path)
          : null;
        setSelectedNodeId(node?.id ?? null);
      } else if (event.data?.type === "of-canvas-reorder") {
        const move = diffTopLevelReorder(tree, event.data.tree);
        if (move && move.destinationNodeId) {
          onMove(move.movedNodeId, move.destinationNodeId, move.position);
        }
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [tree, onMove]);

  useEffect(() => {
    function sendTree() {
      iframeRef.current?.contentWindow?.postMessage(
        { type: "of-canvas-tree", tree: stripNodeIds(tree) },
        window.location.origin,
      );
    }

    sendTree();
    if (canvasAcked) return;

    // The <iframe src="..."> is present in the server-rendered HTML, so the
    // browser can start (and for a small static route like /canvas, finish)
    // loading it before this component has hydrated and attached its
    // message listener — an onLoad handler can miss that window entirely.
    // Retrying on an interval until the canvas acknowledges receipt sidesteps
    // depending on any particular load-event ordering.
    const retry = setInterval(sendTree, 200);
    const giveUp = setTimeout(() => clearInterval(retry), 4000);
    return () => {
      clearInterval(retry);
      clearTimeout(giveUp);
    };
  }, [canvasAcked, tree]);

  const selectedNode = selectedNodeId
    ? findNodeById(tree, selectedNodeId)
    : null;
  const selectedDefinition = selectedNode
    ? catalog.find((entry) => entry.id === selectedNode.blockId)
    : null;

  return (
    <div className="canvas-editor">
      <aside className="canvas-palette">
        <p className="editor-rail-label">Add block</p>
        <BlockPalette
          allowedBlockIds={allowedBlockIds}
          catalog={catalog}
          onAdd={(blockId) => onInsert(blockId, pageRootNodeId)}
        />
      </aside>

      <div className="canvas-frame-wrap">
        <iframe
          className="canvas-frame"
          ref={iframeRef}
          src="/canvas"
          title="Page preview"
        />
      </div>

      <aside className="canvas-inspector">
        {selectedNode && selectedDefinition ? (
          <>
            <p className="editor-rail-label">{selectedDefinition.name}</p>
            <BlockPropsForm
              definition={selectedDefinition}
              onChange={(nextProps) =>
                onPropsChange(selectedNode.id, nextProps)
              }
              props={selectedNode.props}
            />
            <button
              className="icon-btn-sm"
              data-danger="true"
              onClick={() => {
                onRemove(selectedNode.id);
                setSelectedNodeId(null);
              }}
              type="button"
            >
              Remove block
            </button>
          </>
        ) : (
          <p className="muted">Select a block on the canvas to edit it.</p>
        )}
      </aside>
    </div>
  );
}
