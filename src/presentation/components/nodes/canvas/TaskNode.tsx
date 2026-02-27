import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import type { BaseNode } from "@/domain/model/interface";
import {
  NODE_TYPE_BACKGROUNDS,
  NODE_ICON_COLORS,
  NODE_BORDER_RADIUS,
  SELECTED_NODE_BORDER_WIDTH,
  NODE_HANDLE_BASE_CLASSES,
  NODE_HANDLE_LEFT_OFFSET_PX,
  NODE_HANDLE_RIGHT_OFFSET_PX,
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
        className={`!w-5 !h-5 !bg-neutral-400 ${NODE_HANDLE_BASE_CLASSES} hover:!bg-blue-500`}
        style={{ left: NODE_HANDLE_LEFT_OFFSET_PX, right: "auto" }}
      />

      <div
        className="overflow-hidden w-full h-full"
        style={{ borderRadius: `calc(${NODE_BORDER_RADIUS} - ${SELECTED_NODE_BORDER_WIDTH})` }}
      >
        <div className="flex items-center gap-2 p-2 border-b border-neutral-100" style={{ backgroundColor }}>
          <Square className="w-4 h-4 shrink-0" style={{ color: iconColor }} />
          <Typography variant="caption" weight="bold" className="leading-none text-neutral-700 uppercase tracking-wide text-[10px]">
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
        className={`!w-5 !h-5 !bg-neutral-400 ${NODE_HANDLE_BASE_CLASSES} hover:!bg-blue-500`}
        style={{ left: "auto", right: NODE_HANDLE_RIGHT_OFFSET_PX }}
      />
    </div>
  );
}
