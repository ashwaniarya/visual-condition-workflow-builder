import { describe, expect, it } from "vitest";
import { WORKFLOW_STATE_MESSAGES } from "@/shared/constants/workflowState";
import { computeWorkflowStateAndMessage } from "@/shared/utils/workflowValidation";
import type { BaseEdge, BaseNode } from "@/domain/model/interface";

function createNode(overrides: Partial<BaseNode> = {}): BaseNode {
  return {
    _type: "task",
    id: "node_1",
    _nodeConfigState: "VALID_CONFIGURATION",
    config: {
      name: "Node name",
      description: "Node description",
      prompt: "",
    },
    _uiconfig: {
      position: { x: 0, y: 0 },
      portPolicy: [{ direction: "out" }],
    },
    ...overrides,
  };
}

function createEdge(overrides: Partial<BaseEdge> = {}): BaseEdge {
  return {
    _type: "conditionedge",
    id: "edge_1",
    sourceNodeId: "start_1",
    targetNodeId: "task_1",
    config: {},
    parameters: {},
    condition: "Pass Through",
    ...overrides,
  };
}

describe("computeWorkflowStateAndMessage", () => {
  it("returns EMPTY when node list is empty", () => {
    const result = computeWorkflowStateAndMessage([], []);

    expect(result).toEqual({
      state: "EMPTY",
      message: WORKFLOW_STATE_MESSAGES.EMPTY,
    });
  });

  it("returns BROKEN when no start node exists", () => {
    const nodes: BaseNode[] = [createNode({ id: "task_1", _type: "task" })];

    const result = computeWorkflowStateAndMessage(nodes, []);

    expect(result).toEqual({
      state: "BROKEN",
      message: WORKFLOW_STATE_MESSAGES.NO_START_NODE,
    });
  });

  it("returns BROKEN with broken task node count", () => {
    const nodes: BaseNode[] = [
      createNode({ id: "start_1", _type: "start" }),
      createNode({ id: "task_1", _type: "task", _nodeConfigState: "INVALID_CONFIGURATION" }),
      createNode({ id: "task_2", _type: "task", _nodeConfigState: "INVALID_CONFIGURATION" }),
    ];

    const result = computeWorkflowStateAndMessage(nodes, []);

    expect(result).toEqual({
      state: "BROKEN",
      message: WORKFLOW_STATE_MESSAGES.BROKEN_TASK_NODES(2),
    });
  });

  it("returns BROKEN with broken edge count", () => {
    const nodes: BaseNode[] = [createNode({ id: "start_1", _type: "start" }), createNode({ id: "task_1" })];
    const edges: BaseEdge[] = [
      createEdge({ id: "edge_1", condition: "" }),
      createEdge({ id: "edge_2", condition: "v".repeat(300) }),
    ];

    const result = computeWorkflowStateAndMessage(nodes, edges);

    expect(result).toEqual({
      state: "BROKEN",
      message: WORKFLOW_STATE_MESSAGES.BROKEN_EDGES(2),
    });
  });

  it("returns VALID when all rules pass", () => {
    const nodes: BaseNode[] = [
      createNode({ id: "start_1", _type: "start" }),
      createNode({ id: "task_1", _type: "task" }),
    ];
    const edges: BaseEdge[] = [createEdge({ id: "edge_1", sourceNodeId: "start_1", targetNodeId: "task_1" })];

    const result = computeWorkflowStateAndMessage(nodes, edges);

    expect(result).toEqual({
      state: "VALID",
      message: WORKFLOW_STATE_MESSAGES.VALID,
    });
  });

  it("prioritizes node errors before edge errors", () => {
    const nodes: BaseNode[] = [
      createNode({ id: "start_1", _type: "start" }),
      createNode({ id: "task_1", _nodeConfigState: "INVALID_CONFIGURATION" }),
    ];
    const edges: BaseEdge[] = [createEdge({ id: "edge_1", condition: "" })];

    const result = computeWorkflowStateAndMessage(nodes, edges);

    expect(result.state).toBe("BROKEN");
    expect(result.message).toBe(WORKFLOW_STATE_MESSAGES.BROKEN_TASK_NODES(1));
  });
});
