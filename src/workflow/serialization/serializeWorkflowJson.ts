import { WORKFLOW_SERIALIZATION_FLAGS } from "@/workflow/constants/workflowSerializationFlags";
import type { WorkflowPayload } from "@/workflow/schema/workflowSchema";

export function serializeWorkflowJson(workflowPayload: WorkflowPayload): string {
  return JSON.stringify(workflowPayload, null, WORKFLOW_SERIALIZATION_FLAGS.jsonIndentSpaces);
}

