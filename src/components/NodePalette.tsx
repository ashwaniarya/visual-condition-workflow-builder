import { nodeRegistry } from "@/registry/nodeRegistry";
import type { BaseNode } from "@/model/interface";
import { paletteNodeRegistry } from "@/components/nodes/palette";
import { DRAG_DATA_TYPE } from "@/constants/dragConfig";
import { Typography } from "@/ui";

function handleDragStart(event: React.DragEvent, nodeType: string) {
  event.dataTransfer.setData(DRAG_DATA_TYPE, nodeType);
  event.dataTransfer.effectAllowed = "copy";
}

export default function NodePalette() {
  const entries = Object.entries(nodeRegistry) as [string, BaseNode][];

  return (
    <div className="p-sm">
      <Typography variant="caption" weight="semibold" className="mb-sm block">
        Nodes
      </Typography>
      <ul className="list-none m-0 p-0 flex flex-col gap-sm">
        {entries.map(([nodeType, baseNode]) => {
          const PaletteItem =
            paletteNodeRegistry[nodeType] ?? paletteNodeRegistry.task;
          return (
            <li key={nodeType} className="list-none">
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
