import { memo, useMemo } from "react";
import type { BaseNode } from "@/model/interface";
import type { Edge } from "reactflow";
import {
  OUTGOING_EDGE_CONFIGURATION_IDS,
  OUTGOING_EDGE_CONFIGURATION_TEXT,
} from "@/constants/outgoingEdgeConfiguration";
import { getNodeDisplayName } from "@/utils/nodeDisplay";
import { validateEdgeCondition } from "@/utils/formValidation";
import ConfigurationField from "@/components/nodes/configuration/primitives/ConfigurationField";
import ConfigurationTextInput from "@/components/nodes/configuration/primitives/ConfigurationTextInput";
import ConfigurationSelectInput from "@/components/nodes/configuration/primitives/ConfigurationSelectInput";

interface OutgoingEdgeAddFormErrors {
  conditionError: string | null;
  targetError: string | null;
}

interface OutgoingEdgesConfigurationProps {
  validTargetNodes: BaseNode[];
  outgoingFlowEdges: Edge[];
  isAddEdgeFormVisible: boolean;
  draftConditionText: string;
  draftTargetNodeId: string;
  addFormErrors: OutgoingEdgeAddFormErrors;
  onOpenAddEdgeForm: () => void;
  onCloseAndResetAddEdgeForm: () => void;
  onRemoveOutgoingEdge: (edgeId: string) => void;
  onUpdateOutgoingEdgeCondition: (
    edgeId: string,
    updatedCondition: string
  ) => void;
  onUpdateOutgoingEdgeTarget: (
    edgeId: string,
    updatedTargetNodeId: string
  ) => void;
  onSubmitAddEdgeForm: () => void;
  onDraftConditionChange: (value: string) => void;
  onDraftTargetChange: (value: string) => void;
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

const OutgoingEdgesConfiguration = memo(function OutgoingEdgesConfiguration({
  validTargetNodes,
  outgoingFlowEdges,
  isAddEdgeFormVisible,
  draftConditionText,
  draftTargetNodeId,
  addFormErrors,
  onOpenAddEdgeForm,
  onCloseAndResetAddEdgeForm,
  onRemoveOutgoingEdge,
  onUpdateOutgoingEdgeCondition,
  onUpdateOutgoingEdgeTarget,
  onSubmitAddEdgeForm,
  onDraftConditionChange,
  onDraftTargetChange,
}: OutgoingEdgesConfigurationProps) {
  const targetNodeOptions = useMemo(
    () =>
      validTargetNodes.map((targetNode) => ({
        optionValue: targetNode.id,
        optionLabel: getNodeDisplayName(targetNode, targetNode.id),
      })),
    [validTargetNodes]
  );

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
        const rowConditionValidation = validateEdgeCondition(
          baseEdge.condition ?? ""
        );
        return (
          <div key={flowEdge.id} style={edgeRowStyle}>
            <ConfigurationField
              labelText={OUTGOING_EDGE_CONFIGURATION_TEXT.conditionLabel}
              errorMessage={rowConditionValidation.conditionError}
            >
              <ConfigurationTextInput
                value={baseEdge.condition ?? ""}
                onChange={(event) =>
                  onUpdateOutgoingEdgeCondition(
                    flowEdge.id,
                    event.target.value
                  )
                }
                placeholderText={
                  OUTGOING_EDGE_CONFIGURATION_TEXT.addConditionPlaceholder
                }
                errorMessage={rowConditionValidation.conditionError}
              />
            </ConfigurationField>

            <ConfigurationField
              labelText={OUTGOING_EDGE_CONFIGURATION_TEXT.targetLabel}
            >
              <ConfigurationSelectInput
                selectedValue={baseEdge.targetNodeId}
                onChange={(event) =>
                  onUpdateOutgoingEdgeTarget(flowEdge.id, event.target.value)
                }
                options={targetNodeOptions}
                placeholderOptionLabel={
                  OUTGOING_EDGE_CONFIGURATION_TEXT.noTargetOption
                }
              />
            </ConfigurationField>

            <button
              type="button"
              onClick={() => onRemoveOutgoingEdge(flowEdge.id)}
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
          onClick={onOpenAddEdgeForm}
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
              onChange={(event) => onDraftConditionChange(event.target.value)}
              placeholderText={
                OUTGOING_EDGE_CONFIGURATION_TEXT.addConditionPlaceholder
              }
              errorMessage={addFormErrors.conditionError}
              errorElementId={
                OUTGOING_EDGE_CONFIGURATION_IDS.addConditionError
              }
            />
          </ConfigurationField>

          <ConfigurationField
            labelText={OUTGOING_EDGE_CONFIGURATION_TEXT.targetLabel}
            errorMessage={addFormErrors.targetError}
            errorElementId={OUTGOING_EDGE_CONFIGURATION_IDS.addTargetError}
          >
            <ConfigurationSelectInput
              selectedValue={draftTargetNodeId}
              onChange={(event) => onDraftTargetChange(event.target.value)}
              options={targetNodeOptions}
              errorMessage={addFormErrors.targetError}
              errorElementId={OUTGOING_EDGE_CONFIGURATION_IDS.addTargetError}
              placeholderOptionLabel={
                OUTGOING_EDGE_CONFIGURATION_TEXT.noTargetOption
              }
            />
          </ConfigurationField>

          <div style={addFormActionContainerStyle}>
            <button
              type="button"
              onClick={onCloseAndResetAddEdgeForm}
              style={rowActionButtonStyle}
            >
              {OUTGOING_EDGE_CONFIGURATION_TEXT.cancelAddButton}
            </button>
            <button
              type="button"
              onClick={onSubmitAddEdgeForm}
              style={rowActionButtonStyle}
            >
              {OUTGOING_EDGE_CONFIGURATION_TEXT.confirmAddButton}
            </button>
          </div>
        </div>
      )}
    </div>
  );
});

export default OutgoingEdgesConfiguration;
