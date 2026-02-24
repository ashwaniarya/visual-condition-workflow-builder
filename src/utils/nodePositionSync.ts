import type { Node } from "reactflow";
import type { BaseNode } from "@/model/interface";

type NodeWithBaseNode = Node<{ baseNode: BaseNode }>;

/**
 * Syncs baseNode._uiconfig.position from dropped nodes into current nodes.
 * Use in onNodeDragStop / onSelectionDragStop — fires once when drag ends.
 */
export function syncBaseNodePositionsForDroppedNodes(
  currentNodes: NodeWithBaseNode[],
  droppedNodes: NodeWithBaseNode[]
): NodeWithBaseNode[] {
  const droppedById = new Map(droppedNodes.map((n) => [n.id, n]));

  return currentNodes.map((node) => {
    const dropped = droppedById.get(node.id);
    if (!dropped?.data?.baseNode || !node.data?.baseNode) return node;

    return {
      ...node,
      data: {
        ...node.data,
        baseNode: {
          ...node.data.baseNode,
          _uiconfig: {
            ...node.data.baseNode._uiconfig,
            position: dropped.position,
          },
        },
      },
    };
  });
}
