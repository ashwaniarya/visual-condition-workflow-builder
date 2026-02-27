import { useCallback, useEffect } from "react";
import { type Node as ReactFlowNode } from "reactflow";
import type { BaseNode } from "@/domain/model/interface";
import { nodeRegistry } from "@/domain/registry/nodeRegistry";
import { syncBaseNodePositionsForDroppedNodes } from "@/shared/utils/nodePositionSync";
import {
  CANVAS_EVENT_TYPES,
  type CanvasEventPayloadMap,
} from "@/interaction/canvas/events/canvasEventTypes";
import {
  emitCanvasEvent,
  subscribeCanvasEvent,
} from "@/interaction/canvas/events/canvasEventBus";
import {
  DRAG_DATA_TYPE,
  DRAG_OFFSET_DATA_TYPE,
  type DragOffsetPayload,
} from "@/shared/constants/dragConfig";

function baseNodeToFlowNode(baseNode: BaseNode): ReactFlowNode {
  return {
    id: baseNode.id,
    type: baseNode._type,
    position: baseNode._uiconfig.position,
    data: { baseNode },
  };
}

type SetNodes = React.Dispatch<React.SetStateAction<ReactFlowNode[]>>;

export function useCanvasDrag(
  setNodes: SetNodes,
  screenToFlowPosition: (position: {
    x: number;
    y: number;
  }) => { x: number; y: number }
) {
  useEffect(() => {
    const unsubAdd = subscribeCanvasEvent(
      CANVAS_EVENT_TYPES.NODE_ADDED,
      (payload: CanvasEventPayloadMap[typeof CANVAS_EVENT_TYPES.NODE_ADDED]) => {
        const { nodeType, position } = payload;
        const template = nodeRegistry[nodeType as keyof typeof nodeRegistry];
        if (!template) return;
        const uniqueId = `${nodeType}-${Date.now()}`;
        const newNode: BaseNode = {
          ...template,
          id: uniqueId,
          _uiconfig: { ...template._uiconfig, position },
        };
        setNodes((nds) => nds.concat(baseNodeToFlowNode(newNode)));
      }
    );
    const unsubPos = subscribeCanvasEvent(
      CANVAS_EVENT_TYPES.NODE_POSITIONED,
      (
        payload: CanvasEventPayloadMap[typeof CANVAS_EVENT_TYPES.NODE_POSITIONED]
      ) => {
        const { droppedNodes } = payload;
        if (droppedNodes.length === 0) return;
        setNodes((currentNodes) =>
          syncBaseNodePositionsForDroppedNodes(currentNodes, droppedNodes)
        );
      }
    );
    return () => {
      unsubAdd();
      unsubPos();
    };
  }, [setNodes]);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();
      const nodeType = event.dataTransfer.getData(DRAG_DATA_TYPE);
      if (!nodeType) return;
      const template = nodeRegistry[nodeType as keyof typeof nodeRegistry];
      if (!template) return;

      let dropScreenX = event.clientX;
      let dropScreenY = event.clientY;
      const offsetData = event.dataTransfer.getData(DRAG_OFFSET_DATA_TYPE);
      if (offsetData) {
        try {
          const { offsetX, offsetY } = JSON.parse(offsetData) as DragOffsetPayload;
          dropScreenX -= offsetX;
          dropScreenY -= offsetY;
        } catch {
          /* fallback: use cursor position as-is */
        }
      }

      const position = screenToFlowPosition({
        x: dropScreenX,
        y: dropScreenY,
      });
      emitCanvasEvent(CANVAS_EVENT_TYPES.NODE_ADDED, { nodeType, position });
    },
    [screenToFlowPosition]
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "copy";
  }, []);

  const onNodeDragStop = useCallback(
    (_: React.MouseEvent, droppedNode: ReactFlowNode) => {
      emitCanvasEvent(CANVAS_EVENT_TYPES.NODE_POSITIONED, {
        droppedNodes: [droppedNode],
      });
    },
    []
  );

  const onSelectionDragStop = useCallback(
    (_: React.MouseEvent, droppedNodes: ReactFlowNode[]) => {
      if (droppedNodes.length === 0) return;
      emitCanvasEvent(CANVAS_EVENT_TYPES.NODE_POSITIONED, { droppedNodes });
    },
    []
  );

  return {
    onDrop,
    onDragOver,
    onNodeDragStop,
    onSelectionDragStop,
  };
}
