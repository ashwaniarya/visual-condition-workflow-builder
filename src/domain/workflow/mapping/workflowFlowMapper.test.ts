import { describe, expect, it } from "vitest";
import { flowToWorkflowPayload, workflowPayloadToFlow } from "@/domain/workflow/mapping/workflowFlowMapper";
import { WORKFLOW_EDGE_TYPES } from "@/shared/constants/workflowEdgeTypes";
import type { BaseEdge, BaseNode } from "@/domain/model/interface";

function createBaseNode(overrides: Partial<BaseNode> = {}): BaseNode {
  return {
    _type: "task",
    id: "node_1",
    _nodeConfigState: "VALID_CONFIGURATION",
    config: {
      name: "Node",
      description: "Node description",
      prompt: "",
    },
    _uiconfig: {
      position: { x: 10, y: 20 },
      portPolicy: [{ direction: "out" }],
    },
    ...overrides,
  };
}

function createBaseEdge(overrides: Partial<BaseEdge> = {}): BaseEdge {
  return {
    _type: WORKFLOW_EDGE_TYPES.condition,
    id: "edge_1",
    sourceNodeId: "node_1",
    targetNodeId: "node_2",
    config: {},
    parameters: {},
    condition: "Pass Through",
    ...overrides,
  };
}

describe("workflowFlowMapper", () => {
  it("maps workflow payload to ReactFlow shape", () => {
    const payload = {
      nodes: [
        createBaseNode({ id: "start_1", _type: "start", _uiconfig: { position: { x: 0, y: 0 }, portPolicy: [{ direction: "out" }] } }),
        createBaseNode({ id: "end_1", _type: "end", _uiconfig: { position: { x: 100, y: 100 }, portPolicy: [{ direction: "in" }] } }),
      ],
      edges: [createBaseEdge({ id: "edge_1", sourceNodeId: "start_1", targetNodeId: "end_1" })],
    };

    const flow = workflowPayloadToFlow(payload);

    expect(flow.nodes).toHaveLength(2);
    expect(flow.edges).toHaveLength(1);
    expect(flow.nodes[0]).toMatchObject({
      id: "start_1",
      type: "start",
      position: { x: 0, y: 0 },
    });
    expect(flow.nodes[0].data?.baseNode).toEqual(payload.nodes[0]);
    expect(flow.edges[0]).toMatchObject({
      id: "edge_1",
      source: "start_1",
      target: "end_1",
      type: WORKFLOW_EDGE_TYPES.condition,
    });
    expect(flow.edges[0].data?.baseEdge).toEqual(payload.edges[0]);
  });

  it("maps ReactFlow shape to workflow payload and filters invalid entries", () => {
    const validNode = createBaseNode({ id: "node_valid" });
    const validEdge = createBaseEdge({ id: "edge_valid", sourceNodeId: "node_valid", targetNodeId: "node_target" });
    const payload = flowToWorkflowPayload(
      [
        { id: "a", position: { x: 0, y: 0 }, data: { baseNode: validNode } },
        { id: "b", position: { x: 1, y: 1 }, data: {} },
      ],
      [
        { id: "e1", source: "a", target: "b", data: { baseEdge: validEdge } },
        { id: "e2", source: "a", target: "b", data: {} },
      ]
    );

    expect(payload.nodes).toEqual([validNode]);
    expect(payload.edges).toEqual([validEdge]);
  });

  it("returns empty arrays when given empty flow arrays", () => {
    const payload = flowToWorkflowPayload([], []);
    expect(payload).toEqual({ nodes: [], edges: [] });
  });

  it("preserves payload through round-trip conversion", () => {
    const initialPayload = {
      nodes: [
        createBaseNode({ id: "start_1", _type: "start", _uiconfig: { position: { x: 0, y: 0 }, portPolicy: [{ direction: "out" }] } }),
        createBaseNode({ id: "task_1", _type: "task", _uiconfig: { position: { x: 50, y: 50 }, portPolicy: [{ direction: "out" }] } }),
        createBaseNode({ id: "end_1", _type: "end", _uiconfig: { position: { x: 100, y: 100 }, portPolicy: [{ direction: "in" }] } }),
      ],
      edges: [
        createBaseEdge({ id: "edge_1", sourceNodeId: "start_1", targetNodeId: "task_1" }),
        createBaseEdge({ id: "edge_2", sourceNodeId: "task_1", targetNodeId: "end_1" }),
      ],
    };

    const flow = workflowPayloadToFlow(initialPayload);
    const roundTripPayload = flowToWorkflowPayload(flow.nodes, flow.edges);

    expect(roundTripPayload).toEqual(initialPayload);
  });
});
