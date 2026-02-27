import { afterEach, describe, expect, it, vi } from "vitest";
import globalUiActionsReducer, {
  clearGlobalToastEvent,
  closeGlobalModal,
  openGlobalModal,
  showGlobalToast,
} from "@/state/store/globalUiActionsSlice";

describe("globalUiActionsSlice", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("opens and closes global modal", () => {
    const openState = globalUiActionsReducer(
      undefined,
      openGlobalModal({
        modalType: "simpleMessage",
        payload: {
          title: "Title",
          message: "Body",
          actionLabel: "Confirm",
        },
      })
    );
    expect(openState.activeModal).toEqual({
      modalType: "simpleMessage",
      payload: {
        title: "Title",
        message: "Body",
        actionLabel: "Confirm",
      },
    });

    const closedState = globalUiActionsReducer(openState, closeGlobalModal());
    expect(closedState.activeModal).toBeNull();
  });

  it("keeps only the latest modal when opened repeatedly", () => {
    const firstOpenState = globalUiActionsReducer(
      undefined,
      openGlobalModal({
        modalType: "workflowImport",
        payload: { initialJsonText: "{}" },
      })
    );

    const secondOpenState = globalUiActionsReducer(
      firstOpenState,
      openGlobalModal({
        modalType: "clearWorkspaceConfirm",
        payload: {},
      })
    );

    expect(secondOpenState.activeModal).toEqual({
      modalType: "clearWorkspaceConfirm",
      payload: {},
    });
  });

  it("attaches deterministic eventId using showGlobalToast prepare", () => {
    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("uuid-123");

    const nextState = globalUiActionsReducer(
      undefined,
      showGlobalToast({
        variant: "success",
        title: "Saved",
        description: "Workflow exported",
        durationMs: 2000,
      })
    );

    expect(nextState.activeToastEvent).toEqual({
      eventId: "uuid-123",
      variant: "success",
      title: "Saved",
      description: "Workflow exported",
      durationMs: 2000,
    });
  });

  it("clears active toast event", () => {
    vi.spyOn(globalThis.crypto, "randomUUID").mockReturnValue("uuid-456");
    const withToast = globalUiActionsReducer(
      undefined,
      showGlobalToast({
        variant: "error",
        title: "Failed",
      })
    );
    expect(withToast.activeToastEvent?.eventId).toBe("uuid-456");

    const cleared = globalUiActionsReducer(withToast, clearGlobalToastEvent());
    expect(cleared.activeToastEvent).toBeNull();
  });
});
