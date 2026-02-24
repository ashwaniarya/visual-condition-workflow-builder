import type { BaseNode } from "@/model/interface";
import { NODE_TYPE_BACKGROUNDS } from "@/constants/nodeStyles";
import { paletteNodeMetadata } from "@/constants/paletteMetadata";
import InfoButton from "./InfoButton";

interface TaskNodePaletteItemProps {
  nodeType: string;
  baseNode: BaseNode;
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
}

export default function TaskNodePaletteItem({
  nodeType,
  baseNode,
  onDragStart,
}: TaskNodePaletteItemProps) {
  const backgroundColor =
    NODE_TYPE_BACKGROUNDS[baseNode._type] ?? NODE_TYPE_BACKGROUNDS.task;
  const metadata = paletteNodeMetadata[nodeType] ?? paletteNodeMetadata.task;

  return (
    <div
      style={{
        padding: 12,
        borderRadius: 8,
        backgroundColor,
        border: "1px solid #e0e0e0",
        display: "flex",
        alignItems: "flex-start",
        gap: 8,
      }}
    >
      <div
        draggable
        onDragStart={(e) => onDragStart(e, nodeType)}
        style={{
          flex: 1,
          cursor: "grab",
          minWidth: 0,
        }}
      >
        <div style={{ fontWeight: 600, fontSize: 13 }}>{metadata.displayTitle}</div>
      </div>
      <InfoButton message={metadata.infoMessage} />
    </div>
  );
}
