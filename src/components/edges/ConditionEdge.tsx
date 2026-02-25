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
import { IconButton } from "@/ui";

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
            className="relative cursor-pointer rounded border border-neutral-300 bg-white px-2 py-1 text-xs pointer-events-auto"
            onClick={handleLabelClick}
            onKeyDown={(e) => e.key === "Enter" && handleLabelClick()}
            onMouseEnter={() => setIsLabelHovered(true)}
            onMouseLeave={() => setIsLabelHovered(false)}
            aria-label={`Condition: ${displayText}`}
          >
            <span>{displayText}</span>
            {isLabelHovered && (
              <IconButton
                type="button"
                icon={<span className="text-sm leading-none">×</span>}
                variant="neutral"
                iconButtonSize="sm"
                aria-label="Remove edge"
                className="nodrag nopan absolute right-0 top-0"
                onClick={handleRemoveClick}
              />
            )}
          </div>
        </div>
      </EdgeLabelRenderer>
    </>
  );
}

export default memo(ConditionEdge);
