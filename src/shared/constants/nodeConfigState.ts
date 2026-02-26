export const NODE_CONFIG_STATES = ["VALID_CONFIGURATION", "INVALID_CONFIGURATION"] as const;
export type NodeConfigState = (typeof NODE_CONFIG_STATES)[number];
