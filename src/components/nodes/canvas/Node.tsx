import { useState, useCallback } from "react";
import { useReactFlow } from "reactflow";
import type { NodeProps } from "reactflow";
import type { BaseNode } from "@/model/interface";
import {
  PROTECTED_NODE_TYPES,
  DELETE_BUTTON_OFFSET,
} from "@/constants/deletionConfig";
import { IconButton } from "@/ui";
import { cn } from "@/lib/utils";

import StartNode from "./StartNode";
import EndNode from "./EndNode";
import TaskNode from "./TaskNode";

type NodeData = { baseNode: BaseNode };

export default function Node(props: NodeProps<NodeData>) {
  const { id, data } = props;
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

  return (
    <div
      className={cn(
        "relative overflow-visible rounded-lg border-2",
        isInvalid ? "border-warning-500 ring-2 ring-warning-500/20" : "border-neutral-200",
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="overflow-hidden rounded-lg">
        <InnerNode {...props} />
      </div>
      {isHovered && isDeletable && (
        <IconButton
          type="button"
          icon={<span className="text-sm leading-none">×</span>}
          variant="neutral"
          iconButtonSize="sm"
          aria-label="Delete node"
          className="nodrag nopan absolute"
          style={{ top: DELETE_BUTTON_OFFSET, right: DELETE_BUTTON_OFFSET }}
          onClick={handleDeleteClick}
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
