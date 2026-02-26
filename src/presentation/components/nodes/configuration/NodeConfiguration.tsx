import { useCallback, useMemo, useState } from "react";
import { addEdge, useReactFlow, useStore } from "reactflow";
import type { BaseEdge, BaseNode } from "@/domain/model/interface";
import type { Edge } from "reactflow";
import { Settings2 } from "lucide-react";
import {
  DEFAULT_BORDER_COLOR,
  INVALID_BORDER_COLOR,
  NODE_TYPE_BACKGROUNDS,
} from "@/shared/constants/nodeStyles";
import ConfigurationField from "@/presentation/components/nodes/configuration/primitives/ConfigurationField";
import ConfigurationTextInput from "@/presentation/components/nodes/configuration/primitives/ConfigurationTextInput";
import ConfigurationTextArea from "@/presentation/components/nodes/configuration/primitives/ConfigurationTextArea";
import { Typography } from "@/design-system/ui";
import {
  OUTGOING_EDGE_CONFIGURATION_POLICY,
  OUTGOING_EDGE_CONFIGURATION_TEXT,
} from "@/shared/constants/outgoingEdgeConfiguration";
import { validateNodeConfig, validateEdgeCondition } from "@/shared/utils/formValidation";
import OutgoingEdgesConfiguration from "@/presentation/components/nodes/configuration/OutgoingEdgesConfiguration";

interface NodeConfigurationProps {
  nodeId: string;
}

interface NodeConfigurationStoreSlice {
  selectedNode: BaseNode | null;
  validTargetNodes: BaseNode[];
  outgoingFlowEdges: Edge[];
}

function areOutgoingFlowEdgesDataEqual(
  prev: Edge[],
  next: Edge[]
): boolean {
  if (prev.length !== next.length) return false;
  return prev.every((p, i) => {
    const n = next[i];
    const pBase = p.data?.baseEdge;
    const nBase = n.data?.baseEdge;
    return (
      p.id === n.id &&
      (pBase?.condition ?? "") === (nBase?.condition ?? "") &&
      (pBase?.targetNodeId ?? "") === (nBase?.targetNodeId ?? "")
    );
  });
}

function areValidTargetNodesDataEqual(
  prev: BaseNode[],
  next: BaseNode[]
): boolean {
  if (prev.length !== next.length) return false;
  return prev.every((p, i) => p.id === next[i].id);
}

function areNodeConfigurationStoreSlicesEqual(
  prev: NodeConfigurationStoreSlice,
  next: NodeConfigurationStoreSlice
): boolean {
  if (prev.selectedNode?.id !== next.selectedNode?.id) return false;
  if (
    (prev.selectedNode?.config.name ?? "") !==
    (next.selectedNode?.config.name ?? "")
  )
    return false;
  if (
    (prev.selectedNode?.config.description ?? "") !==
    (next.selectedNode?.config.description ?? "")
  )
    return false;
  if (
    (prev.selectedNode?.config.prompt ?? "") !==
    (next.selectedNode?.config.prompt ?? "")
  )
    return false;
  if (!areOutgoingFlowEdgesDataEqual(prev.outgoingFlowEdges, next.outgoingFlowEdges))
    return false;
  if (!areValidTargetNodesDataEqual(prev.validTargetNodes, next.validTargetNodes))
    return false;
  return true;
}

export default function NodeConfiguration({ nodeId }: NodeConfigurationProps) {
  const { setNodes, setEdges } = useReactFlow();

  const { selectedNode, validTargetNodes, outgoingFlowEdges } = useStore(
    (state) => {
      const flowNodes = Array.from(state.nodeInternals.values());
      const flowEdges = state.edges;
      const selectedFlowNode = state.nodeInternals.get(nodeId);
      const selectedNode =
        (selectedFlowNode?.data?.baseNode as BaseNode | undefined) ?? null;
      const validTargetNodes = flowNodes
        .map((flowNode) => flowNode.data?.baseNode as BaseNode | undefined)
        .filter((baseNode): baseNode is BaseNode => !!baseNode)
        .filter((baseNode) => baseNode.id !== nodeId)
        .filter(
          (baseNode) =>
            !OUTGOING_EDGE_CONFIGURATION_POLICY.blockedTargetNodeTypes.includes(
              baseNode._type as (typeof OUTGOING_EDGE_CONFIGURATION_POLICY.blockedTargetNodeTypes)[number]
            )
        );
      const outgoingFlowEdges = flowEdges.filter(
        (flowEdge) => flowEdge.data?.baseEdge?.sourceNodeId === nodeId
      );
      return {
        selectedNode,
        validTargetNodes,
        outgoingFlowEdges,
      };
    },
    areNodeConfigurationStoreSlicesEqual
  );

  const [isAddEdgeFormVisible, setIsAddEdgeFormVisible] = useState(false);
  const [draftConditionText, setDraftConditionText] = useState("");
  const [draftTargetNodeId, setDraftTargetNodeId] = useState("");
  const [addFormErrors, setAddFormErrors] = useState<{
    conditionError: string | null;
    targetError: string | null;
  }>({ conditionError: null, targetError: null });

  const { name, description, prompt } = selectedNode?.config ?? {
    name: undefined,
    description: undefined,
    prompt: undefined,
  };
  const validation = useMemo(
    () => validateNodeConfig(name ?? "", description ?? ""),
    [name, description]
  );
  const isInvalid = !validation.isValid;
  const nodeTypeColor =
    NODE_TYPE_BACKGROUNDS[selectedNode?._type ?? "task"] ??
    NODE_TYPE_BACKGROUNDS.task;
  const borderColor = isInvalid ? INVALID_BORDER_COLOR : DEFAULT_BORDER_COLOR;

  const updateNodeConfig = useCallback(
    (configUpdates: Partial<BaseNode["config"]>) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== nodeId) return n;
          const baseNode = n.data.baseNode;
          const newConfig = { ...baseNode.config, ...configUpdates };
          const { isValid } = validateNodeConfig(
            newConfig.name ?? "",
            newConfig.description ?? ""
          );
          return {
            ...n,
            data: {
              baseNode: {
                ...baseNode,
                config: newConfig,
                _nodeConfigState: isValid
                  ? "VALID_CONFIGURATION"
                  : "INVALID_CONFIGURATION",
              },
            },
          };
        })
      );
    },
    [nodeId, setNodes]
  );

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeConfig({ name: event.target.value });
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeConfig({ description: event.target.value });
  };

  const handlePromptChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeConfig({ prompt: event.target.value });
  };

  const onOpenAddEdgeForm = useCallback(() => {
    setIsAddEdgeFormVisible(true);
    setAddFormErrors({ conditionError: null, targetError: null });
  }, []);

  const onCloseAndResetAddEdgeForm = useCallback(() => {
    setIsAddEdgeFormVisible(false);
    setDraftConditionText("");
    setDraftTargetNodeId("");
    setAddFormErrors({ conditionError: null, targetError: null });
  }, []);

  const onRemoveOutgoingEdge = useCallback(
    (edgeId: string) => {
      setEdges((existingEdges) =>
        existingEdges.filter((edge) => edge.id !== edgeId)
      );
    },
    [setEdges]
  );

  const onUpdateOutgoingEdgeCondition = useCallback(
    (edgeId: string, updatedCondition: string) => {
      setEdges((existingEdges) =>
        existingEdges.map((edge) => {
          if (edge.id !== edgeId) return edge;
          const currentBaseEdge = edge.data?.baseEdge;
          if (!currentBaseEdge) return edge;
          return {
            ...edge,
            data: {
              baseEdge: {
                ...currentBaseEdge,
                condition: updatedCondition,
              },
            },
          };
        })
      );
    },
    [setEdges]
  );

  const onUpdateOutgoingEdgeTarget = useCallback(
    (edgeId: string, updatedTargetNodeId: string) => {
      setEdges((existingEdges) =>
        existingEdges.map((edge) => {
          if (edge.id !== edgeId) return edge;
          const currentBaseEdge = edge.data?.baseEdge;
          if (!currentBaseEdge) return edge;
          return {
            ...edge,
            source: nodeId,
            target: updatedTargetNodeId,
            data: {
              baseEdge: {
                ...currentBaseEdge,
                sourceNodeId: nodeId,
                targetNodeId: updatedTargetNodeId,
              },
            },
          };
        })
      );
    },
    [setEdges, nodeId]
  );

  const onSubmitAddEdgeForm = useCallback(() => {
    const conditionValidation = validateEdgeCondition(draftConditionText);
    const nextFormErrors = {
      conditionError: conditionValidation.conditionError,
      targetError: draftTargetNodeId
        ? null
        : OUTGOING_EDGE_CONFIGURATION_TEXT.targetRequiredError,
    };
    setAddFormErrors(nextFormErrors);

    if (nextFormErrors.conditionError || nextFormErrors.targetError) return;

    setEdges((existingEdges) => {
      const edgesAfterAdd = addEdge(
        {
          source: nodeId,
          target: draftTargetNodeId,
          sourceHandle: null,
          targetHandle: null,
        },
        existingEdges
      );
      if (edgesAfterAdd.length <= existingEdges.length) return edgesAfterAdd;

      const recentlyAddedEdge = edgesAfterAdd[edgesAfterAdd.length - 1];
      const baseEdge: BaseEdge = {
        _type: OUTGOING_EDGE_CONFIGURATION_POLICY.edgeType,
        id: recentlyAddedEdge.id,
        sourceNodeId: nodeId,
        targetNodeId: draftTargetNodeId,
        parameters: {},
        condition: draftConditionText,
        config: {},
      };

      return edgesAfterAdd.map((edge) =>
        edge.id === recentlyAddedEdge.id
          ? {
              ...edge,
              type: OUTGOING_EDGE_CONFIGURATION_POLICY.edgeType,
              data: { baseEdge },
            }
          : edge
      );
    });

    setIsAddEdgeFormVisible(false);
    setDraftConditionText("");
    setDraftTargetNodeId("");
    setAddFormErrors({ conditionError: null, targetError: null });
  }, [draftConditionText, draftTargetNodeId, nodeId, setEdges]);

  const onDraftConditionChange = useCallback((value: string) => {
    setDraftConditionText(value);
    setAddFormErrors((existingErrors) =>
      existingErrors.conditionError
        ? { ...existingErrors, conditionError: null }
        : existingErrors
    );
  }, []);

  const onDraftTargetChange = useCallback((value: string) => {
    setDraftTargetNodeId(value);
    setAddFormErrors((existingErrors) =>
      existingErrors.targetError
        ? { ...existingErrors, targetError: null }
        : existingErrors
    );
  }, []);

  if (!selectedNode) {
    return (
      <div className="p-6">
        <Typography variant="body" className="text-neutral-500">
          Select a node or edge to configure
        </Typography>
      </div>
    );
  }

  return (
    <div
      className="m-3 rounded-lg border bg-white shadow-sm relative overflow-hidden transition-all duration-300"
      style={{ borderColor }}
    >
      <div
        className="absolute top-0 left-0 w-full h-1"
        style={{ backgroundColor: nodeTypeColor }}
      />

      <div className="p-4 pt-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-neutral-500" />
            <Typography variant="h4" weight="bold" className="text-neutral-800 tracking-tight">
              {name || "Node Configuration"}
            </Typography>
          </div>
          <div
            className="h-2 w-2 rounded-full ring-2 ring-white"
            style={{ backgroundColor: nodeTypeColor }}
          />
        </div>

        <div className="flex flex-col gap-4">
          <ConfigurationField
            labelText="Name"
            errorMessage={validation.nameError}
            errorElementId="name-error"
          >
            <ConfigurationTextInput
              value={name ?? ""}
              onChange={handleNameChange}
              errorMessage={validation.nameError}
              errorElementId="name-error"
            />
          </ConfigurationField>
          <ConfigurationField
            labelText="Description"
            errorMessage={validation.descriptionError}
            errorElementId="description-error"
          >
            <ConfigurationTextArea
              value={description ?? ""}
              onChange={handleDescriptionChange}
              errorMessage={validation.descriptionError}
              errorElementId="description-error"
            />
          </ConfigurationField>

          <ConfigurationField
            labelText="Prompt"
            errorMessage={null}
            errorElementId="prompt-error"
          >
            <ConfigurationTextArea
              value={prompt ?? ""}
              onChange={handlePromptChange}
              placeholderText="Enter prompt here..."
            />
          </ConfigurationField>

          <div className="border-t border-neutral-100 pt-4 mt-1">
            <OutgoingEdgesConfiguration
              validTargetNodes={validTargetNodes}
              outgoingFlowEdges={outgoingFlowEdges}
              isAddEdgeFormVisible={isAddEdgeFormVisible}
              draftConditionText={draftConditionText}
              draftTargetNodeId={draftTargetNodeId}
              addFormErrors={addFormErrors}
              onOpenAddEdgeForm={onOpenAddEdgeForm}
              onCloseAndResetAddEdgeForm={onCloseAndResetAddEdgeForm}
              onRemoveOutgoingEdge={onRemoveOutgoingEdge}
              onUpdateOutgoingEdgeCondition={onUpdateOutgoingEdgeCondition}
              onUpdateOutgoingEdgeTarget={onUpdateOutgoingEdgeTarget}
              onSubmitAddEdgeForm={onSubmitAddEdgeForm}
              onDraftConditionChange={onDraftConditionChange}
              onDraftTargetChange={onDraftTargetChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
