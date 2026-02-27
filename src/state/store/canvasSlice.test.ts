import { describe, expect, it } from "vitest";
import canvasReducer, { setSelection, setWorkflowValidation } from "@/state/store/canvasSlice";

describe("canvasSlice", () => {
  it("returns initial state", () => {
    const state = canvasReducer(undefined, { type: "unknown" });

    expect(state.workflowState).toBe("EMPTY");
    expect(state.workflowStateMessage).toBe("No nodes on canvas");
    expect(state.selected).toBeNull();
  });

  it("sets node selection and clears selection", () => {
    const withNodeSelection = canvasReducer(
      undefined,
      setSelection({ selectionType: "node", selectionId: "node_1" })
    );
    expect(withNodeSelection.selected).toEqual({
      selectionType: "node",
      selectionId: "node_1",
    });

    const withClearedSelection = canvasReducer(withNodeSelection, setSelection(null));
    expect(withClearedSelection.selected).toBeNull();
  });

  it("sets edge selection", () => {
    const state = canvasReducer(
      undefined,
      setSelection({ selectionType: "edge", selectionId: "edge_1" })
    );

    expect(state.selected).toEqual({
      selectionType: "edge",
      selectionId: "edge_1",
    });
  });

  it("updates workflow validation state and message", () => {
    const validState = canvasReducer(
      undefined,
      setWorkflowValidation({
        workflowState: "VALID",
        workflowStateMessage: "Workflow is valid.",
      })
    );
    expect(validState.workflowState).toBe("VALID");
    expect(validState.workflowStateMessage).toBe("Workflow is valid.");

    const brokenState = canvasReducer(
      validState,
      setWorkflowValidation({
        workflowState: "BROKEN",
        workflowStateMessage: "Found 1 broken task node(s).",
      })
    );
    expect(brokenState.workflowState).toBe("BROKEN");
    expect(brokenState.workflowStateMessage).toBe("Found 1 broken task node(s).");
  });

  it("does not mutate original state object", () => {
    const initialState = canvasReducer(undefined, { type: "unknown" });
    const previousStateSnapshot = { ...initialState };

    const nextState = canvasReducer(
      initialState,
      setSelection({ selectionType: "node", selectionId: "node_2" })
    );

    expect(nextState).not.toBe(initialState);
    expect(initialState).toEqual(previousStateSnapshot);
  });
});
