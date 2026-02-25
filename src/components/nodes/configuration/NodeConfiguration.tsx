import {
  useCallback,
  useMemo,
  useState,
} from "react";
import { addEdge, useReactFlow, useStore } from "reactflow";
import type { BaseEdge, BaseNode } from "@/model/interface";
import type { Edge } from "reactflow";
import {
  DEFAULT_BORDER_COLOR,
  INVALID_BORDER_COLOR,
  NODE_TYPE_BACKGROUNDS,
} from "@/constants/nodeStyles";
import {
  configFormInputStyle,
  configFormInputErrorStyle,
  configFormLabelStyle,
  configFormErrorTextStyle,
} from "@/constants/formStyles";
import {
  OUTGOING_EDGE_CONFIGURATION_POLICY,
  OUTGOING_EDGE_CONFIGURATION_TEXT,
} from "@/constants/outgoingEdgeConfiguration";
import { validateNodeConfig, validateEdgeCondition } from "@/utils/formValidation";
import OutgoingEdgesConfiguration from "@/components/nodes/configuration/OutgoingEdgesConfiguration";

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

  const { name, description } = selectedNode?.config ?? {
    name: undefined,
    description: undefined,
  };
  const validation = useMemo(
    () => validateNodeConfig(name ?? "", description ?? ""),
    [name, description]
  );
  const isInvalid = !validation.isValid;
  const backgroundColor =
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

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeConfig({ description: event.target.value });
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
      <div style={{ padding: 16, color: "#666", fontSize: 14 }}>
        Select a node or edge to configure
      </div>
    );
  }

  return (
    <div
      style={{
        padding: 16,
        backgroundColor,
        border: `2px solid ${borderColor}`,
        borderRadius: 8,
      }}
    >
      <div style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 600 }}>
        {name || "Node Configuration"}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={configFormLabelStyle}>Name</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            style={
              validation.nameError ? configFormInputErrorStyle : configFormInputStyle
            }
            aria-invalid={!!validation.nameError}
            aria-describedby={validation.nameError ? "name-error" : undefined}
          />
          {validation.nameError && (
            <span id="name-error" role="alert" style={configFormErrorTextStyle}>
              {validation.nameError}
            </span>
          )}
        </div>
        <div>
          <label style={configFormLabelStyle}>Description</label>
          <input
            type="text"
            value={description}
            onChange={handleDescriptionChange}
            style={
              validation.descriptionError
                ? configFormInputErrorStyle
                : configFormInputStyle
            }
            aria-invalid={!!validation.descriptionError}
            aria-describedby={
              validation.descriptionError ? "description-error" : undefined
            }
          />
          {validation.descriptionError && (
            <span
              id="description-error"
              role="alert"
              style={configFormErrorTextStyle}
            >
              {validation.descriptionError}
            </span>
          )}
        </div>
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
  );
}
