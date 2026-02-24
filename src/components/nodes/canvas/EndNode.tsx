import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import type { BaseNode } from "@/model/interface";
import { NODE_TYPE_BACKGROUNDS } from "@/constants/nodeStyles";

type EndNodeData = { baseNode: BaseNode };

export default function EndNode({ data }: NodeProps<EndNodeData>) {
  const baseNode = data.baseNode;
  return (
    <div
      style={{
        padding: 12,
        borderRadius: 6,
        backgroundColor: NODE_TYPE_BACKGROUNDS.end,
        minWidth: 80,
      }}
    >
      <Handle type="target" position={Position.Left} />
      <div style={{ fontWeight: 600, fontSize: 13 }}>{baseNode.config.name || "End"}</div>
      <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
        {baseNode.config.description}
      </div>
    </div>
  );
}
