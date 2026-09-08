"use client";

import { Copy, Laptop, Smartphone, Tablet, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { getNodeAtPath } from "../lib/tree-path.js";
import { BlockPalette } from "./BlockPalette.jsx";
import { BlockPropsForm } from "./BlockPropsForm.jsx";
import { LibraryPalette } from "./LibraryPalette.jsx";

const PREVIEW_WIDTHS = {
  desktop: { icon: Laptop, label: "Desktop", width: "100%" },
  tablet: { icon: Tablet, label: "Tablet", width: "768px" },
  mobile: { icon: Smartphone, label: "Mobile", width: "390px" },
};

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
 *   allowedBlockIds: string[],
 *   catalog: object[],
 *   libraryCatalog: object[],
 *   themeId: string,
 *   tokenOverrides: object,
 *   onPropsChange: (nodeId: string, nextProps: object) => void,
 *   onInsert: (blockId: string, containerNodeId: string) => void,
 *   onInsertLibraryComponent: (componentId: string) => void,
 *   onRemove: (nodeId: string) => void,
 *   onMove: (movedNodeId: string, destinationNodeId: string, position: "before"|"after") => void,
 * }} props
 */
const PALETTE_TABS = [
  { id: "elements", label: "Elements" },
  { id: "blocks", label: "Blocks" },
  { id: "globals", label: "Globals" },
];

export function CanvasEditor({
  tree,
  allowedBlockIds,
  catalog,
  libraryCatalog,
  themeId,
  tokenOverrides,
  onPropsChange,
  onInsert,
  onInsertLibraryComponent,
  onRemove,
  onMove,
  onDuplicate,
}) {
  const iframeRef = useRef(null);
  const [canvasAcked, setCanvasAcked] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [paletteTab, setPaletteTab] = useState("elements");
  const [previewMode, setPreviewMode] = useState("desktop");

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
      } else if (event.data?.type === "of-canvas-remove") {
        const node = getNodeAtPath(tree, event.data.path);
        if (node) {
          onRemove(node.id);
          setSelectedNodeId((current) => (current === node.id ? null : current));
        }
      } else if (event.data?.type === "of-canvas-duplicate") {
        const node = getNodeAtPath(tree, event.data.path);
        if (node) onDuplicate(node.id);
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [tree, onMove, onRemove, onDuplicate]);

  useEffect(() => {
    function sendTree() {
      iframeRef.current?.contentWindow?.postMessage(
        {
          type: "of-canvas-tree",
          themeId,
          tokenOverrides,
          tree: stripNodeIds(tree),
        },
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
  }, [canvasAcked, tree, themeId, tokenOverrides]);

  const selectedNode = selectedNodeId
    ? findNodeById(tree, selectedNodeId)
    : null;
  const selectedDefinition = selectedNode
    ? catalog.find((entry) => entry.id === selectedNode.blockId)
    : null;

  return (
    <div className="canvas-editor">
      <aside className="canvas-palette">
        <div className="palette-tabs" role="tablist">
          {PALETTE_TABS.map((tab) => (
            <button
              aria-selected={paletteTab === tab.id}
              data-active={paletteTab === tab.id}
              key={tab.id}
              onClick={() => setPaletteTab(tab.id)}
              role="tab"
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>

        {paletteTab === "elements" ? (
          <BlockPalette
            allowedBlockIds={allowedBlockIds}
            catalog={catalog}
            // null, not the (possibly stale-by-now) pageRootNodeId snapshot
            // — see insertBlock's own comment on why "root" is resolved
            // fresh server-side rather than trusted from the client.
            onAdd={(blockId) => onInsert(blockId, null)}
          />
        ) : paletteTab === "blocks" ? (
          <LibraryPalette catalog={libraryCatalog} onAdd={onInsertLibraryComponent} />
        ) : (
          <p className="muted">
            Site-wide globals (header, footer, design tokens) will show up here.
          </p>
        )}
      </aside>

      <div className="canvas-center">
        <div className="canvas-device-toggle" role="tablist">
          {Object.entries(PREVIEW_WIDTHS).map(([mode, config]) => {
            const Icon = config.icon;
            return (
              <button
                aria-selected={previewMode === mode}
                data-active={previewMode === mode}
                key={mode}
                onClick={() => setPreviewMode(mode)}
                role="tab"
                title={config.label}
                type="button"
              >
                <Icon size={15} strokeWidth={1.75} />
              </button>
            );
          })}
        </div>

        <div className="canvas-frame-wrap" data-mode={previewMode}>
          <div
            className="canvas-frame-scaler"
            style={{ width: PREVIEW_WIDTHS[previewMode].width }}
          >
            <iframe
              className="canvas-frame"
              ref={iframeRef}
              src="/canvas"
              title="Page preview"
            />
          </div>
        </div>
      </div>

      <aside className="canvas-inspector">
        {selectedNode && selectedDefinition ? (
          <>
            <p className="editor-rail-label">{selectedDefinition.name}</p>
            <BlockPropsForm
              definition={selectedDefinition}
              key={selectedNode.id}
              onChange={(nextProps) =>
                onPropsChange(selectedNode.id, nextProps)
              }
              props={selectedNode.props}
            />
            <div className="canvas-inspector-actions">
              <button
                className="btn btn-ghost"
                onClick={() => onDuplicate(selectedNode.id)}
                type="button"
              >
                <Copy size={14} strokeWidth={1.75} />
                Duplicate
              </button>
              <button
                className="btn btn-ghost"
                data-danger="true"
                onClick={() => {
                  onRemove(selectedNode.id);
                  setSelectedNodeId(null);
                }}
                type="button"
              >
                <Trash2 size={14} strokeWidth={1.75} />
                Remove
              </button>
            </div>
          </>
        ) : (
          <p className="muted">Select a block on the canvas to edit it.</p>
        )}
      </aside>
    </div>
  );
}
