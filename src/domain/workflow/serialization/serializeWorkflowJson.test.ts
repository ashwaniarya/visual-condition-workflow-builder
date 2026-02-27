import { describe, expect, it } from "vitest";
import { parseWorkflowJson } from "@/domain/workflow/parser/parseWorkflowJson";
import { serializeWorkflowJson } from "@/domain/workflow/serialization/serializeWorkflowJson";

const emptyWorkflowPayload = {
  nodes: [],
  edges: [],
};

describe("serializeWorkflowJson", () => {
  it("serializes workflow payload with 2-space indentation", () => {
    const workflowPayload = {
      nodes: [
        {
          _type: "start",
          id: "start_1",
          _nodeConfigState: "VALID_CONFIGURATION" as const,
          config: { name: "Start", description: "Start node", prompt: "" },
          _uiconfig: { position: { x: 0, y: 0 }, portPolicy: [{ direction: "out" as const }] },
        },
      ],
      edges: [],
    };

    const serialized = serializeWorkflowJson(workflowPayload);
    expect(serialized).toContain('\n  "nodes": [');
    expect(serialized).toContain('\n    {');
  });

  it("returns parseable valid JSON", () => {
    const serialized = serializeWorkflowJson(emptyWorkflowPayload);
    const parsed = JSON.parse(serialized) as typeof emptyWorkflowPayload;

    expect(parsed).toEqual(emptyWorkflowPayload);
  });

  it("matches expected output for empty workflow", () => {
    const serialized = serializeWorkflowJson(emptyWorkflowPayload);
    expect(serialized).toBe('{\n  "nodes": [],\n  "edges": []\n}');
  });

  it("is stable across serialize parse serialize round-trip", () => {
    const payload = {
      nodes: [
        {
          _type: "start",
          id: "start_1",
          _nodeConfigState: "VALID_CONFIGURATION" as const,
          config: { name: "Start", description: "Start node", prompt: "" },
          _uiconfig: { position: { x: 12, y: 24 }, portPolicy: [{ direction: "out" as const }] },
        },
      ],
      edges: [],
    };

    const firstSerialized = serializeWorkflowJson(payload);
    const firstParsedResult = parseWorkflowJson(firstSerialized);

    expect(firstParsedResult.isValid).toBe(true);
    if (!firstParsedResult.isValid) {
      throw new Error("Expected valid parse result");
    }

    const secondSerialized = serializeWorkflowJson(firstParsedResult.workflowPayload);
    expect(secondSerialized).toBe(firstSerialized);
  });
});
