export const PORT_DIRECTIONS = ["in", "out", "both"] as const;
export type PortDirection = (typeof PORT_DIRECTIONS)[number];
