import type { Edge as ReactFlowEdge, Node as ReactFlowNode } from "reactflow";
import type { BaseEdge, BaseNode } from "@/domain/model/interface";
import type { WorkflowPayload } from "@/domain/workflow/schema/workflowSchema";

function isBaseNode(value: unknown): value is BaseNode {
  return typeof value === "object" && value !== null && "id" in value && "_type" in value;
}

function isBaseEdge(value: unknown): value is BaseEdge {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    "sourceNodeId" in value &&
    "targetNodeId" in value
  );
}

export function flowToWorkflowPayload(
  reactFlowNodes: ReactFlowNode[],
  reactFlowEdges: ReactFlowEdge[]
): WorkflowPayload {
  const nodes = reactFlowNodes
    .map((reactFlowNode) => reactFlowNode.data?.baseNode)
    .filter((baseNode): baseNode is BaseNode => isBaseNode(baseNode));

  const edges = reactFlowEdges
    .map((reactFlowEdge) => reactFlowEdge.data?.baseEdge)
    .filter((baseEdge): baseEdge is BaseEdge => isBaseEdge(baseEdge));

  return { nodes, edges };
}

export function workflowPayloadToFlow(workflowPayload: WorkflowPayload): {
  nodes: ReactFlowNode[];
  edges: ReactFlowEdge[];
} {
  const nodes: ReactFlowNode[] = workflowPayload.nodes.map((baseNode) => ({
    id: baseNode.id,
    type: baseNode._type,
    position: baseNode._uiconfig.position,
    data: { baseNode },
  }));

  const edges: ReactFlowEdge[] = workflowPayload.edges.map((baseEdge) => ({
    id: baseEdge.id,
    source: baseEdge.sourceNodeId,
    target: baseEdge.targetNodeId,
    type: baseEdge._type || "default",
    data: { baseEdge },
  }));

  return { nodes, edges };
}

