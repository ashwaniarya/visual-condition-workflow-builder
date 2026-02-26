import type { WorkflowState } from "@/shared/constants/workflowState";
import { WORKFLOW_STATE_MESSAGES } from "@/shared/constants/workflowState";
import type { BaseEdge, BaseNode } from "@/domain/model/interface";
import { validateEdgeCondition } from "@/shared/utils/formValidation";

export function computeWorkflowStateAndMessage(
  nodes: BaseNode[],
  edges: BaseEdge[]
): { state: WorkflowState; message: string } {
  if (nodes.length === 0) {
    return { state: "EMPTY", message: WORKFLOW_STATE_MESSAGES.EMPTY };
  }
  const hasStartNode = nodes.some((n) => n._type === "start");
  if (!hasStartNode) {
    return { state: "BROKEN", message: WORKFLOW_STATE_MESSAGES.NO_START_NODE };
  }
  const brokenCount = nodes.filter(
    (n) => n._nodeConfigState === "INVALID_CONFIGURATION"
  ).length;
  if (brokenCount > 0) {
    return {
      state: "BROKEN",
      message: WORKFLOW_STATE_MESSAGES.BROKEN_TASK_NODES(brokenCount),
    };
  }
  const brokenEdgeCount = edges.filter(
    (edge) => Boolean(validateEdgeCondition(edge.condition ?? "").conditionError)
  ).length;
  if (brokenEdgeCount > 0) {
    return {
      state: "BROKEN",
      message: WORKFLOW_STATE_MESSAGES.BROKEN_EDGES(brokenEdgeCount),
    };
  }
  return { state: "VALID", message: WORKFLOW_STATE_MESSAGES.VALID };
}
