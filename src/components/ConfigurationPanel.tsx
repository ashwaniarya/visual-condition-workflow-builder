import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import NodeConfiguration from "@/components/nodes/configuration/NodeConfiguration";
import EdgeConfigurationGate from "@/components/nodes/configuration/EdgeConfigurationGate";

const emptyStateStyle = {
  padding: 16,
  color: "#666",
  fontSize: 14,
} as const;

export default function ConfigurationPanel() {
  const selected = useSelector((state: RootState) => state.canvas.selected);

  if (!selected) {
    return (
      <div style={emptyStateStyle}>Select a node or edge to configure</div>
    );
  }

  if (selected.selectionType === "node") {
    return <NodeConfiguration nodeId={selected.selectionId} />;
  }

  return <EdgeConfigurationGate edgeId={selected.selectionId} />;
}
