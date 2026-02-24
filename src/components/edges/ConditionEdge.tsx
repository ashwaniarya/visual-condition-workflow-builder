import { memo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from "reactflow";
import type { BaseEdge as BaseEdgeModel } from "@/model/interface";
import { setSelection } from "@/store/canvasSlice";
import { EDGE_LABELS } from "@/constants/edgeLabels";
import { DELETE_BUTTON_SIZE } from "@/constants/deletionConfig";

const labelBaseStyle: React.CSSProperties = {
  position: "relative",
  padding: "4px 8px",
  borderRadius: 4,
  border: "1px solid #b1b1b7",
  background: "#fff",
  fontSize: 12,
  cursor: "pointer",
  pointerEvents: "all",
};

const deleteButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  right: 0,
  width: DELETE_BUTTON_SIZE,
  height: DELETE_BUTTON_SIZE,
  minWidth: DELETE_BUTTON_SIZE,
  borderRadius: 4,
  border: "1px solid #b1b1b7",
  background: "#fff",
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: 14,
  color: "#666",
  lineHeight: 1,
  padding: 0,
};

interface ConditionEdgeData {
  baseEdge: BaseEdgeModel;
}

function ConditionEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
}: EdgeProps<ConditionEdgeData>) {
  const dispatch = useDispatch();
  const { getEdge, deleteElements } = useReactFlow();
  const [isLabelHovered, setIsLabelHovered] = useState(false);
  const condition = data?.baseEdge?.condition ?? "";
  const displayText = condition.trim() || EDGE_LABELS.NO_CONDITION_PLACEHOLDER;

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const handleLabelClick = useCallback(() => {
    dispatch(setSelection({ selectionType: "edge", selectionId: id }));
  }, [dispatch, id]);

  const handleRemoveClick = useCallback(
    (event: React.MouseEvent) => {
      event.stopPropagation();
      const edge = getEdge(id);
      if (edge) {
        deleteElements({ edges: [edge] });
      }
    },
    [id, getEdge, deleteElements],
  );

  return (
    <>
      <BaseEdge id={id} path={edgePath} />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
          }}
          className="nodrag nopan"
        >
          <div
            role="button"
            tabIndex={0}
            style={labelBaseStyle}
            onClick={handleLabelClick}
            onKeyDown={(e) => e.key === "Enter" && handleLabelClick()}
            onMouseEnter={() => setIsLabelHovered(true)}
            onMouseLeave={() => setIsLabelHovered(false)}
            aria-label={`Condition: ${displayText}`}
          >
            <span>{displayText}</span>
            {isLabelHovered && (
              <button
                type="button"
                className="nodrag nopan"
                style={deleteButtonStyle}
                onClick={handleRemoveClick}
                aria-label="Remove edge"
              >
                ×
              </button>
            )}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(ConditionEdge);
