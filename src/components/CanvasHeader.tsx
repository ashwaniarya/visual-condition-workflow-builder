import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import { WORKFLOW_STATUS_DOT_COLORS } from "@/constants/nodeStyles";

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "10px 16px",
  borderBottom: "1px solid #e0e0e0",
  backgroundColor: "#fafafa",
  flexShrink: 0,
};

const dotBaseStyle: React.CSSProperties = {
  width: 10,
  height: 10,
  borderRadius: "50%",
  flexShrink: 0,
};

const messageStyle: React.CSSProperties = {
  fontSize: 13,
  color: "#374151",
};

export default function CanvasHeader() {
  const workflowState = useSelector((state: RootState) => state.canvas.workflowState);
  const workflowStateMessage = useSelector((state: RootState) => state.canvas.workflowStateMessage);

  const dotColor = WORKFLOW_STATUS_DOT_COLORS[workflowState] ?? WORKFLOW_STATUS_DOT_COLORS.EMPTY;

  const dotStyle: React.CSSProperties = {
    ...dotBaseStyle,
    backgroundColor: dotColor,
    boxShadow: `0 0 8px ${dotColor}`,
    animation: "workflowStatusPulse 2s ease-in-out infinite",
  };

  return (
    <header style={headerStyle}>
      <div style={dotStyle} />
      <span style={messageStyle}>{workflowStateMessage}</span>
    </header>
  );
}
