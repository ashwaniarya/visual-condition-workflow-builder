import { useMemo } from "react";
import { useStore } from "reactflow";
import type { BaseEdge, BaseNode } from "@/domain/model/interface";
import type { EdgeValidationIssue, NodeValidationIssue } from "@/domain/model/validationIssue";
import { VALIDATION_ISSUES_VIEWER } from "@/shared/constants/validationIssues";
import { getNodeDisplayName } from "@/shared/utils/nodeDisplay";
import { validateEdgeCondition, validateNodeConfig } from "@/shared/utils/formValidation";

function resolveNodeIssueReason(baseNode: BaseNode): string {
  const validationResult = validateNodeConfig(
    baseNode.config?.name ?? "",
    baseNode.config?.description ?? ""
  );

  const validationMessages = [
    validationResult.nameError,
    validationResult.descriptionError,
  ].filter((message): message is string => Boolean(message));

  if (validationMessages.length > 0) {
    return validationMessages.join(" ");
  }

  return VALIDATION_ISSUES_VIEWER.unknownNodeIssueMessage;
}

export function useValidationIssueList() {
  const flowNodes = useStore((state) => Array.from(state.nodeInternals.values()));
  const flowEdges = useStore((state) => state.edges);

  const nodeIssues = useMemo<NodeValidationIssue[]>(() => {
    return flowNodes
      .map((flowNode) => flowNode.data?.baseNode as BaseNode | undefined)
      .filter((baseNode): baseNode is BaseNode => Boolean(baseNode))
      .filter((baseNode) => baseNode._nodeConfigState === "INVALID_CONFIGURATION")
      .map((baseNode) => ({
        issueType: "node",
        issueId: `node:${baseNode.id}`,
        nodeId: baseNode.id,
        nodeDisplayName: getNodeDisplayName(baseNode, baseNode.id),
        reason: resolveNodeIssueReason(baseNode),
      }));
  }, [flowNodes]);

  const nodeById = useMemo(() => {
    return new Map(
      flowNodes
        .map((flowNode) => flowNode.data?.baseNode as BaseNode | undefined)
        .filter((baseNode): baseNode is BaseNode => Boolean(baseNode))
        .map((baseNode) => [baseNode.id, baseNode] as const)
    );
  }, [flowNodes]);

  const edgeIssues = useMemo<EdgeValidationIssue[]>(() => {
    return flowEdges
      .map((flowEdge) => flowEdge.data?.baseEdge as BaseEdge | undefined)
      .filter((baseEdge): baseEdge is BaseEdge => Boolean(baseEdge))
      .map((baseEdge) => ({
        baseEdge,
        validationResult: validateEdgeCondition(baseEdge.condition ?? ""),
      }))
      .filter(({ validationResult }) => Boolean(validationResult.conditionError))
      .map(({ baseEdge, validationResult }) => {
        const sourceNode = nodeById.get(baseEdge.sourceNodeId);
        const targetNode = nodeById.get(baseEdge.targetNodeId);
        return {
          issueType: "edge",
          issueId: `edge:${baseEdge.id}`,
          edgeId: baseEdge.id,
          sourceNodeId: baseEdge.sourceNodeId,
          targetNodeId: baseEdge.targetNodeId,
          sourceDisplayName: getNodeDisplayName(sourceNode, baseEdge.sourceNodeId),
          targetDisplayName: getNodeDisplayName(targetNode, baseEdge.targetNodeId),
          reason:
            validationResult.conditionError ??
            VALIDATION_ISSUES_VIEWER.unknownEdgeIssueMessage,
        };
      });
  }, [flowEdges, nodeById]);

  return {
    nodeIssues,
    edgeIssues,
    totalIssueCount: nodeIssues.length + edgeIssues.length,
  };
}
