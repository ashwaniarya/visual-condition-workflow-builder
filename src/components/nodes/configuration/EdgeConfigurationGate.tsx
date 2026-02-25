import { useStore } from "reactflow";
import type { BaseEdge } from "@/model/interface";
import EdgeConfiguration from "@/components/nodes/configuration/EdgeConfiguration";

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
      <div style={{ padding: 16, color: "#666", fontSize: 14 }}>
        Select a node or edge to configure
      </div>
    );
  }

  return <EdgeConfiguration selectedEdge={selectedEdge} />;
}
