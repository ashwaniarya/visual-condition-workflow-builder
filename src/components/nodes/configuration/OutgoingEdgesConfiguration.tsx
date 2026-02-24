import { useMemo, useState } from "react";
import { addEdge, useReactFlow, useStore } from "reactflow";
import type { BaseEdge, BaseNode } from "@/model/interface";
import {
  OUTGOING_EDGE_CONFIGURATION_IDS,
  OUTGOING_EDGE_CONFIGURATION_POLICY,
  OUTGOING_EDGE_CONFIGURATION_TEXT,
} from "@/constants/outgoingEdgeConfiguration";
import { getNodeDisplayName } from "@/utils/nodeDisplay";
import { validateEdgeCondition } from "@/utils/formValidation";
import ConfigurationField from "@/components/nodes/configuration/primitives/ConfigurationField";
import ConfigurationTextInput from "@/components/nodes/configuration/primitives/ConfigurationTextInput";
import ConfigurationSelectInput from "@/components/nodes/configuration/primitives/ConfigurationSelectInput";

interface OutgoingEdgesConfigurationProps {
  sourceNodeId: string;
}

interface OutgoingEdgeAddFormErrors {
  conditionError: string | null;
  targetError: string | null;
}

const edgeRowStyle: React.CSSProperties = {
  padding: 8,
  border: "1px solid #e5e7eb",
  borderRadius: 6,
  display: "flex",
  flexDirection: "column",
  gap: 8,
};

const rowActionButtonStyle: React.CSSProperties = {
  padding: "6px 10px",
  border: "1px solid #d1d5db",
  borderRadius: 6,
  background: "#fff",
  cursor: "pointer",
  fontSize: 12,
  alignSelf: "flex-start",
};

const addFormActionContainerStyle: React.CSSProperties = {
  display: "flex",
  gap: 8,
};

function createDefaultAddFormErrors(): OutgoingEdgeAddFormErrors {
  return { conditionError: null, targetError: null };
}

export default function OutgoingEdgesConfiguration({
  sourceNodeId,
}: OutgoingEdgesConfigurationProps) {
  const { setEdges } = useReactFlow();
  const nodeInternals = useStore((state) => Array.from(state.nodeInternals.values()));
  const flowEdges = useStore((state) => state.edges);

  const [isAddEdgeFormVisible, setIsAddEdgeFormVisible] = useState(false);
  const [draftConditionText, setDraftConditionText] = useState("");
  const [draftTargetNodeId, setDraftTargetNodeId] = useState("");
  const [addFormErrors, setAddFormErrors] = useState<OutgoingEdgeAddFormErrors>(
    createDefaultAddFormErrors()
  );

  const validTargetNodes = useMemo(
    () =>
      nodeInternals
        .map((flowNode) => flowNode.data?.baseNode as BaseNode | undefined)
        .filter((baseNode): baseNode is BaseNode => !!baseNode)
        .filter((baseNode) => baseNode.id !== sourceNodeId)
        .filter(
          (baseNode) =>
            !OUTGOING_EDGE_CONFIGURATION_POLICY.blockedTargetNodeTypes.includes(
              baseNode._type as (typeof OUTGOING_EDGE_CONFIGURATION_POLICY.blockedTargetNodeTypes)[number]
            )
        ),
    [nodeInternals, sourceNodeId]
  );

  const outgoingFlowEdges = useMemo(
    () =>
      flowEdges.filter(
        (flowEdge) => flowEdge.data?.baseEdge?.sourceNodeId === sourceNodeId
      ),
    [flowEdges, sourceNodeId]
  );

  const openAddEdgeForm = () => {
    setIsAddEdgeFormVisible(true);
    setAddFormErrors(createDefaultAddFormErrors());
  };

  const closeAndResetAddEdgeForm = () => {
    setIsAddEdgeFormVisible(false);
    setDraftConditionText("");
    setDraftTargetNodeId("");
    setAddFormErrors(createDefaultAddFormErrors());
  };

  const removeOutgoingEdge = (edgeId: string) => {
    setEdges((existingEdges) => existingEdges.filter((edge) => edge.id !== edgeId));
  };

  const updateOutgoingEdgeCondition = (edgeId: string, updatedCondition: string) => {
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
  };

  const updateOutgoingEdgeTarget = (edgeId: string, updatedTargetNodeId: string) => {
    setEdges((existingEdges) =>
      existingEdges.map((edge) => {
        if (edge.id !== edgeId) return edge;
        const currentBaseEdge = edge.data?.baseEdge;
        if (!currentBaseEdge) return edge;
        return {
          ...edge,
          source: sourceNodeId,
          target: updatedTargetNodeId,
          data: {
            baseEdge: {
              ...currentBaseEdge,
              sourceNodeId,
              targetNodeId: updatedTargetNodeId,
            },
          },
        };
      })
    );
  };

  const submitAddEdgeForm = () => {
    const conditionValidation = validateEdgeCondition(draftConditionText);
    const nextFormErrors: OutgoingEdgeAddFormErrors = {
      conditionError: conditionValidation.conditionError,
      targetError: draftTargetNodeId
        ? null
        : OUTGOING_EDGE_CONFIGURATION_TEXT.targetRequiredError,
    };
    setAddFormErrors(nextFormErrors);

    if (nextFormErrors.conditionError || nextFormErrors.targetError) return;

    setEdges((existingEdges) => {
      const edgesAfterAdd = addEdge(
        { source: sourceNodeId, target: draftTargetNodeId },
        existingEdges
      );
      if (edgesAfterAdd.length <= existingEdges.length) return edgesAfterAdd;

      const recentlyAddedEdge = edgesAfterAdd[edgesAfterAdd.length - 1];
      const baseEdge: BaseEdge = {
        _type: OUTGOING_EDGE_CONFIGURATION_POLICY.edgeType,
        id: recentlyAddedEdge.id,
        sourceNodeId,
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

    closeAndResetAddEdgeForm();
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div style={{ marginTop: 4, fontSize: 12, fontWeight: 600 }}>
        {OUTGOING_EDGE_CONFIGURATION_TEXT.title}
      </div>

      {outgoingFlowEdges.length === 0 && (
        <div style={{ fontSize: 12, color: "#6b7280" }}>
          {OUTGOING_EDGE_CONFIGURATION_TEXT.emptyState}
        </div>
      )}

      {outgoingFlowEdges.map((flowEdge) => {
        const baseEdge = flowEdge.data?.baseEdge;
        if (!baseEdge) return null;
        const rowConditionValidation = validateEdgeCondition(baseEdge.condition ?? "");
        return (
          <div key={flowEdge.id} style={edgeRowStyle}>
            <ConfigurationField
              labelText={OUTGOING_EDGE_CONFIGURATION_TEXT.conditionLabel}
              errorMessage={rowConditionValidation.conditionError}
            >
              <ConfigurationTextInput
                value={baseEdge.condition ?? ""}
                onChange={(event) =>
                  updateOutgoingEdgeCondition(flowEdge.id, event.target.value)
                }
                placeholderText={OUTGOING_EDGE_CONFIGURATION_TEXT.addConditionPlaceholder}
                errorMessage={rowConditionValidation.conditionError}
              />
            </ConfigurationField>

            <ConfigurationField labelText={OUTGOING_EDGE_CONFIGURATION_TEXT.targetLabel}>
              <ConfigurationSelectInput
                selectedValue={baseEdge.targetNodeId}
                onChange={(event) =>
                  updateOutgoingEdgeTarget(flowEdge.id, event.target.value)
                }
                options={validTargetNodes.map((targetNode) => ({
                  optionValue: targetNode.id,
                  optionLabel: getNodeDisplayName(targetNode, targetNode.id),
                }))}
                placeholderOptionLabel={OUTGOING_EDGE_CONFIGURATION_TEXT.noTargetOption}
              />
            </ConfigurationField>

            <button
              type="button"
              onClick={() => removeOutgoingEdge(flowEdge.id)}
              style={rowActionButtonStyle}
            >
              {OUTGOING_EDGE_CONFIGURATION_TEXT.removeEdgeButton}
            </button>
          </div>
        );
      })}

      {!isAddEdgeFormVisible && (
        <button
          type="button"
          onClick={openAddEdgeForm}
          style={rowActionButtonStyle}
          disabled={validTargetNodes.length === 0}
          title={
            validTargetNodes.length === 0
              ? OUTGOING_EDGE_CONFIGURATION_TEXT.noValidTargetNodes
              : undefined
          }
        >
          {OUTGOING_EDGE_CONFIGURATION_TEXT.addEdgeButton}
        </button>
      )}

      {isAddEdgeFormVisible && (
        <div style={edgeRowStyle}>
          <div style={{ fontSize: 12, color: "#6b7280" }}>
            {OUTGOING_EDGE_CONFIGURATION_TEXT.addFormHint}
          </div>

          <ConfigurationField
            labelText={OUTGOING_EDGE_CONFIGURATION_TEXT.conditionLabel}
            errorMessage={addFormErrors.conditionError}
            errorElementId={OUTGOING_EDGE_CONFIGURATION_IDS.addConditionError}
          >
            <ConfigurationTextInput
              value={draftConditionText}
              onChange={(event) => {
                setDraftConditionText(event.target.value);
                if (addFormErrors.conditionError) {
                  setAddFormErrors((existingErrors) => ({
                    ...existingErrors,
                    conditionError: null,
                  }));
                }
              }}
              placeholderText={OUTGOING_EDGE_CONFIGURATION_TEXT.addConditionPlaceholder}
              errorMessage={addFormErrors.conditionError}
              errorElementId={OUTGOING_EDGE_CONFIGURATION_IDS.addConditionError}
            />
          </ConfigurationField>

          <ConfigurationField
            labelText={OUTGOING_EDGE_CONFIGURATION_TEXT.targetLabel}
            errorMessage={addFormErrors.targetError}
            errorElementId={OUTGOING_EDGE_CONFIGURATION_IDS.addTargetError}
          >
            <ConfigurationSelectInput
              selectedValue={draftTargetNodeId}
              onChange={(event) => {
                setDraftTargetNodeId(event.target.value);
                if (addFormErrors.targetError) {
                  setAddFormErrors((existingErrors) => ({
                    ...existingErrors,
                    targetError: null,
                  }));
                }
              }}
              options={validTargetNodes.map((targetNode) => ({
                optionValue: targetNode.id,
                optionLabel: getNodeDisplayName(targetNode, targetNode.id),
              }))}
              errorMessage={addFormErrors.targetError}
              errorElementId={OUTGOING_EDGE_CONFIGURATION_IDS.addTargetError}
              placeholderOptionLabel={OUTGOING_EDGE_CONFIGURATION_TEXT.noTargetOption}
            />
          </ConfigurationField>

          <div style={addFormActionContainerStyle}>
            <button
              type="button"
              onClick={closeAndResetAddEdgeForm}
              style={rowActionButtonStyle}
            >
              {OUTGOING_EDGE_CONFIGURATION_TEXT.cancelAddButton}
            </button>
            <button type="button" onClick={submitAddEdgeForm} style={rowActionButtonStyle}>
              {OUTGOING_EDGE_CONFIGURATION_TEXT.confirmAddButton}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
