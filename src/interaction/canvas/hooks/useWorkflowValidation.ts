import { useEffect } from "react";
import type { Edge as ReactFlowEdge, Node as ReactFlowNode } from "reactflow";
import type { BaseEdge, BaseNode } from "@/domain/model/interface";
import { setWorkflowValidation } from "@/state/store/canvasSlice";
import { computeWorkflowStateAndMessage } from "@/shared/utils/workflowValidation";
import type { AppDispatch } from "@/state/store";

export function useWorkflowValidation(
  nodes: ReactFlowNode[],
  edges: ReactFlowEdge[],
  dispatch: AppDispatch
) {
  useEffect(() => {
    const baseNodes = nodes
      .map((n) => n.data?.baseNode)
      .filter((b): b is BaseNode => Boolean(b));
    const baseEdges = edges
      .map((e) => e.data?.baseEdge)
      .filter((b): b is BaseEdge => Boolean(b));
    const { state: workflowState, message: workflowStateMessage } =
      computeWorkflowStateAndMessage(baseNodes, baseEdges);
    dispatch(setWorkflowValidation({ workflowState, workflowStateMessage }));
  }, [nodes, edges, dispatch]);
}
