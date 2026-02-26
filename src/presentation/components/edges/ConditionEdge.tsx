import { memo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import { Trash2 } from "lucide-react";
import {
  BaseEdge,
  EdgeLabelRenderer,
  getBezierPath,
  useReactFlow,
  type EdgeProps,
} from "reactflow";
import type { BaseEdge as BaseEdgeModel } from "@/domain/model/interface";
import { setSelection } from "@/state/store/canvasSlice";
import { EDGE_LABELS } from "@/shared/constants/edgeLabels";
import { validateEdgeCondition } from "@/shared/utils/formValidation";
import {
  EDGE_INVALID_LABEL_BACKGROUND_COLOR,
  EDGE_INVALID_LABEL_BORDER_COLOR,
  EDGE_INVALID_LABEL_TEXT_COLOR,
  EDGE_INVALID_STROKE_COLOR,
  EDGE_INVALID_STROKE_WIDTH,
  SELECTED_EDGE_GLOW_FILTER,
  SELECTED_EDGE_STROKE_WIDTH,
} from "@/shared/constants/nodeStyles";
import { IconButton } from "@/design-system/ui";
import { cn } from "@/shared/lib/utils";

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
  selected,
  ...restEdgeProps
}: EdgeProps<ConditionEdgeData>) {
  const dispatch = useDispatch();
  const { getEdge, deleteElements } = useReactFlow();
  const [isLabelHovered, setIsLabelHovered] = useState(false);
  const condition = data?.baseEdge?.condition ?? "";
  const displayText = condition.trim() || EDGE_LABELS.NO_CONDITION_PLACEHOLDER;
  const isConditionInvalid = Boolean(
    validateEdgeCondition(condition).conditionError
  );

  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const sanitizedEdgeId = id.replace(/[^a-zA-Z0-9_-]/g, "-");
  const selectionGradientId = `workflow-condition-edge-gradient-${sanitizedEdgeId}`;

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
      <BaseEdge
        id={id}
        path={edgePath}
        {...restEdgeProps}
        style={
          isConditionInvalid
            ? {
                stroke: EDGE_INVALID_STROKE_COLOR,
                strokeWidth: EDGE_INVALID_STROKE_WIDTH,
                ...(selected ? { filter: SELECTED_EDGE_GLOW_FILTER } : undefined),
              }
            : selected
              ? {
                  stroke: `url(#${selectionGradientId})`,
                  strokeWidth: SELECTED_EDGE_STROKE_WIDTH,
                  filter: SELECTED_EDGE_GLOW_FILTER,
                }
              : undefined
        }
      />
      {selected && !isConditionInvalid && (
        <defs>
          <linearGradient id={selectionGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-violet-500)" />
            <stop offset="50%" stopColor="var(--color-yellow-300)" />
            <stop offset="100%" stopColor="var(--color-violet-500)" />
            <animateTransform
              attributeName="gradientTransform"
              attributeType="XML"
              type="translate"
              from="-1 0"
              to="1 0"
              dur="var(--workflow-selection-gradient-animation-duration)"
              repeatCount="indefinite"
            />
          </linearGradient>
        </defs>
      )}
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
            className={cn(
              "relative cursor-pointer rounded border border-neutral-300 bg-white px-2 py-1 text-xs pointer-events-auto",
              selected && !isConditionInvalid && "workflow-selected-edge-label"
            )}
            style={
              isConditionInvalid
                ? {
                    borderColor: EDGE_INVALID_LABEL_BORDER_COLOR,
                    backgroundColor: EDGE_INVALID_LABEL_BACKGROUND_COLOR,
                    color: EDGE_INVALID_LABEL_TEXT_COLOR,
                  }
                : undefined
            }
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
                icon={<Trash2 className="h-3.5 w-3.5" />}
                variant="neutral"
                iconButtonSize="sm"
                aria-label="Remove edge"
                className="nodrag nopan absolute right-0 top-0 translate-x-1/2 -translate-y-1/2 bg-white shadow-sm hover:bg-red-50 hover:text-red-600 hover:border-red-200"
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
