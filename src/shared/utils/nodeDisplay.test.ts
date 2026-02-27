import { describe, expect, it } from "vitest";
import { getNodeDisplayName } from "@/shared/utils/nodeDisplay";
import type { BaseNode } from "@/domain/model/interface";

function createBaseNode(overrides: Partial<BaseNode> = {}): BaseNode {
  return {
    _type: "task",
    id: "task_1",
    _nodeConfigState: "VALID_CONFIGURATION",
    config: {
      name: "Task",
      description: "Task description",
      prompt: "",
    },
    _uiconfig: {
      position: { x: 0, y: 0 },
      portPolicy: [{ direction: "out" }],
    },
    ...overrides,
  };
}

describe("getNodeDisplayName", () => {
  it("returns nodeId when node is undefined", () => {
    expect(getNodeDisplayName(undefined, "node_123")).toBe("node_123");
  });

  it("returns config name when present", () => {
    const node = createBaseNode({ config: { name: "Greeting Node", description: "Desc", prompt: "" } });
    expect(getNodeDisplayName(node, "node_123")).toBe("Greeting Node");
  });

  it("returns nodeId when config name is empty", () => {
    const node = createBaseNode({ config: { name: "", description: "Desc", prompt: "" } });
    expect(getNodeDisplayName(node, "node_123")).toBe("node_123");
  });

  it("returns nodeId when config name is whitespace only", () => {
    const node = createBaseNode({ config: { name: "   ", description: "Desc", prompt: "" } });
    expect(getNodeDisplayName(node, "node_123")).toBe("node_123");
  });

  it("returns trimmed name when config name has surrounding spaces", () => {
    const node = createBaseNode({ config: { name: "  Approval Node  ", description: "Desc", prompt: "" } });
    expect(getNodeDisplayName(node, "node_123")).toBe("Approval Node");
  });
});
