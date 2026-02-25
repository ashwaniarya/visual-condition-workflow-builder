import { useSelector } from "react-redux";
import type { RootState } from "@/store";
import NodeConfiguration from "@/components/nodes/configuration/NodeConfiguration";
import EdgeConfigurationGate from "@/components/nodes/configuration/EdgeConfigurationGate";
import { Typography } from "@/ui";

export default function ConfigurationPanel() {
  const selected = useSelector((state: RootState) => state.canvas.selected);

  if (!selected) {
    return (
      <div className="p-4">
        <Typography variant="body" className="text-neutral-500">
          Select a node or edge to configure
        </Typography>
      </div>
    );
  }

  if (selected.selectionType === "node") {
    return <NodeConfiguration nodeId={selected.selectionId} />;
  }

  return <EdgeConfigurationGate edgeId={selected.selectionId} />;
}
