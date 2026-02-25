import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { WORKFLOW_STATUS_DOT_COLORS } from "@/constants/nodeStyles";
import { Typography } from "@/ui";

export default function CanvasHeader() {
  const workflowState = useSelector((state: RootState) => state.canvas.workflowState);
  const workflowStateMessage = useSelector((state: RootState) => state.canvas.workflowStateMessage);

  const dotColor = WORKFLOW_STATUS_DOT_COLORS[workflowState] ?? WORKFLOW_STATUS_DOT_COLORS.EMPTY;

  return (
    <header className="flex shrink-0 items-center gap-2.5 border-b border-neutral-200 bg-neutral-50 px-4 py-2.5">
      <div
        className="size-2.5 shrink-0 rounded-full"
        style={{
          backgroundColor: dotColor,
          boxShadow: `0 0 8px ${dotColor}`,
          animation: "workflowStatusPulse 2s ease-in-out infinite",
        }}
      />
      <Typography variant="body" className="text-[13px] text-neutral-700">
        {workflowStateMessage}
      </Typography>
    </header>
  );
}
