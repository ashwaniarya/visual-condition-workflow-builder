import type { BaseNode } from "@/model/interface";
import {
  DRAGGING_PALETTE_NODE_SHADOW,
  NODE_TYPE_BACKGROUNDS,
  NODE_ICON_COLORS,
} from "@/constants/nodeStyles";
import { paletteNodeMetadata } from "@/constants/paletteMetadata";
import { Typography, InfoButton } from "@/ui";
import { cn } from "@/lib/utils";
import { Square } from "lucide-react";

interface TaskNodePaletteItemProps {
  nodeType: string;
  baseNode: BaseNode;
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

export default function TaskNodePaletteItem({
  nodeType,
  baseNode,
  onDragStart,
  onDragEnd,
  isDragging,
}: TaskNodePaletteItemProps) {
  const backgroundColor =
    NODE_TYPE_BACKGROUNDS[baseNode._type] ?? NODE_TYPE_BACKGROUNDS.task;
  const iconColor = NODE_ICON_COLORS[baseNode._type] ?? NODE_ICON_COLORS.task;
  const metadata = paletteNodeMetadata[nodeType] ?? paletteNodeMetadata.task;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, nodeType)}
      onDragEnd={onDragEnd}
      className={cn(
        "flex items-center gap-2 p-2 rounded-md border cursor-grab active:cursor-grabbing transition-all",
        isDragging ? "border-neutral-300" : "border-transparent hover:border-neutral-200"
      )}
      style={{
        backgroundColor,
        boxShadow: isDragging ? DRAGGING_PALETTE_NODE_SHADOW : "none",
      }}
    >
      <InfoButton message={metadata.infoMessage} />
      <Square className="w-4 h-4" style={{ color: iconColor }} />
      <div className="flex-1 min-w-0">
        <Typography variant="caption" weight="medium" className="text-neutral-700">
          {metadata.displayTitle}
        </Typography>
      </div>
    </div>
  );
}
