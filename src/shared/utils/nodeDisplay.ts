import type { BaseNode } from "@/domain/model/interface";

/**
 * Returns display name for a node: config.name if present, otherwise nodeId
 */
export function getNodeDisplayName(
  node: BaseNode | undefined,
  nodeId: string
): string {
  if (!node) return nodeId;
  const name = node.config?.name?.trim();
  return name || nodeId;
}
