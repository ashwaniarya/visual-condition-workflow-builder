import { createSlice } from '@reduxjs/toolkit'
import type { WorkflowState } from '@/shared/constants/workflowState'
import { WORKFLOW_STATE_MESSAGES } from '@/shared/constants/workflowState'

export type SelectionType = 'node' | 'edge'

export interface Selection {
  selectionType: SelectionType
  selectionId: string
}

export interface CanvasState {
  workflowState: WorkflowState
  workflowStateMessage: string
  selected: Selection | null
}

const initialState: CanvasState = {
  workflowState: 'EMPTY',
  workflowStateMessage: WORKFLOW_STATE_MESSAGES.EMPTY,
  selected: null,
}

export const canvasSlice = createSlice({
  name: 'canvas',
  initialState,
  reducers: {
    setSelection: (state, action: { payload: Selection | null }) => {
      state.selected = action.payload
    },
    setWorkflowValidation: (
      state,
      action: { payload: { workflowState: WorkflowState; workflowStateMessage: string } }
    ) => {
      state.workflowState = action.payload.workflowState
      state.workflowStateMessage = action.payload.workflowStateMessage
    },
  },
})

export const { setSelection, setWorkflowValidation } = canvasSlice.actions
export default canvasSlice.reducer
