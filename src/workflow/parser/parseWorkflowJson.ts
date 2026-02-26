import { ZodError } from "zod";
import { workflowPayloadSchema, type WorkflowPayload } from "@/workflow/schema/workflowSchema";

export type ParseWorkflowJsonResult =
  | {
      isValid: true;
      workflowPayload: WorkflowPayload;
    }
  | {
      isValid: false;
      errorMessages: string[];
    };

function formatZodErrorMessages(error: ZodError): string[] {
  return error.issues.map((issue) => {
    const issuePath = issue.path.length > 0 ? issue.path.join(".") : "root";
    return `${issuePath}: ${issue.message}`;
  });
}

function validateWorkflowRelations(workflowPayload: WorkflowPayload): string[] {
  const relationErrors: string[] = [];
  const nodeIds = workflowPayload.nodes.map((baseNode) => baseNode.id);
  const uniqueNodeIdSet = new Set(nodeIds);

  if (uniqueNodeIdSet.size !== nodeIds.length) {
    relationErrors.push("nodes: duplicate node ids detected.");
  }

  const edgeIds = workflowPayload.edges.map((baseEdge) => baseEdge.id);
  const uniqueEdgeIdSet = new Set(edgeIds);
  if (uniqueEdgeIdSet.size !== edgeIds.length) {
    relationErrors.push("edges: duplicate edge ids detected.");
  }

  workflowPayload.edges.forEach((baseEdge, edgeIndex) => {
    if (!uniqueNodeIdSet.has(baseEdge.sourceNodeId)) {
      relationErrors.push(
        `edges.${edgeIndex}.sourceNodeId: '${baseEdge.sourceNodeId}' does not match an existing node id.`
      );
    }
    if (!uniqueNodeIdSet.has(baseEdge.targetNodeId)) {
      relationErrors.push(
        `edges.${edgeIndex}.targetNodeId: '${baseEdge.targetNodeId}' does not match an existing node id.`
      );
    }
  });

  return relationErrors;
}

export function parseWorkflowJson(workflowJsonText: string): ParseWorkflowJsonResult {
  let parsedJson: unknown;

  try {
    parsedJson = JSON.parse(workflowJsonText);
  } catch (error) {
    if (error instanceof Error) {
      return {
        isValid: false,
        errorMessages: [`json: ${error.message}`],
      };
    }

    return {
      isValid: false,
      errorMessages: ["json: failed to parse content."],
    };
  }

  const schemaValidationResult = workflowPayloadSchema.safeParse(parsedJson);
  if (!schemaValidationResult.success) {
    return {
      isValid: false,
      errorMessages: formatZodErrorMessages(schemaValidationResult.error),
    };
  }

  const relationErrors = validateWorkflowRelations(schemaValidationResult.data);
  if (relationErrors.length > 0) {
    return {
      isValid: false,
      errorMessages: relationErrors,
    };
  }

  return {
    isValid: true,
    workflowPayload: schemaValidationResult.data,
  };
}

