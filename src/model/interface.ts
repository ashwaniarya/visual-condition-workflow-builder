import type { PortDirection } from "@/constants/portPolicy";
import type { NodeConfigState } from "@/constants/nodeConfigState";

export interface PortDefinition {
  direction: PortDirection;
}

export type PortPolicy = PortDefinition[];

export interface NodeUIConfig {
  position: { x: number; y: number };
  portPolicy: PortPolicy;
}

export interface NodeConfig extends Record<string, unknown> {
  name: string;
  description: string;
  prompt?: string;
}

export interface BaseNode {
  _type: string; // Node type - start, task, end, etc.  
  id: string; // Node ID
  _nodeConfigState: NodeConfigState; // Node configuration state - valid, invalid, etc.
  config: NodeConfig; // Node configuration
  _uiconfig: NodeUIConfig; // Node UI configuration
}

export interface BaseEdge {
  _type: string; // Edge type - default, conditional, etc.
  id: string;
  sourceNodeId: string; // Source node ID
  targetNodeId: string; // Target node ID
  config: Record<string, unknown>; // Edge configuration
  parameters: Record<string, unknown>; // Not used will be used in case we allow user to add more parameters
  condition: string; // Condition for the edge
}
