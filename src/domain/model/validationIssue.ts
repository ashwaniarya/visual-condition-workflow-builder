export interface NodeValidationIssue {
  issueType: "node";
  issueId: string;
  nodeId: string;
  nodeDisplayName: string;
  reason: string;
}

export interface EdgeValidationIssue {
  issueType: "edge";
  issueId: string;
  edgeId: string;
  sourceNodeId: string;
  targetNodeId: string;
  sourceDisplayName: string;
  targetDisplayName: string;
  reason: string;
}

export type ValidationIssue = NodeValidationIssue | EdgeValidationIssue;

