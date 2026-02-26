import { configureStore } from '@reduxjs/toolkit'
import canvasReducer from './canvasSlice'
import globalUiActionsReducer from './globalUiActionsSlice'
export const store = configureStore({
  reducer: {
    canvas: canvasReducer,
    globalUiActions: globalUiActionsReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
