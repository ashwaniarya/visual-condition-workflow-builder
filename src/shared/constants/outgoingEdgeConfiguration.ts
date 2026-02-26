import { WORKFLOW_EDGE_TYPES } from "@/shared/constants/workflowEdgeTypes";

export const OUTGOING_EDGE_CONFIGURATION_TEXT = {
  title: "Outgoing Edges",
  addEdgeButton: "Add Edge",
  cancelAddButton: "Cancel",
  confirmAddButton: "Add",
  removeEdgeButton: "Remove",
  conditionLabel: "Condition",
  targetLabel: "Target Node",
  addConditionPlaceholder: "e.g. status === 'approved'",
  emptyState: "No outgoing edges yet.",
  noValidTargetNodes: "No valid target nodes available.",
  addFormHint: "Provide condition and target node to create an edge.",
  targetRequiredError: "Target node is required.",
  noTargetOption: "Select target node",
} as const;

export const OUTGOING_EDGE_CONFIGURATION_IDS = {
  addConditionError: "add-edge-condition-error",
  addTargetError: "add-edge-target-error",
} as const;

export const OUTGOING_EDGE_CONFIGURATION_POLICY = {
  blockedTargetNodeTypes: ["start"] as const,
  edgeType: WORKFLOW_EDGE_TYPES.condition,
} as const;

export const OUTGOING_EDGE_CONFIGURATION_UI_POLICY = {
  targetNameMaxCharacters: 24,
  targetIdMaxCharacters: 8,
  targetLabelSeparator: " | ",
  rowContainerPaddingClassName: "p-1",
  rowContentGapClassName: "gap-1",
  rowControlHeightClassName: "h-7",
  rowControlHorizontalPaddingClassName: "px-1.5",
  rowControlTextSizeClassName: "text-xs",
  rowDeleteButtonPaddingClassName: "p-1",
  rowDeleteIconSizeClassName: "w-3.5 h-3.5",
} as const;
