import { useEffect } from "react";
import type { Node as ReactFlowNode } from "reactflow";
import type { BaseNode } from "@/model/interface";
import { setWorkflowValidation } from "@/store/canvasSlice";
import { computeWorkflowStateAndMessage } from "@/utils/workflowValidation";
import type { AppDispatch } from "@/store";

export function useWorkflowValidation(
  nodes: ReactFlowNode[],
  dispatch: AppDispatch
) {
  useEffect(() => {
    const baseNodes = nodes
      .map((n) => n.data?.baseNode)
      .filter((b): b is BaseNode => Boolean(b));
    const { state: workflowState, message: workflowStateMessage } =
      computeWorkflowStateAndMessage(baseNodes);
    dispatch(setWorkflowValidation({ workflowState, workflowStateMessage }));
  }, [nodes, dispatch]);
}
