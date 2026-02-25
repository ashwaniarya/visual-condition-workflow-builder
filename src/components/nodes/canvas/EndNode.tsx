import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import type { BaseNode } from "@/model/interface";
import { NODE_TYPE_BACKGROUNDS } from "@/constants/nodeStyles";
import { Typography } from "@/ui";

type EndNodeData = { baseNode: BaseNode };

export default function EndNode({ data }: NodeProps<EndNodeData>) {
  const baseNode = data.baseNode;
  return (
    <div
      className="min-w-20 rounded-md p-3"
      style={{ backgroundColor: NODE_TYPE_BACKGROUNDS.end }}
    >
      <Handle type="target" position={Position.Left} />
      <Typography variant="body" weight="semibold" className="text-[13px]">
        {baseNode.config.name || "End"}
      </Typography>
      <Typography variant="caption" className="mt-1 text-[11px] text-neutral-500">
        {baseNode.config.description}
      </Typography>
    </div>
  );
}
