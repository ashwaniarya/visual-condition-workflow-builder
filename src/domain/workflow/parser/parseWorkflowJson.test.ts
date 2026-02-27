import { describe, it, expect } from "vitest";
import { parseWorkflowJson } from "./parseWorkflowJson";

function createMinimalValidNode(overrides: { id?: string; direction?: "in" | "out" } = {}) {
  return {
    _type: "start",
    id: overrides.id ?? "start_1",
    _nodeConfigState: "VALID_CONFIGURATION" as const,
    config: { name: "Start", description: "Start node", prompt: "" },
    _uiconfig: {
      position: { x: 0, y: 0 },
      portPolicy: [{ direction: overrides.direction ?? "out" }],
    },
  };
}

function createMinimalValidEdge(overrides: {
  id?: string;
  sourceNodeId?: string;
  targetNodeId?: string;
} = {}) {
  return {
    _type: "conditionedge",
    id: overrides.id ?? "edge_1",
    sourceNodeId: overrides.sourceNodeId ?? "start_1",
    targetNodeId: overrides.targetNodeId ?? "end_1",
    config: {},
    parameters: {},
    condition: "Pass Through",
  };
}

function createMinimalValidWorkflow() {
  return {
    nodes: [
      createMinimalValidNode({ id: "start_1", direction: "out" }),
      {
        ...createMinimalValidNode({ id: "end_1", direction: "in" }),
        _type: "end" as const,
      },
    ],
    edges: [createMinimalValidEdge()],
  };
}

describe("parseWorkflowJson", () => {
  describe("bad JSON object", () => {
    it("returns invalid when input is empty string", () => {
      const result = parseWorkflowJson("");
      expect(result.isValid).toBe(false);
      if (!result.isValid) {
        expect(result.errorMessages).toHaveLength(1);
        expect(result.errorMessages[0]).toMatch(/^json:/);
      }
    });

    it("returns invalid when input has invalid syntax", () => {
      const result = parseWorkflowJson("{ invalid");
      expect(result.isValid).toBe(false);
      if (!result.isValid) {
        expect(result.errorMessages).toHaveLength(1);
        expect(result.errorMessages[0]).toMatch(/^json:/);
      }
    });

    it("returns invalid when input has trailing comma", () => {
      const result = parseWorkflowJson('{"nodes":[],}');
      expect(result.isValid).toBe(false);
      if (!result.isValid) {
        expect(result.errorMessages).toHaveLength(1);
        expect(result.errorMessages[0]).toMatch(/^json:/);
      }
    });

    it("returns invalid when input is unclosed string", () => {
      const result = parseWorkflowJson('{"nodes":"');
      expect(result.isValid).toBe(false);
      if (!result.isValid) {
        expect(result.errorMessages).toHaveLength(1);
        expect(result.errorMessages[0]).toMatch(/^json:/);
      }
    });
  });

  describe("bad schema (Zod validation)", () => {
    it("returns invalid when nodes is missing", () => {
      const result = parseWorkflowJson('{"edges":[]}');
      expect(result.isValid).toBe(false);
      if (!result.isValid) {
        expect(result.errorMessages.length).toBeGreaterThan(0);
        expect(result.errorMessages.some((message) => message.includes("nodes"))).toBe(true);
      }
    });

    it("returns invalid when edges is missing", () => {
      const result = parseWorkflowJson('{"nodes":[]}');
      expect(result.isValid).toBe(false);
      if (!result.isValid) {
        expect(result.errorMessages.length).toBeGreaterThan(0);
        expect(result.errorMessages.some((message) => message.includes("edges"))).toBe(true);
      }
    });

    it("returns invalid when nodes is not an array", () => {
      const result = parseWorkflowJson('{"nodes":{},"edges":[]}');
      expect(result.isValid).toBe(false);
      if (!result.isValid) {
        expect(result.errorMessages.length).toBeGreaterThan(0);
      }
    });

    it("returns invalid when node is missing id", () => {
      const invalidNode = {
        _type: "start",
        _nodeConfigState: "VALID_CONFIGURATION",
        config: { name: "Start", description: "Start node", prompt: "" },
        _uiconfig: {
          position: { x: 0, y: 0 },
          portPolicy: [{ direction: "out" }],
        },
      };
      const result = parseWorkflowJson(
        JSON.stringify({ nodes: [invalidNode], edges: [] })
      );
      expect(result.isValid).toBe(false);
      if (!result.isValid) {
        expect(result.errorMessages.length).toBeGreaterThan(0);
      }
    });

    it("returns invalid when node has invalid _nodeConfigState", () => {
      const workflow = createMinimalValidWorkflow();
      (workflow.nodes[0] as Record<string, unknown>)._nodeConfigState = "UNKNOWN";
      const result = parseWorkflowJson(JSON.stringify(workflow));
      expect(result.isValid).toBe(false);
      if (!result.isValid) {
        expect(result.errorMessages.length).toBeGreaterThan(0);
      }
    });

    it("returns invalid when node has invalid portPolicy direction", () => {
      const workflow = createMinimalValidWorkflow();
      (workflow.nodes[0] as Record<string, unknown>)._uiconfig = {
        position: { x: 0, y: 0 },
        portPolicy: [{ direction: "invalid" }],
      };
      const result = parseWorkflowJson(JSON.stringify(workflow));
      expect(result.isValid).toBe(false);
      if (!result.isValid) {
        expect(result.errorMessages.length).toBeGreaterThan(0);
      }
    });

    it("returns invalid when edge is missing sourceNodeId", () => {
      const workflow = createMinimalValidWorkflow();
      const invalidEdge = {
        _type: "conditionedge",
        id: "edge_1",
        targetNodeId: "end_1",
        config: {},
        parameters: {},
        condition: "Pass Through",
      };
      const result = parseWorkflowJson(
        JSON.stringify({ nodes: workflow.nodes, edges: [invalidEdge] })
      );
      expect(result.isValid).toBe(false);
      if (!result.isValid) {
        expect(result.errorMessages.length).toBeGreaterThan(0);
      }
    });

    it("returns invalid when root is not an object (number)", () => {
      const result = parseWorkflowJson("123");
      expect(result.isValid).toBe(false);
      if (!result.isValid) {
        expect(result.errorMessages.length).toBeGreaterThan(0);
      }
    });

    it("returns invalid when root is array", () => {
      const result = parseWorkflowJson("[]");
      expect(result.isValid).toBe(false);
      if (!result.isValid) {
        expect(result.errorMessages.length).toBeGreaterThan(0);
      }
    });

    it("returns invalid when root is null", () => {
      const result = parseWorkflowJson("null");
      expect(result.isValid).toBe(false);
      if (!result.isValid) {
        expect(result.errorMessages.length).toBeGreaterThan(0);
      }
    });
  });

  describe("relation validation (post-schema)", () => {
    it("returns invalid when duplicate node ids exist", () => {
      const workflow = createMinimalValidWorkflow();
      workflow.nodes[1] = { ...workflow.nodes[0], id: "start_1" };
      const result = parseWorkflowJson(JSON.stringify(workflow));
      expect(result.isValid).toBe(false);
      if (!result.isValid) {
        expect(result.errorMessages).toContain("nodes: duplicate node ids detected.");
      }
    });

    it("returns invalid when duplicate edge ids exist", () => {
      const workflow = createMinimalValidWorkflow();
      workflow.edges.push(
        createMinimalValidEdge({ id: "edge_1", sourceNodeId: "end_1", targetNodeId: "start_1" })
      );
      const result = parseWorkflowJson(JSON.stringify(workflow));
      expect(result.isValid).toBe(false);
      if (!result.isValid) {
        expect(result.errorMessages).toContain("edges: duplicate edge ids detected.");
      }
    });

    it("returns invalid when edge sourceNodeId does not match any node", () => {
      const workflow = createMinimalValidWorkflow();
      workflow.edges[0] = createMinimalValidEdge({
        sourceNodeId: "nonexistent_node",
        targetNodeId: "end_1",
      });
      const result = parseWorkflowJson(JSON.stringify(workflow));
      expect(result.isValid).toBe(false);
      if (!result.isValid) {
        expect(result.errorMessages.some((message) =>
          message.includes("sourceNodeId") && message.includes("nonexistent_node")
        )).toBe(true);
      }
    });

    it("returns invalid when edge targetNodeId does not match any node", () => {
      const workflow = createMinimalValidWorkflow();
      workflow.edges[0] = createMinimalValidEdge({
        sourceNodeId: "start_1",
        targetNodeId: "nonexistent_node",
      });
      const result = parseWorkflowJson(JSON.stringify(workflow));
      expect(result.isValid).toBe(false);
      if (!result.isValid) {
        expect(result.errorMessages.some((message) =>
          message.includes("targetNodeId") && message.includes("nonexistent_node")
        )).toBe(true);
      }
    });

    it("returns all relation errors when multiple exist", () => {
      const workflow = createMinimalValidWorkflow();
      workflow.nodes[1] = { ...workflow.nodes[0], id: "start_1" };
      workflow.edges[0] = createMinimalValidEdge({
        sourceNodeId: "orphan_source",
        targetNodeId: "orphan_target",
      });
      const result = parseWorkflowJson(JSON.stringify(workflow));
      expect(result.isValid).toBe(false);
      if (!result.isValid) {
        expect(result.errorMessages).toContain("nodes: duplicate node ids detected.");
        expect(result.errorMessages.some((message) =>
          message.includes("sourceNodeId") && message.includes("orphan_source")
        )).toBe(true);
        expect(result.errorMessages.some((message) =>
          message.includes("targetNodeId") && message.includes("orphan_target")
        )).toBe(true);
      }
    });
  });

  describe("success scenarios", () => {
    it("returns valid workflow for minimal valid payload", () => {
      const workflow = createMinimalValidWorkflow();
      const result = parseWorkflowJson(JSON.stringify(workflow));
      expect(result.isValid).toBe(true);
      if (result.isValid) {
        expect(result.workflowPayload.nodes).toHaveLength(2);
        expect(result.workflowPayload.edges).toHaveLength(1);
      }
    });

    it("returns valid workflow for empty nodes and edges", () => {
      const result = parseWorkflowJson('{"nodes":[],"edges":[]}');
      expect(result.isValid).toBe(true);
      if (result.isValid) {
        expect(result.workflowPayload.nodes).toHaveLength(0);
        expect(result.workflowPayload.edges).toHaveLength(0);
      }
    });

    it("returns valid workflow for real example JSON", () => {
      const workflowJsonText = `{"nodes":[{"_type":"start","id":"start_1","_nodeConfigState":"VALID_CONFIGURATION","config":{"name":"Start","description":"Start node","prompt":""},"_uiconfig":{"position":{"x":-105,"y":8.75},"portPolicy":[{"direction":"out"}]}},{"_type":"task","id":"task_1","_nodeConfigState":"VALID_CONFIGURATION","config":{"name":"Greeting","description":"Welcome message","prompt":""},"_uiconfig":{"position":{"x":181,"y":64},"portPolicy":[{"direction":"out"}]}},{"_type":"end","id":"end_1","_nodeConfigState":"VALID_CONFIGURATION","config":{"name":"End","description":"End node","prompt":""},"_uiconfig":{"position":{"x":400,"y":0},"portPolicy":[{"direction":"in"}]}}],"edges":[{"_type":"conditionedge","id":"edge_1","sourceNodeId":"start_1","targetNodeId":"task_1","config":{},"parameters":{},"condition":"Pass Through"},{"_type":"conditionedge","id":"edge_2","sourceNodeId":"task_1","targetNodeId":"end_1","config":{},"parameters":{},"condition":"Pass Through"}]}`;
      const result = parseWorkflowJson(workflowJsonText);
      expect(result.isValid).toBe(true);
      if (result.isValid) {
        expect(result.workflowPayload.nodes.length).toBeGreaterThan(0);
        expect(result.workflowPayload.edges.length).toBeGreaterThan(0);
      }
    });

    it("returns valid workflow for multiple nodes and edges", () => {
      const workflow = {
        nodes: [
          createMinimalValidNode({ id: "start_1" }),
          createMinimalValidNode({ id: "task_1" }),
          { ...createMinimalValidNode({ id: "end_1", direction: "in" }), _type: "end" as const },
        ],
        edges: [
          createMinimalValidEdge({ id: "e1", sourceNodeId: "start_1", targetNodeId: "task_1" }),
          createMinimalValidEdge({ id: "e2", sourceNodeId: "task_1", targetNodeId: "end_1" }),
        ],
      };
      (workflow.nodes[1] as Record<string, unknown>)._type = "task";
      const result = parseWorkflowJson(JSON.stringify(workflow));
      expect(result.isValid).toBe(true);
      if (result.isValid) {
        expect(result.workflowPayload.nodes).toHaveLength(3);
        expect(result.workflowPayload.edges).toHaveLength(2);
      }
    });
  });
});
