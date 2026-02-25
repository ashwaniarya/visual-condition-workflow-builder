/**
 * Node and edge style tokens. Values reference CSS vars from theme.css.
 * Single source of truth for colors; theme tokens drive appearance.
 */
export const DEFAULT_BORDER = "2px solid var(--default-border-color)";
export const DEFAULT_BORDER_COLOR = "var(--default-border-color)";
export const INVALID_BORDER = "2px solid var(--invalid-border-color)";
export const INVALID_BORDER_COLOR = "var(--invalid-border-color)";

export const NODE_TYPE_BACKGROUNDS: Record<string, string> = {
  start: "var(--node-type-background-start)",
  end: "var(--node-type-background-end)",
  task: "var(--node-type-background-task)",
};

export const WORKFLOW_STATUS_DOT_COLORS: Record<string, string> = {
  EMPTY: "var(--workflow-status-dot-empty)",
  VALID: "var(--workflow-status-dot-valid)",
  BROKEN: "var(--workflow-status-dot-broken)",
};
