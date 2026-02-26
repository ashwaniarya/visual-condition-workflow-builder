/**
 * Node and edge style tokens. Values reference CSS vars from theme.css.
 * Single source of truth for colors; theme tokens drive appearance.
 */

// Modern thin borders
export const DEFAULT_BORDER = "1px solid var(--border)";
export const DEFAULT_BORDER_COLOR = "var(--border)";

// Slightly thicker for invalid state to draw attention, but still refined
export const INVALID_BORDER = "1px solid var(--destructive)";
export const INVALID_BORDER_COLOR = "var(--destructive)";

// Edge invalid styles (centralized tokens)
export const EDGE_INVALID_STROKE_COLOR = "var(--destructive)";
export const EDGE_INVALID_STROKE_WIDTH = 2;
export const EDGE_INVALID_LABEL_BORDER_COLOR = "var(--destructive)";
export const EDGE_INVALID_LABEL_BACKGROUND_COLOR = "var(--color-rose-50)";
export const EDGE_INVALID_LABEL_TEXT_COLOR = "var(--destructive)";

// Node Dimensions & Spacing
export const NODE_BORDER_RADIUS = "0.5rem"; // rounded-lg
export const NODE_WIDTH_MIN = "160px";
export const NODE_WIDTH_MAX = "280px";

// Selection & Feedback States
export const SELECTED_NODE_BORDER_COLOR = "var(--ring)"; // Using ring color for selection
export const SELECTED_NODE_BORDER_WIDTH = "2px"; // Keep same as default to avoid layout shift
export const SELECTED_NODE_SHADOW =
  "0 0 0 1px rgb(139 92 246 / 0.45), 0 0 24px rgb(139 92 246 / 0.35), 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 10px 10px -5px rgb(0 0 0 / 0.04)"; // Purple glow + elevated lift
export const DRAGGING_PALETTE_NODE_SHADOW =
  "0 10px 15px -3px rgb(0 0 0 / 0.12), 0 4px 6px -4px rgb(0 0 0 / 0.08)"; // Hover lift while dragging from palette
export const SELECTED_EDGE_STROKE_WIDTH = 3;
export const SELECTED_EDGE_GLOW_FILTER =
  "drop-shadow(0 0 8px rgb(139 92 246 / 0.75)) drop-shadow(0 0 18px rgb(250 204 21 / 0.45))";

// Semantic Backgrounds (Lighter/Subtle for modern feel)
export const NODE_TYPE_BACKGROUNDS: Record<string, string> = {
  start: "var(--color-emerald-50)",
  end: "var(--color-rose-50)",
  task: "var(--color-blue-50)",
};

// Semantic Borders/Accents
export const NODE_TYPE_ACCENTS: Record<string, string> = {
  start: "var(--color-emerald-500)",
  end: "var(--color-rose-500)",
  task: "var(--color-blue-500)",
};

// Semantic Icons Colors
export const NODE_ICON_COLORS: Record<string, string> = {
  start: "var(--color-emerald-600)",
  end: "var(--color-rose-600)",
  task: "var(--color-blue-600)",
};

export const WORKFLOW_STATUS_DOT_COLORS: Record<string, string> = {
  EMPTY: "var(--muted-foreground)",
  VALID: "var(--color-emerald-500)",
  BROKEN: "var(--destructive)",
};
