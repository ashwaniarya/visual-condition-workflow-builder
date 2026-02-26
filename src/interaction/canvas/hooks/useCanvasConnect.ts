import { useCallback, useEffect } from "react";
import { addEdge, type Connection, type Edge } from "reactflow";
import type { BaseEdge } from "@/domain/model/interface";
import {
  CANVAS_EVENT_TYPES,
  type CanvasEventPayloadMap,
} from "@/interaction/canvas/events/canvasEventTypes";
import {
  emitCanvasEvent,
  subscribeCanvasEvent,
} from "@/interaction/canvas/events/canvasEventBus";
import { WORKFLOW_EDGE_TYPES } from "@/shared/constants/workflowEdgeTypes";

type SetEdges = React.Dispatch<React.SetStateAction<Edge[]>>;

export function useCanvasConnect(setEdges: SetEdges) {
  useEffect(() => {
    const unsub = subscribeCanvasEvent(
      CANVAS_EVENT_TYPES.EDGE_CONNECTED,
      (
        payload: CanvasEventPayloadMap[typeof CANVAS_EVENT_TYPES.EDGE_CONNECTED]
      ) => {
        const { connection } = payload;
        setEdges((eds) => {
          const added = addEdge(connection, eds);
          if (added.length <= eds.length) return added;
          const newEdge = added[added.length - 1];
          const baseEdge: BaseEdge = {
            _type: WORKFLOW_EDGE_TYPES.condition,
            id: newEdge.id,
            sourceNodeId: connection.source!,
            targetNodeId: connection.target!,
            parameters: {},
            condition: "",
            config: {},
          };
          return added.map((e) =>
            e.id === newEdge.id
              ? { ...e, type: WORKFLOW_EDGE_TYPES.condition, data: { baseEdge } }
              : e
          );
        });
      }
    );
    return unsub;
  }, [setEdges]);

  const onConnect = useCallback((connection: Connection) => {
    emitCanvasEvent(CANVAS_EVENT_TYPES.EDGE_CONNECTED, { connection });
  }, []);

  return { onConnect };
}
