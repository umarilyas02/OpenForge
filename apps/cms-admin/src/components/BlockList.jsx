"use client";

import { BlockPropsForm } from "./BlockPropsForm.jsx";

function AddBlockPicker({ allowedBlockIds, catalog, onAdd }) {
  const options = catalog.filter((definition) =>
    allowedBlockIds.includes(definition.id),
  );

  if (options.length === 0) return null;

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
      {options.map((definition) => (
        <button
          className="app-nav-link"
          key={definition.id}
          onClick={() => onAdd(definition.id)}
          type="button"
        >
          + {definition.name}
        </button>
      ))}
    </div>
  );
}

/**
 * Recursive block-tree editor: a flat list of block cards at this level,
 * each with prop editing, reordering, removal, and — for blocks that
 * declare slots — a nested BlockList per slot scoped to that slot's
 * acceptedTypes.
 *
 * @param {{ nodes: object[], onChange: (nodes: object[]) => void, allowedBlockIds: string[], catalog: object[] }} props
 */
export function BlockList({ nodes, onChange, allowedBlockIds, catalog }) {
  function updateNode(index, updater) {
    onChange(
      nodes.map((node, i) => (i === index ? updater({ ...node }) : node)),
    );
  }

  function removeNode(index) {
    onChange(nodes.filter((_, i) => i !== index));
  }

  function moveNode(index, direction) {
    const target = index + direction;
    if (target < 0 || target >= nodes.length) return;
    const next = [...nodes];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  function addNode(blockId) {
    const definition = catalog.find((entry) => entry.id === blockId);
    if (!definition) return;
    onChange([
      ...nodes,
      {
        blockId,
        blockVersion: definition.version,
        props: { ...definition.defaultProps },
        slots: {},
      },
    ]);
  }

  return (
    <div className="stack">
      {nodes.map((node, index) => {
        const definition = catalog.find((entry) => entry.id === node.blockId);

        return (
          <div className="block-card" key={`${node.blockId}-${index}`}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{definition?.name ?? node.blockId}</strong>
              <div style={{ display: "flex", gap: 4 }}>
                <button
                  disabled={index === 0}
                  onClick={() => moveNode(index, -1)}
                  type="button"
                >
                  ↑
                </button>
                <button
                  disabled={index === nodes.length - 1}
                  onClick={() => moveNode(index, 1)}
                  type="button"
                >
                  ↓
                </button>
                <button onClick={() => removeNode(index)} type="button">
                  Remove
                </button>
              </div>
            </div>

            {definition ? (
              <BlockPropsForm
                definition={definition}
                onChange={(nextProps) =>
                  updateNode(index, (n) => ({ ...n, props: nextProps }))
                }
                props={node.props}
              />
            ) : (
              <p className="form-error">
                Unknown block: {node.blockId}. Remove it to save this page.
              </p>
            )}

            {definition?.slots.map((slot) => (
              <div className="block-card-slot" key={slot.name}>
                <p className="muted">{slot.label}</p>
                <BlockList
                  allowedBlockIds={slot.acceptedTypes}
                  catalog={catalog}
                  nodes={node.slots?.[slot.name] ?? []}
                  onChange={(children) =>
                    updateNode(index, (n) => ({
                      ...n,
                      slots: { ...n.slots, [slot.name]: children },
                    }))
                  }
                />
              </div>
            ))}
          </div>
        );
      })}

      <AddBlockPicker
        allowedBlockIds={allowedBlockIds}
        catalog={catalog}
        onAdd={addNode}
      />
    </div>
  );
}
