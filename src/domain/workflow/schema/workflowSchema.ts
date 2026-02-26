import { z } from "zod";
import { NODE_CONFIG_STATES } from "@/shared/constants/nodeConfigState";
import { PORT_DIRECTIONS } from "@/shared/constants/portPolicy";

const portDefinitionSchema = z.object({
  direction: z.enum(PORT_DIRECTIONS),
});

const nodeUiConfigSchema = z.object({
  position: z.object({
    x: z.number(),
    y: z.number(),
  }),
  portPolicy: z.array(portDefinitionSchema),
});

const nodeConfigSchema = z
  .object({
    name: z.string(),
    description: z.string(),
    prompt: z.string().optional(),
  })
  .catchall(z.unknown());

export const baseNodeSchema = z.object({
  _type: z.string(),
  id: z.string(),
  _nodeConfigState: z.enum(NODE_CONFIG_STATES),
  config: nodeConfigSchema,
  _uiconfig: nodeUiConfigSchema,
});

export const baseEdgeSchema = z.object({
  _type: z.string(),
  id: z.string(),
  sourceNodeId: z.string(),
  targetNodeId: z.string(),
  config: z.record(z.string(), z.unknown()),
  parameters: z.record(z.string(), z.unknown()),
  condition: z.string(),
});

export const workflowPayloadSchema = z.object({
  nodes: z.array(baseNodeSchema),
  edges: z.array(baseEdgeSchema),
});

export type WorkflowPayload = z.infer<typeof workflowPayloadSchema>;

