import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { useReactFlow } from "reactflow";
import { setSelection } from "@/state/store/canvasSlice";
import { VALIDATION_ISSUES_VIEWER } from "@/shared/constants/validationIssues";
import type { ValidationIssue } from "@/domain/model/validationIssue";

function getNodeCenterPosition(
  node:
    | {
        position: { x: number; y: number };
        positionAbsolute?: { x: number; y: number };
        width?: number | null;
        height?: number | null;
      }
    | undefined
) {
  if (!node) {
    return null;
  }

  const nodePosition = node.positionAbsolute ?? node.position;
  const nodeWidth = node.width ?? 0;
  const nodeHeight = node.height ?? 0;

  return {
    x: nodePosition.x + nodeWidth / 2,
    y: nodePosition.y + nodeHeight / 2,
  };
}

export function useCanvasFocusSelection() {
  const dispatch = useDispatch();
  const { getViewport, setCenter, getNode, getEdge } = useReactFlow();

  const focusNodeById = useCallback(
    (nodeId: string) => {
      const selectedNode = getNode(nodeId);
      const centerPosition = getNodeCenterPosition(selectedNode);
      if (!centerPosition) {
        return;
      }

      const currentViewport = getViewport();
      setCenter(centerPosition.x, centerPosition.y, {
        zoom: currentViewport.zoom,
        duration: VALIDATION_ISSUES_VIEWER.focusAnimationDurationMs,
      });
    },
    [getNode, getViewport, setCenter]
  );

  const focusEdgeById = useCallback(
    (edgeId: string) => {
      const selectedEdge = getEdge(edgeId);
      if (!selectedEdge) {
        return;
      }

      const sourceNodeCenter = getNodeCenterPosition(getNode(selectedEdge.source));
      const targetNodeCenter = getNodeCenterPosition(getNode(selectedEdge.target));

      if (!sourceNodeCenter || !targetNodeCenter) {
        return;
      }

      const currentViewport = getViewport();
      setCenter(
        (sourceNodeCenter.x + targetNodeCenter.x) / 2,
        (sourceNodeCenter.y + targetNodeCenter.y) / 2,
        {
          zoom: currentViewport.zoom,
          duration: VALIDATION_ISSUES_VIEWER.focusAnimationDurationMs,
        }
      );
    },
    [getEdge, getNode, getViewport, setCenter]
  );

  const focusValidationIssue = useCallback(
    (validationIssue: ValidationIssue) => {
      if (validationIssue.issueType === "node") {
        dispatch(
          setSelection({
            selectionType: "node",
            selectionId: validationIssue.nodeId,
          })
        );
        focusNodeById(validationIssue.nodeId);
        return;
      }

      dispatch(
        setSelection({
          selectionType: "edge",
          selectionId: validationIssue.edgeId,
        })
      );
      focusEdgeById(validationIssue.edgeId);
    },
    [dispatch, focusEdgeById, focusNodeById]
  );

  return { focusValidationIssue };
}
