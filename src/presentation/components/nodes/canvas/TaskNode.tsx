import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import type { BaseNode } from "@/domain/model/interface";
import {
  NODE_TYPE_BACKGROUNDS,
  NODE_ICON_COLORS,
  NODE_BORDER_RADIUS,
  SELECTED_NODE_BORDER_WIDTH,
} from "@/shared/constants/nodeStyles";
import { Typography } from "@/design-system/ui";
import { Square } from "lucide-react";

type TaskNodeData = { baseNode: BaseNode };

export default function TaskNode({ data }: NodeProps<TaskNodeData>) {
  const baseNode = data.baseNode;
  const backgroundColor = NODE_TYPE_BACKGROUNDS.task;
  const iconColor = NODE_ICON_COLORS.task;

  return (
    <div className="min-w-[160px] max-w-[280px] h-full relative">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-neutral-400 !border-2 !border-white transition-colors hover:!bg-blue-500"
      />

      <div
        className="overflow-hidden w-full h-full"
        style={{ borderRadius: `calc(${NODE_BORDER_RADIUS} - ${SELECTED_NODE_BORDER_WIDTH})` }}
      >
        <div className="flex items-center gap-2 p-2 border-b border-neutral-100" style={{ backgroundColor }}>
          <Square className="w-4 h-4" style={{ color: iconColor }} />
          <Typography variant="caption" weight="bold" className="text-neutral-700 uppercase tracking-wide text-[10px]">
            Task
          </Typography>
        </div>

        <div className="p-3">
          <Typography variant="body" weight="semibold" className="text-sm text-neutral-900">
            {baseNode.config.name || "Untitled Task"}
          </Typography>
          <Typography variant="caption" className="mt-1 text-xs text-neutral-500 break-words whitespace-pre-wrap">
            {baseNode.config.description || "No description provided"}
          </Typography>
        </div>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-neutral-400 !border-2 !border-white transition-colors hover:!bg-blue-500"
      />
    </div>
  );
}
