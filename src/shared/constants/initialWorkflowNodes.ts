import { nodeRegistry } from "@/domain/registry/nodeRegistry";

export const INITIAL_WORKFLOW_NODE_POLICY = {
  startNodeId: "start_1",
  startNodeType: "start",
  startNodePosition: { x: 50, y: 50 },
} as const;

export function createInitialWorkflowNodes() {
  const { startNodeId, startNodeType, startNodePosition } = INITIAL_WORKFLOW_NODE_POLICY;

  return [
    {
      id: startNodeId,
      type: startNodeType,
      position: startNodePosition,
      data: {
        baseNode: {
          ...nodeRegistry.start,
          id: startNodeId,
          _uiconfig: {
            ...nodeRegistry.start._uiconfig,
            position: startNodePosition,
          },
        },
      },
    },
  ];
}
