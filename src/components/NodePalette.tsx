import { nodeRegistry } from "@/registry/nodeRegistry";
import type { BaseNode } from "@/model/interface";
import { paletteNodeRegistry } from "@/components/nodes/palette";
import { DRAG_DATA_TYPE } from "@/constants/dragConfig";

function handleDragStart(event: React.DragEvent, nodeType: string) {
  event.dataTransfer.setData(DRAG_DATA_TYPE, nodeType);
  event.dataTransfer.effectAllowed = "copy";
}

export default function NodePalette() {
  const entries = Object.entries(nodeRegistry) as [string, BaseNode][];

  return (
    <div style={{ padding: 12 }}>
      <h3 style={{ margin: "0 0 12px", fontSize: 14, fontWeight: 600 }}>
        Nodes
      </h3>
      <ul
        style={{
          listStyle: "none",
          margin: 0,
          padding: 0,
          display: "flex",
          flexDirection: "column",
          gap: 8,
        }}
      >
        {entries.map(([nodeType, baseNode]) => {
          const PaletteItem =
            paletteNodeRegistry[nodeType] ?? paletteNodeRegistry.task;
          return (
            <li key={nodeType} style={{ listStyle: "none" }}>
              <PaletteItem
                nodeType={nodeType}
                baseNode={baseNode}
                onDragStart={handleDragStart}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
