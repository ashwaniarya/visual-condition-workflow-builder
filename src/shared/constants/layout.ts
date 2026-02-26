/**
 * Centralized layout and UI constants
 */
export const LAYOUT = {
  configurationPanelWidth: 280,
} as const

/**
 * Split layout constants
 */
export const SPLIT_LAYOUT = {
  gutterSize: 8,
  minSizes: {
    configurationPanel: 280,
    center: 400,
    canvas: 300,
    workflowViewer: 100,
  },
  snapOffset: 30,
  initialSizes: {
    horizontal: [80, 20], // Canvas, Config
    vertical: [70, 30], // Canvas, Viewer
  },
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
 * Canvas viewport/zoom constants
 */
export const CANVAS_VIEWPORT = {
  minZoom: 0.1,
  maxZoom: 2,
  fitViewPadding: 0.2,
  defaultZoom: 0.8, // Initial zoom level
} as const

/**
 * Deferred (idle-time) dynamic import settings
 */
export const DEFERRED_IMPORT = {
  idleTimeoutMs: 3000,
  fallbackDelayMs: 2000,
} as const

/**
 * WorkflowViewer constants (JSON display, syntax highlighting)
 */
export const WORKFLOW_VIEWER = {
  jsonIndentSpaces: 2,
  jsonUpdateDebounceMs: 500,
  height: 100, // Minimal height, actual height controlled by Split
} as const
