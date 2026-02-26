import type { BaseNode } from "@/domain/model/interface";
import StartNodePaletteItem from "./StartNodePaletteItem";
import TaskNodePaletteItem from "./TaskNodePaletteItem";
import EndNodePaletteItem from "./EndNodePaletteItem";

export type PaletteItemComponent = React.ComponentType<{
  nodeType: string;
  baseNode: BaseNode;
  onDragStart: (event: React.DragEvent, nodeType: string) => void;
  onDragEnd: () => void;
  isDragging: boolean;
}>;

export const paletteNodeRegistry: Record<string, PaletteItemComponent> = {
  start: StartNodePaletteItem,
  task: TaskNodePaletteItem,
  end: EndNodePaletteItem,
};
