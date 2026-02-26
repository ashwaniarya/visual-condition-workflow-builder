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
import { CANVAS_GRID, CANVAS_VIEWPORT } from "@/shared/constants/layout";
import { createInitialWorkflowNodes } from "@/shared/constants/initialWorkflowNodes";
import { WORKFLOW_EDGE_TYPES } from "@/shared/constants/workflowEdgeTypes";
import DefaultEdge from "@/presentation/components/edges/DefaultEdge";
import ConditionEdge from "@/presentation/components/edges/ConditionEdge";
import WorkflowNode from "@/presentation/components/nodes/canvas/Node";
import { nodeRegistry } from "@/domain/registry/nodeRegistry";
import {
  useCanvasConnect,
  useCanvasDrag,
  useCanvasSelection,
  useWorkflowValidation,
} from "./hooks";

const nodeTypes = Object.fromEntries(
  Object.keys(nodeRegistry).map((type) => [type, WorkflowNode])
);
const edgeTypes = {
  [WORKFLOW_EDGE_TYPES.default]: DefaultEdge,
  [WORKFLOW_EDGE_TYPES.condition]: ConditionEdge,
};
const canvasAttributionConfiguration = { hideAttribution: true };

function CanvasInner() {
  const dispatch = useDispatch();
  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(createInitialWorkflowNodes());
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

  useWorkflowValidation(nodes, edges, dispatch);

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
      proOptions={canvasAttributionConfiguration}
      fitView
      fitViewOptions={{
        padding: CANVAS_VIEWPORT.fitViewPadding,
        maxZoom: CANVAS_VIEWPORT.defaultZoom,
      }}
      minZoom={CANVAS_VIEWPORT.minZoom}
      maxZoom={CANVAS_VIEWPORT.maxZoom}
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
