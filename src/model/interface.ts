import type { PortDirection } from "@/constants/portPolicy";
import type { NodeConfigState } from "@/constants/nodeConfigState";

export interface PortDefinition {
  direction: PortDirection;
}

export type PortPolicy = PortDefinition[];

export interface NodeUIConfig {
  width: number;
  height: number;
  position: { x: number; y: number };
  portPolicy: PortPolicy;
}

export interface NodeConfig extends Record<string, unknown> {
  name: string;
  description: string;
}

export interface BaseNode {
  _type: string;
  id: string;
  _nodeConfigState: NodeConfigState;
  config: NodeConfig;
  _uiconfig: NodeUIConfig;
}

export interface BaseEdge {
  _type: string;
  id: string;
  sourceNodeId: string;
  targetNodeId: string;
  config: Record<string, unknown>;
  parameters: Record<string, unknown>;
  condition: string;
}
