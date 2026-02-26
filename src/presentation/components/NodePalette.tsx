import { nodeRegistry } from "@/domain/registry/nodeRegistry";
import type { BaseNode } from "@/domain/model/interface";
import { paletteNodeRegistry } from "@/presentation/components/nodes/palette";
import { DRAG_DATA_TYPE } from "@/shared/constants/dragConfig";
import { Typography } from "@/design-system/ui";
import { GripHorizontal } from "lucide-react";
import { useState } from "react";

function handleDragStart(event: React.DragEvent, nodeType: string) {
  event.dataTransfer.setData(DRAG_DATA_TYPE, nodeType);
  event.dataTransfer.effectAllowed = "copy";
}

export default function NodePalette() {
  const [draggingNodeType, setDraggingNodeType] = useState<string | null>(null);

  function handlePaletteDragStart(event: React.DragEvent, nodeType: string) {
    handleDragStart(event, nodeType);
    setDraggingNodeType(nodeType);
  }

  function handlePaletteDragEnd() {
    setDraggingNodeType(null);
  }

  const entries = (Object.entries(nodeRegistry) as [string, BaseNode][]).filter(
    ([type]) => type !== "start"
  );

  return (
    <div className="bg-white/95 backdrop-blur-sm border border-neutral-200 rounded-lg shadow-lg p-3 w-48 flex flex-col gap-3">
      <div className="flex items-center gap-2 pb-2 border-b border-neutral-100">
        <GripHorizontal className="w-4 h-4 text-neutral-400" />
        <Typography variant="caption" weight="bold" className="text-neutral-500 uppercase tracking-wider text-[10px]">
          Components
        </Typography>
      </div>

      <ul className="list-none m-0 p-0 flex flex-col gap-2">
        {entries.map(([nodeType, baseNode]) => {
          const PaletteItem =
            paletteNodeRegistry[nodeType] ?? paletteNodeRegistry.task;
          return (
            <li key={nodeType} className="list-none transition-transform duration-200 hover:-translate-y-0.5">
              <PaletteItem
                nodeType={nodeType}
                baseNode={baseNode}
                onDragStart={handlePaletteDragStart}
                onDragEnd={handlePaletteDragEnd}
                isDragging={draggingNodeType === nodeType}
              />
            </li>
          );
        })}
      </ul>
    </div>
  );
}
