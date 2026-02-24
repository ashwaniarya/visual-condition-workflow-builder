import type { WorkflowState } from "@/constants/workflowState";
import { WORKFLOW_STATE_MESSAGES } from "@/constants/workflowState";
import type { BaseNode } from "@/model/interface";

export function computeWorkflowStateAndMessage(
  nodes: BaseNode[]
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
  return { state: "VALID", message: WORKFLOW_STATE_MESSAGES.VALID };
}
