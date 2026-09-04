"use client";

import { useEffect, useRef, useState } from "react";

import { getNodeAtPath, setNodeAtPath } from "../lib/tree-path.js";
import { BlockPalette } from "./BlockPalette.jsx";
import { BlockPropsForm } from "./BlockPropsForm.jsx";

/**
 * The live-canvas view: a block palette on the left, the real rendered page
 * in an iframe pointed at /canvas in the middle, and (when a block is
 * selected on the canvas) its props form on the right. The iframe is fed
 * the current tree over postMessage on every change and reports clicks
 * back by path — see apps/cms-admin/app/(canvas)/canvas/page.jsx for the
 * other side of this bridge.
 *
 * @param {{ blockTree: object[], onChange: (nodes: object[]) => void, allowedBlockIds: string[], catalog: object[] }} props
 */
export function CanvasEditor({
  blockTree,
  onChange,
  allowedBlockIds,
  catalog,
}) {
  const iframeRef = useRef(null);
  const [canvasAcked, setCanvasAcked] = useState(false);
  const [selectedPath, setSelectedPath] = useState(null);

  useEffect(() => {
    function handleMessage(event) {
      if (event.source !== iframeRef.current?.contentWindow) return;
      if (event.data?.type === "of-canvas-ack") {
        setCanvasAcked(true);
      } else if (event.data?.type === "of-canvas-select") {
        setSelectedPath(event.data.path);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  useEffect(() => {
    function sendTree() {
      iframeRef.current?.contentWindow?.postMessage(
        { type: "of-canvas-tree", tree: blockTree },
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
  }, [canvasAcked, blockTree]);

  function addNode(blockId) {
    const definition = catalog.find((entry) => entry.id === blockId);
    if (!definition) return;
    onChange([
      ...blockTree,
      {
        blockId,
        blockVersion: definition.version,
        props: { ...definition.defaultProps },
        slots: {},
      },
    ]);
  }

  const selectedNode = selectedPath
    ? getNodeAtPath(blockTree, selectedPath)
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
          onAdd={addNode}
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
                onChange(
                  setNodeAtPath(blockTree, selectedPath, (node) => ({
                    ...node,
                    props: nextProps,
                  })),
                )
              }
              props={selectedNode.props}
            />
          </>
        ) : (
          <p className="muted">Select a block on the canvas to edit it.</p>
        )}
      </aside>
    </div>
  );
}
