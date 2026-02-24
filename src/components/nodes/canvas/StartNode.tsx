import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import type { BaseNode } from "@/model/interface";
import { NODE_TYPE_BACKGROUNDS } from "@/constants/nodeStyles";

type StartNodeData = { baseNode: BaseNode };

export default function StartNode({ data }: NodeProps<StartNodeData>) {
  const baseNode = data.baseNode;
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 6,
        backgroundColor: NODE_TYPE_BACKGROUNDS.start,
        minWidth: 80,
      }}
    >
      <Handle type="source" position={Position.Right} />
      <div style={{ fontWeight: 600, fontSize: 13 }}>{baseNode.config.name || "Start"}</div>
      <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
        {baseNode.config.description}
      </div>
    </div>
  );
}
