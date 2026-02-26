import { WORKFLOW_SERIALIZATION_FLAGS } from "@/domain/workflow/constants/workflowSerializationFlags";
import type { WorkflowPayload } from "@/domain/workflow/schema/workflowSchema";

export function serializeWorkflowJson(workflowPayload: WorkflowPayload): string {
  return JSON.stringify(workflowPayload, null, WORKFLOW_SERIALIZATION_FLAGS.jsonIndentSpaces);
}

