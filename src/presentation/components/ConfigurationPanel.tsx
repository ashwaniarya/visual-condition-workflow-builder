import { useSelector } from "react-redux";
import type { RootState } from "@/state/store";
import NodeConfiguration from "@/presentation/components/nodes/configuration/NodeConfiguration";
import EdgeConfigurationGate from "@/presentation/components/nodes/configuration/EdgeConfigurationGate";
import { Typography } from "@/design-system/ui";
import { MousePointerClick } from "lucide-react";

export default function ConfigurationPanel() {
  const selected = useSelector((state: RootState) => state.canvas.selected);

  if (!selected) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-full text-center bg-neutral-50/30">
        <div className="bg-white p-3 rounded-xl shadow-sm border border-neutral-100 mb-3">
          <MousePointerClick className="w-6 h-6 text-neutral-400" />
        </div>
        <Typography variant="body" weight="medium" className="text-neutral-600">
          No Selection
        </Typography>
        <Typography
          variant="caption"
          className="text-neutral-400 mt-1 max-w-[180px]"
        >
          Click on a node or edge to edit its properties
        </Typography>
      </div>
    );
  }

  if (selected.selectionType === "node") {
    return <NodeConfiguration nodeId={selected.selectionId} />;
  }

  return <EdgeConfigurationGate edgeId={selected.selectionId} />;
}
