import { useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { Node as ReactFlowNode, Edge } from "reactflow";
import { setSelection } from "@/state/store/canvasSlice";
import type { RootState } from "@/state/store";
import {
  CANVAS_EVENT_TYPES,
  type CanvasEventPayloadMap,
} from "@/interaction/canvas/events/canvasEventTypes";
import {
  emitCanvasEvent,
  subscribeCanvasEvent,
} from "@/interaction/canvas/events/canvasEventBus";

export function useCanvasSelection() {
  const dispatch = useDispatch();
  const selected = useSelector((state: RootState) => state.canvas.selected);
  const selectedRef = useRef(selected);
  selectedRef.current = selected;

  useEffect(() => {
    const unsubNodes = subscribeCanvasEvent(
      CANVAS_EVENT_TYPES.NODES_DELETED,
      (
        payload: CanvasEventPayloadMap[typeof CANVAS_EVENT_TYPES.NODES_DELETED]
      ) => {
        const { nodeIds } = payload;
        const currentSelected = selectedRef.current;
        if (
          currentSelected?.selectionType === "node" &&
          nodeIds.includes(currentSelected.selectionId)
        ) {
          dispatch(setSelection(null));
        }
      }
    );
    const unsubEdges = subscribeCanvasEvent(
      CANVAS_EVENT_TYPES.EDGES_DELETED,
      (
        payload: CanvasEventPayloadMap[typeof CANVAS_EVENT_TYPES.EDGES_DELETED]
      ) => {
        const { edgeIds } = payload;
        const currentSelected = selectedRef.current;
        if (
          currentSelected?.selectionType === "edge" &&
          edgeIds.includes(currentSelected.selectionId)
        ) {
          dispatch(setSelection(null));
        }
      }
    );
    const unsubNode = subscribeCanvasEvent(
      CANVAS_EVENT_TYPES.NODE_CLICKED,
      (
        payload: CanvasEventPayloadMap[typeof CANVAS_EVENT_TYPES.NODE_CLICKED]
      ) => {
        dispatch(setSelection({ selectionType: "node", selectionId: payload.nodeId }));
      }
    );
    const unsubEdge = subscribeCanvasEvent(
      CANVAS_EVENT_TYPES.EDGE_CLICKED,
      (
        payload: CanvasEventPayloadMap[typeof CANVAS_EVENT_TYPES.EDGE_CLICKED]
      ) => {
        dispatch(setSelection({ selectionType: "edge", selectionId: payload.edgeId }));
      }
    );
    const unsubPane = subscribeCanvasEvent(
      CANVAS_EVENT_TYPES.PANE_CLICKED,
      () => {
        dispatch(setSelection(null));
      }
    );
    return () => {
      unsubNodes();
      unsubEdges();
      unsubNode();
      unsubEdge();
      unsubPane();
    };
  }, [dispatch]);

  const onNodeClick = useCallback(
    (_: React.MouseEvent, node: ReactFlowNode) => {
      emitCanvasEvent(CANVAS_EVENT_TYPES.NODE_CLICKED, { nodeId: node.id });
    },
    []
  );

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => {
      emitCanvasEvent(CANVAS_EVENT_TYPES.EDGE_CLICKED, { edgeId: edge.id });
    },
    []
  );

  const onPaneClick = useCallback(() => {
    emitCanvasEvent(CANVAS_EVENT_TYPES.PANE_CLICKED, undefined);
  }, []);

  const onNodesDelete = useCallback(
    (deletedNodes: ReactFlowNode[]) => {
      const nodeIds = deletedNodes.map((n) => n.id);
      emitCanvasEvent(CANVAS_EVENT_TYPES.NODES_DELETED, { nodeIds });
    },
    []
  );

  const onEdgesDelete = useCallback(
    (deletedEdges: Edge[]) => {
      const edgeIds = deletedEdges.map((e) => e.id);
      emitCanvasEvent(CANVAS_EVENT_TYPES.EDGES_DELETED, { edgeIds });
    },
    []
  );

  return {
    onNodeClick,
    onEdgeClick,
    onPaneClick,
    onNodesDelete,
    onEdgesDelete,
  };
}
