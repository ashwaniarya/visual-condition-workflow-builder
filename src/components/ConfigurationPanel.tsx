import { useSelector } from "react-redux";
import { useStore } from "reactflow";
import type { RootState } from "@/store";
import NodeConfiguration from "@/components/nodes/configuration/NodeConfiguration";
import EdgeConfiguration from "@/components/nodes/configuration/EdgeConfiguration";

const emptyStateStyle = {
  padding: 16,
  color: "#666",
  fontSize: 14,
} as const;

export default function ConfigurationPanel() {
  const selected = useSelector((state: RootState) => state.canvas.selected);
  const nodes = useStore((state) => Array.from(state.nodeInternals.values()));
  const edges = useStore((state) => state.edges);

  if (!selected) {
    return (
      <div style={emptyStateStyle}>
        Select a node or edge to configure
      </div>
    );
  }

  if (selected.selectionType === "node") {
    const flowNode = nodes.find((n) => n.id === selected.selectionId);
    const selectedNode = flowNode?.data?.baseNode;
    if (!selectedNode) {
      return (
        <div style={emptyStateStyle}>
          Select a node or edge to configure
        </div>
      );
    }
    return <NodeConfiguration selectedNode={selectedNode} nodeId={selected.selectionId} />;
  }

  const flowEdge = edges.find((e) => e.id === selected.selectionId);
  const selectedEdge = flowEdge?.data?.baseEdge;
  if (!selectedEdge) {
    return (
      <div style={emptyStateStyle}>
        Select a node or edge to configure
      </div>
    );
  }
  return <EdgeConfiguration selectedEdge={selectedEdge} />;
}
