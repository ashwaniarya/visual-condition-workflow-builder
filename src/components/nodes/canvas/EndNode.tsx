import type { NodeProps } from "reactflow";
import { Handle, Position } from "reactflow";
import type { BaseNode } from "@/model/interface";
import { NODE_TYPE_BACKGROUNDS, NODE_ICON_COLORS, NODE_BORDER_RADIUS, SELECTED_NODE_BORDER_WIDTH } from "@/constants/nodeStyles";
import { Typography } from "@/ui";
import { StopCircle } from "lucide-react";

type EndNodeData = { baseNode: BaseNode };

export default function EndNode({ data }: NodeProps<EndNodeData>) {
  const baseNode = data.baseNode;
  const backgroundColor = NODE_TYPE_BACKGROUNDS.end;
  const iconColor = NODE_ICON_COLORS.end;

  return (
    <div className="min-w-[160px] max-w-[280px] h-full relative">
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-neutral-400 !border-2 !border-white transition-colors hover:!bg-rose-500"
      />

      <div 
        className="overflow-hidden w-full h-full"
        style={{ borderRadius: `calc(${NODE_BORDER_RADIUS} - ${SELECTED_NODE_BORDER_WIDTH})` }}
      >
        <div className="flex items-center gap-2 p-2 border-b border-neutral-100" style={{ backgroundColor }}>
          <StopCircle className="w-4 h-4" style={{ color: iconColor }} />
          <Typography variant="caption" weight="bold" className="text-neutral-700 uppercase tracking-wide text-[10px]">
            End
          </Typography>
        </div>
        
        <div className="p-3">
          <Typography variant="body" weight="semibold" className="text-sm text-neutral-900">
            {baseNode.config.name || "End"}
          </Typography>
          {baseNode.config.description && (
            <Typography variant="caption" className="mt-1 text-xs text-neutral-500 break-words whitespace-pre-wrap">
              {baseNode.config.description}
            </Typography>
          )}
        </div>
      </div>
    </div>
  );
}
