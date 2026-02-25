import type { BaseNode } from "@/model/interface";
import { NODE_TYPE_BACKGROUNDS } from "@/constants/nodeStyles";
import { paletteNodeMetadata } from "@/constants/paletteMetadata";
import { Card, Typography } from "@/ui";
import InfoButton from "./InfoButton";

interface EndNodePaletteItemProps {
  nodeType: string;
  baseNode: BaseNode;
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export default function EndNodePaletteItem({
  nodeType,
  baseNode,
  onDragStart,
}: EndNodePaletteItemProps) {
  const backgroundColor =
    NODE_TYPE_BACKGROUNDS[baseNode._type] ?? NODE_TYPE_BACKGROUNDS.task;
  const metadata = paletteNodeMetadata[nodeType] ?? paletteNodeMetadata.end;

  return (
    <Card
      padding="sm"
      className="flex items-start gap-sm"
      style={{ backgroundColor }}
    >
      <div
        draggable
        onDragStart={(e) => onDragStart(e, nodeType)}
        className="flex-1 cursor-grab min-w-0"
      >
        <Typography variant="caption" weight="semibold">
          {metadata.displayTitle}
        </Typography>
      </div>
      <InfoButton message={metadata.infoMessage} />
    </Card>
  );
}
