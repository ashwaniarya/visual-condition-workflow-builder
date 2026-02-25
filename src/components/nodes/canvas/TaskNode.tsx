import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import type { BaseNode } from "@/model/interface";
import { NODE_TYPE_BACKGROUNDS } from "@/constants/nodeStyles";
import { Typography } from "@/ui";

type TaskNodeData = { baseNode: BaseNode };

export default function TaskNode({ data }: NodeProps<TaskNodeData>) {
  const baseNode = data.baseNode;
  return (
    <div
      className="min-w-20 rounded-md p-3"
      style={{ backgroundColor: NODE_TYPE_BACKGROUNDS.task }}
    >
      <Handle type="target" position={Position.Left} />
      <Handle type="source" position={Position.Right} />
      <Typography variant="body" weight="semibold" className="text-[13px]">
        {baseNode.config.name || "<need name>"}
      </Typography>
      <Typography variant="caption" className="mt-1 text-[11px] text-neutral-500">
        {baseNode.config.description || "<need a description>"}
      </Typography>
    </div>
  );
}
