import { BezierEdge } from "reactflow";
import type { EdgeProps } from "reactflow";

export default function DefaultEdge(props: EdgeProps) {
  return <BezierEdge {...props} />;
}
