export const WORKFLOW_STATES = ["EMPTY", "VALID", "BROKEN"] as const;
export type WorkflowState = (typeof WORKFLOW_STATES)[number];

export const WORKFLOW_STATE_MESSAGES = {
  EMPTY: "No nodes on canvas",
  NO_START_NODE: "No start node is found.",
  BROKEN_TASK_NODES: (count: number) => `Found ${count} broken task node(s).`,
  BROKEN_EDGES: (count: number) => `Found ${count} broken edge(s).`,
  VALID: "Workflow is valid.",
} as const;
