import type { Connection } from "reactflow";
import type { Node as ReactFlowNode } from "reactflow";

export const CANVAS_EVENT_TYPES = {
  NODE_ADDED: "NODE_ADDED",
  NODE_POSITIONED: "NODE_POSITIONED",
  NODES_DELETED: "NODES_DELETED",
  EDGES_DELETED: "EDGES_DELETED",
  NODE_CLICKED: "NODE_CLICKED",
  EDGE_CLICKED: "EDGE_CLICKED",
  PANE_CLICKED: "PANE_CLICKED",
  EDGE_CONNECTED: "EDGE_CONNECTED",
} as const;

export type CanvasEventType =
  (typeof CANVAS_EVENT_TYPES)[keyof typeof CANVAS_EVENT_TYPES];

export interface CanvasEventPayloadMap {
  [CANVAS_EVENT_TYPES.NODE_ADDED]: {
    nodeType: string;
    position: { x: number; y: number };
  };
  [CANVAS_EVENT_TYPES.NODE_POSITIONED]: { droppedNodes: ReactFlowNode[] };
  [CANVAS_EVENT_TYPES.NODES_DELETED]: { nodeIds: string[] };
  [CANVAS_EVENT_TYPES.EDGES_DELETED]: { edgeIds: string[] };
  [CANVAS_EVENT_TYPES.NODE_CLICKED]: { nodeId: string };
  [CANVAS_EVENT_TYPES.EDGE_CLICKED]: { edgeId: string };
  [CANVAS_EVENT_TYPES.PANE_CLICKED]: undefined;
  [CANVAS_EVENT_TYPES.EDGE_CONNECTED]: { connection: Connection };
}
