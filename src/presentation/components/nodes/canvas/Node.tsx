import { useState, useCallback } from "react";
import { useReactFlow } from "reactflow";
import type { NodeProps } from "reactflow";
import type { BaseNode } from "@/domain/model/interface";
import { Trash2 } from "lucide-react";
import {
  PROTECTED_NODE_TYPES,
  DELETE_BUTTON_OFFSET,
} from "@/shared/constants/deletionConfig";
import {
  NODE_BORDER_RADIUS,
  NODE_TYPE_ACCENTS,
  SELECTED_NODE_SHADOW,
  SELECTED_NODE_BORDER_COLOR,
  SELECTED_NODE_BORDER_WIDTH,
} from "@/shared/constants/nodeStyles";
import { IconButton } from "@/design-system/ui";
import { cn } from "@/shared/lib/utils";

import StartNode from "./StartNode";
import EndNode from "./EndNode";
import TaskNode from "./TaskNode";

type NodeData = { baseNode: BaseNode };

export default function Node(props: NodeProps<NodeData>) {
  const { id, data, selected } = props;
  const baseNode = data.baseNode;
  const isInvalid = baseNode._nodeConfigState === "INVALID_CONFIGURATION";
  const [isHovered, setIsHovered] = useState(false);
  const { getNode, deleteElements } = useReactFlow();

  const isDeletable =
    !PROTECTED_NODE_TYPES.includes(baseNode._type as (typeof PROTECTED_NODE_TYPES)[number]);

  const handleDeleteClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      const node = getNode(id);
      if (node) {
        deleteElements({ nodes: [node] });
      }
    },
    [id, getNode, deleteElements],
  );

  const InnerNode = getInnerNode(baseNode._type);
  const accentColor = NODE_TYPE_ACCENTS[baseNode._type] || "var(--neutral-200)";

  // Determine styles based on state
  const borderColor = isInvalid
    ? "var(--destructive)"
    : selected
    ? SELECTED_NODE_BORDER_COLOR
    : accentColor;

  // Fixed border width to prevent layout shift
  const borderWidth = SELECTED_NODE_BORDER_WIDTH;
  const shadow = selected ? SELECTED_NODE_SHADOW : "var(--shadow-sm)";

  return (
    <div
      className={cn(
        "relative overflow-visible transition-all duration-200 bg-white box-border",
        selected && "z-10" // Lift z-index when selected so shadow is visible above others
      )}
      style={{
        borderRadius: NODE_BORDER_RADIUS,
        borderWidth: borderWidth,
        borderColor: borderColor,
        borderStyle: "solid",
        boxShadow: shadow,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {selected && (
        <div
          className="workflow-selected-node-gradient pointer-events-none absolute inset-[1px] z-0"
          style={{ borderRadius: `calc(${NODE_BORDER_RADIUS} - ${SELECTED_NODE_BORDER_WIDTH})` }}
        />
      )}

      <div className="relative z-10 w-full h-full">
        <InnerNode {...props} />
      </div>

      {isHovered && isDeletable && (
        <IconButton
          type="button"
          icon={<Trash2 className="h-4 w-4" />}
          variant="neutral"
          iconButtonSize="sm"
          aria-label="Delete node"
          className="nodrag nopan absolute z-20 bg-white shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200"
          style={{ top: DELETE_BUTTON_OFFSET, right: DELETE_BUTTON_OFFSET }}
          onClick={handleDeleteClick}
        />
      )}

      {isInvalid && (
        <div
          className="absolute inset-0 z-30 ring-2 ring-destructive/20 pointer-events-none"
          style={{ borderRadius: NODE_BORDER_RADIUS }}
        />
      )}
    </div>
  );
}

function getInnerNode(type: string) {
  switch (type) {
    case "start":
      return StartNode;
    case "end":
      return EndNode;
    case "task":
      return TaskNode;
    default:
      return TaskNode;
  }
}
