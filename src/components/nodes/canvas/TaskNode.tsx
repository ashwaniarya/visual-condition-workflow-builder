import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import type { BaseNode } from "@/model/interface";
import { NODE_TYPE_BACKGROUNDS } from "@/constants/nodeStyles";

type TaskNodeData = { baseNode: BaseNode };

export default function TaskNode({ data }: NodeProps<TaskNodeData>) {
  const baseNode = data.baseNode;
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 6,
        backgroundColor: NODE_TYPE_BACKGROUNDS.task,
        minWidth: 80,
      }}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <div style={{ fontWeight: 600, fontSize: 13 }}>
        {baseNode.config.name || "<need name>"}
      </div>
      <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
        {baseNode.config.description || "<need a description>"}
      </div>
    </div>
  );
}
