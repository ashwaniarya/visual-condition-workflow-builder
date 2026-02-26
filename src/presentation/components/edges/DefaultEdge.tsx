import { BaseEdge, getBezierPath } from "reactflow";
import type { EdgeProps } from "reactflow";
import {
  SELECTED_EDGE_GLOW_FILTER,
  SELECTED_EDGE_STROKE_WIDTH,
} from "@/shared/constants/nodeStyles";

export default function DefaultEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    selected,
    ...restEdgeProps
  } = props;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const sanitizedEdgeId = id.replace(/[^a-zA-Z0-9_-]/g, "-");
  const selectionGradientId = `workflow-default-edge-gradient-${sanitizedEdgeId}`;

  return (
    <>
      {selected && (
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

      <BaseEdge
        id={id}
        path={edgePath}
        {...restEdgeProps}
        style={
          selected
            ? {
                stroke: `url(#${selectionGradientId})`,
                strokeWidth: SELECTED_EDGE_STROKE_WIDTH,
                filter: SELECTED_EDGE_GLOW_FILTER,
              }
            : undefined
        }
      />
    </>
  );
}
