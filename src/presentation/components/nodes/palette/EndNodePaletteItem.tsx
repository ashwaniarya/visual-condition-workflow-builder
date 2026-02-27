import type { BaseNode } from "@/domain/model/interface";
import {
  DRAGGING_PALETTE_NODE_SHADOW,
  NODE_TYPE_BACKGROUNDS,
  NODE_ICON_COLORS,
} from "@/shared/constants/nodeStyles";
import { paletteNodeMetadata } from "@/shared/constants/paletteMetadata";
import { Typography, InfoButton } from "@/design-system/ui";
import { cn } from "@/shared/lib/utils";
import { StopCircle } from "lucide-react";

interface EndNodePaletteItemProps {
  nodeType: string;
  baseNode: BaseNode;
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}

export default function EndNodePaletteItem({
  nodeType,
  baseNode,
  onDragStart,
  onDragEnd,
  isDragging,
}: EndNodePaletteItemProps) {
  const backgroundColor =
    NODE_TYPE_BACKGROUNDS[baseNode._type] ?? NODE_TYPE_BACKGROUNDS.task;
  const iconColor = NODE_ICON_COLORS[baseNode._type] ?? NODE_ICON_COLORS.task;
  const metadata = paletteNodeMetadata[nodeType] ?? paletteNodeMetadata.end;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, nodeType)}
      onDragEnd={onDragEnd}
      className={cn(
        "flex items-center gap-2 p-2 rounded-md border cursor-grab active:cursor-grabbing transition-all",
        isDragging
          ? "border-neutral-300"
          : "border-transparent hover:border-neutral-200",
      )}
      style={{
        backgroundColor,
        boxShadow: isDragging ? DRAGGING_PALETTE_NODE_SHADOW : "none",
      }}
    >
      <InfoButton message={metadata.infoMessage} />
      <StopCircle className="w-4 h-4 shrink-0" style={{ color: iconColor }} />
      <div className="flex-1 min-w-0 flex items-center">
        <Typography
          variant="caption"
          weight="medium"
          className="leading-4 text-neutral-700"
        >
          {metadata.displayTitle}
        </Typography>
      </div>
    </div>
  );
}
