import { useDispatch } from "react-redux";
import {
  ReactFlow,
  useReactFlow,
  useNodesState,
  useEdgesState,
  Background,
  BackgroundVariant,
} from "reactflow";
import "reactflow/dist/style.css";
import { CANVAS_GRID } from "@/constants/layout";
import DefaultEdge from "@/components/edges/DefaultEdge";
import ConditionEdge from "@/components/edges/ConditionEdge";
import { WorkflowNode } from "@/components/nodes/canvas";
import { nodeRegistry } from "@/registry/nodeRegistry";
import {
  useCanvasConnect,
  useCanvasDrag,
  useCanvasSelection,
  useWorkflowValidation,
} from "./hooks";

const nodeTypes = Object.fromEntries(
  Object.keys(nodeRegistry).map((type) => [type, WorkflowNode])
);
const edgeTypes = { default: DefaultEdge, conditionedge: ConditionEdge };

function CanvasInner() {
  const dispatch = useDispatch();
  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { onConnect } = useCanvasConnect(setEdges);
  const {
    onDrop,
    onDragOver,
    onNodeDragStop,
    onSelectionDragStop,
  } = useCanvasDrag(setNodes, screenToFlowPosition);
  const {
    onNodeClick,
    onEdgeClick,
    onPaneClick,
    onNodesDelete,
    onEdgesDelete,
  } = useCanvasSelection();

  useWorkflowValidation(nodes, dispatch);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onNodesDelete={onNodesDelete}
      onEdgesDelete={onEdgesDelete}
      onConnect={onConnect}
      onNodeClick={onNodeClick}
      onEdgeClick={onEdgeClick}
      onPaneClick={onPaneClick}
      onDrop={onDrop}
      onDragOver={onDragOver}
      onNodeDragStop={onNodeDragStop}
      onSelectionDragStop={onSelectionDragStop}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      fitView
    >
      <Background
        variant={BackgroundVariant.Dots}
        gap={CANVAS_GRID.gap}
        size={CANVAS_GRID.size}
        color={CANVAS_GRID.color}
      />
    </ReactFlow>
  );
}

export default function CanvasContainer() {
  return (
    <div className="h-full w-full">
      <CanvasInner />
    </div>
  );
}
