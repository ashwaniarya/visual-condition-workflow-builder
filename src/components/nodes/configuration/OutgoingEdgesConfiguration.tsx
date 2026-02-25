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
import { Button, Typography } from "@/ui";

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
    <div className="flex flex-col gap-3">
      <Typography variant="caption" weight="semibold" className="mt-1">
        {OUTGOING_EDGE_CONFIGURATION_TEXT.title}
      </Typography>

      {outgoingFlowEdges.length === 0 && (
        <Typography variant="caption" className="text-neutral-500">
          {OUTGOING_EDGE_CONFIGURATION_TEXT.emptyState}
        </Typography>
      )}

      {outgoingFlowEdges.map((flowEdge) => {
        const baseEdge = flowEdge.data?.baseEdge;
        if (!baseEdge) return null;
        const rowConditionValidation = validateEdgeCondition(
          baseEdge.condition ?? ""
        );
        return (
          <div
            key={flowEdge.id}
            className="flex flex-col gap-2 rounded-md border border-neutral-200 p-2"
          >
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

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onRemoveOutgoingEdge(flowEdge.id)}
              className="self-start"
            >
              {OUTGOING_EDGE_CONFIGURATION_TEXT.removeEdgeButton}
            </Button>
          </div>
        );
      })}

      {!isAddEdgeFormVisible && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenAddEdgeForm}
          disabled={validTargetNodes.length === 0}
          title={
            validTargetNodes.length === 0
              ? OUTGOING_EDGE_CONFIGURATION_TEXT.noValidTargetNodes
              : undefined
          }
          className="self-start"
        >
          {OUTGOING_EDGE_CONFIGURATION_TEXT.addEdgeButton}
        </Button>
      )}

      {isAddEdgeFormVisible && (
        <div className="flex flex-col gap-2 rounded-md border border-neutral-200 p-2">
          <Typography variant="caption" className="text-neutral-500">
            {OUTGOING_EDGE_CONFIGURATION_TEXT.addFormHint}
          </Typography>

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

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCloseAndResetAddEdgeForm}
            >
              {OUTGOING_EDGE_CONFIGURATION_TEXT.cancelAddButton}
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onSubmitAddEdgeForm}
            >
              {OUTGOING_EDGE_CONFIGURATION_TEXT.confirmAddButton}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

export default OutgoingEdgesConfiguration;
