import { useStore } from "reactflow";
import type { BaseEdge } from "@/model/interface";
import EdgeConfiguration from "@/components/nodes/configuration/EdgeConfiguration";
import { Typography } from "@/ui";

interface EdgeConfigurationGateProps {
  edgeId: string;
}

function areSelectedEdgeDataEqual(
  prev: BaseEdge | null,
  next: BaseEdge | null
): boolean {
  if (prev === next) return true;
  if (!prev || !next) return false;
  return (
    prev.id === next.id &&
    prev.condition === next.condition &&
    prev.sourceNodeId === next.sourceNodeId &&
    prev.targetNodeId === next.targetNodeId
  );
}

export default function EdgeConfigurationGate({
  edgeId,
}: EdgeConfigurationGateProps) {
  const selectedEdge = useStore(
    (state) =>
      state.edges.find((e) => e.id === edgeId)?.data?.baseEdge ?? null,
    areSelectedEdgeDataEqual
  );

  if (!selectedEdge) {
    return (
      <div className="p-4">
        <Typography variant="body" className="text-neutral-500">
          Select a node or edge to configure
        </Typography>
      </div>
    );
  }

  return <EdgeConfiguration selectedEdge={selectedEdge} />;
}
