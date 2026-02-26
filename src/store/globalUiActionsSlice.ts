import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GlobalToastEvent, GlobalToastPayload, GlobalUiModalState } from "@/constants/globalUi";

export interface GlobalUiActionsState {
  activeModal: GlobalUiModalState | null;
  activeToastEvent: GlobalToastEvent | null;
}

const initialState: GlobalUiActionsState = {
  activeModal: null,
  activeToastEvent: null,
};

export const globalUiActionsSlice = createSlice({
  name: "globalUiActions",
  initialState,
  reducers: {
    openGlobalModal: (state, action: PayloadAction<GlobalUiModalState>) => {
      state.activeModal = action.payload;
    },
    closeGlobalModal: (state) => {
      state.activeModal = null;
    },
    showGlobalToast: {
      reducer: (state, action: PayloadAction<GlobalToastEvent>) => {
        state.activeToastEvent = action.payload;
      },
      prepare: (payload: GlobalToastPayload) => ({
        payload: {
          eventId: crypto.randomUUID(),
          ...payload,
        },
      }),
    },
    clearGlobalToastEvent: (state) => {
      state.activeToastEvent = null;
    },
  },
});

export const { openGlobalModal, closeGlobalModal, showGlobalToast, clearGlobalToastEvent } =
  globalUiActionsSlice.actions;
export default globalUiActionsSlice.reducer;
