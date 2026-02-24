import { useState, useCallback } from "react";
import { useReactFlow } from "reactflow";
import type { NodeProps } from "reactflow";
import type { BaseNode } from "@/model/interface";
import { DEFAULT_BORDER, INVALID_BORDER } from "@/constants/nodeStyles";
import {
  PROTECTED_NODE_TYPES,
  DELETE_BUTTON_SIZE,
  DELETE_BUTTON_OFFSET,
} from "@/constants/deletionConfig";
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

  const wrapperStyle: React.CSSProperties = {
    position: "relative",
    borderRadius: 8,
    overflow: "visible",
    border: isInvalid ? INVALID_BORDER : DEFAULT_BORDER,
    boxShadow: isInvalid ? "0 0 0 2px rgba(245, 158, 11, 0.2)" : undefined,
  };

  const deleteButtonStyle: React.CSSProperties = {
    position: "absolute",
    top: DELETE_BUTTON_OFFSET,
    right: DELETE_BUTTON_OFFSET,
    width: DELETE_BUTTON_SIZE,
    height: DELETE_BUTTON_SIZE,
    borderRadius: 4,
    border: "1px solid #b1b1b7",
    background: "#fff",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 14,
    color: "#666",
    lineHeight: 1,
  };

  const InnerNode = getInnerNode(baseNode._type);

  return (
    <div
      style={wrapperStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={{ overflow: "hidden", borderRadius: 8 }}>
        <InnerNode {...props} />
      </div>
      {isHovered && isDeletable && (
        <button
          type="button"
          className="nodrag nopan"
          style={deleteButtonStyle}
          onClick={handleDeleteClick}
          aria-label="Delete node"
        >
          ×
        </button>
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
