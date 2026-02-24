/**
 * Centralized layout and UI constants
 */
export const LAYOUT = {
  nodePaletteWidth: 200,
  configurationPanelWidth: 280,
} as const

/**
 * Canvas grid constants (background dots/lines)
 */
export const CANVAS_GRID = {
  gap: 20,
  size: 1,
  color: "#94a3b8",
} as const

/**
 * WorkflowViewer constants (JSON display, syntax highlighting)
 */
export const WORKFLOW_VIEWER = {
  jsonIndentSpaces: 2,
  height: 100,
} as const
