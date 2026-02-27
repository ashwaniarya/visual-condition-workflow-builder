/**
 * Drag-and-drop data type for palette-to-canvas node transfer
 */
export const DRAG_DATA_TYPE = "application/x-workflow-node-type" as const;

/**
 * Drag offset data type — cursor offset from element top-left at grab point.
 * Used so the drop position keeps the grab point under the cursor.
 */
export const DRAG_OFFSET_DATA_TYPE =
  "application/x-workflow-drag-offset" as const;

export interface DragOffsetPayload {
  offsetX: number;
  offsetY: number;
}
