import { memo, useMemo } from "react";
import type { BaseNode } from "@/domain/model/interface";
import type { Edge } from "reactflow";
import {
  OUTGOING_EDGE_CONFIGURATION_IDS,
  OUTGOING_EDGE_CONFIGURATION_TEXT,
  OUTGOING_EDGE_CONFIGURATION_UI_POLICY,
} from "@/shared/constants/outgoingEdgeConfiguration";
import { getNodeDisplayName } from "@/shared/utils/nodeDisplay";
import { validateEdgeCondition } from "@/shared/utils/formValidation";
import ConfigurationField from "@/presentation/components/nodes/configuration/primitives/ConfigurationField";
import ConfigurationTextInput from "@/presentation/components/nodes/configuration/primitives/ConfigurationTextInput";
import ConfigurationSelectInput from "./primitives/ConfigurationSelectInput";
import { Button, Typography } from "@/design-system/ui";
import { ArrowRight, Trash2, Plus, Share2, AlertCircle } from "lucide-react";
import { clsx } from "clsx";

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

function truncateNodeLabelPart(
  labelPart: string,
  maximumCharacterCount: number
): string {
  if (labelPart.length <= maximumCharacterCount) {
    return labelPart;
  }

  return `${labelPart.slice(0, maximumCharacterCount - 1)}...`;
}

function buildCompactNodeIdLabel(nodeIdentifier: string): string {
  const maximumCharacterCount =
    OUTGOING_EDGE_CONFIGURATION_UI_POLICY.targetIdMaxCharacters;

  if (nodeIdentifier.length <= maximumCharacterCount) {
    return nodeIdentifier;
  }

  const prefixCharacterCount = Math.max(
    3,
    Math.floor((maximumCharacterCount - 3) / 2)
  );
  const suffixCharacterCount = Math.max(
    2,
    maximumCharacterCount - prefixCharacterCount - 3
  );

  return `${nodeIdentifier.slice(0, prefixCharacterCount)}...${nodeIdentifier.slice(-suffixCharacterCount)}`;
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
  const targetNodeLabelMap = useMemo(
    () =>
      Object.fromEntries(
        validTargetNodes.map((targetNode) => {
          const rawNodeName = getNodeDisplayName(targetNode, targetNode.id);
          const nodeNameForLabel = truncateNodeLabelPart(
            rawNodeName,
            OUTGOING_EDGE_CONFIGURATION_UI_POLICY.targetNameMaxCharacters
          );
          const nodeIdForLabel = buildCompactNodeIdLabel(targetNode.id);
          const optionLabel = nodeIdForLabel
            ? `${nodeNameForLabel}${OUTGOING_EDGE_CONFIGURATION_UI_POLICY.targetLabelSeparator}${nodeIdForLabel}`
            : nodeNameForLabel;

          return [targetNode.id, optionLabel];
        })
      ),
    [validTargetNodes]
  );

  const targetNodeOptions = useMemo(
    () =>
      validTargetNodes.map((targetNode) => ({
        optionValue: targetNode.id,
        optionLabel: targetNodeLabelMap[targetNode.id] ?? targetNode.id,
      })),
    [targetNodeLabelMap, validTargetNodes]
  );

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2 text-neutral-600">
        <Share2 className="w-4 h-4" />
        <Typography variant="caption" weight="semibold">
          {OUTGOING_EDGE_CONFIGURATION_TEXT.title}
        </Typography>
      </div>

      {outgoingFlowEdges.length === 0 && !isAddEdgeFormVisible && (
        <div className="flex flex-col items-center justify-center py-6 px-4 rounded-lg border border-dashed border-neutral-200 bg-neutral-50/50">
          <Typography variant="caption" className="text-neutral-500 text-center mb-2">
            {OUTGOING_EDGE_CONFIGURATION_TEXT.emptyState}
          </Typography>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onOpenAddEdgeForm}
            disabled={validTargetNodes.length === 0}
            className="h-8 text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Flow
          </Button>
        </div>
      )}

      {/* Existing Edges List */}
      {outgoingFlowEdges.length > 0 && (
        <div className="flex flex-col gap-2">
          {outgoingFlowEdges.map((flowEdge) => {
            const baseEdge = flowEdge.data?.baseEdge;
            if (!baseEdge) return null;
            const rowConditionValidation = validateEdgeCondition(
              baseEdge.condition ?? ""
            );
            const hasError = !!rowConditionValidation.conditionError;

            return (
              <div
                key={flowEdge.id}
                className={clsx(
                  `flex items-center ${OUTGOING_EDGE_CONFIGURATION_UI_POLICY.rowContentGapClassName} ${OUTGOING_EDGE_CONFIGURATION_UI_POLICY.rowContainerPaddingClassName} rounded-md border bg-white transition-all duration-200`,
                  hasError ? "border-red-200 shadow-sm" : "border-neutral-200 hover:border-neutral-300"
                )}
              >
                {/* Condition Input */}
                <div className="relative min-w-0 flex-[1_1_0]">
                  <input
                    type="text"
                    value={baseEdge.condition ?? ""}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                      onUpdateOutgoingEdgeCondition(flowEdge.id, event.target.value)
                    }
                    placeholder="Condition..."
                    className={clsx(
                      `w-full min-w-0 ${OUTGOING_EDGE_CONFIGURATION_UI_POLICY.rowControlHeightClassName} ${OUTGOING_EDGE_CONFIGURATION_UI_POLICY.rowControlHorizontalPaddingClassName} ${OUTGOING_EDGE_CONFIGURATION_UI_POLICY.rowControlTextSizeClassName} rounded border-0 bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-neutral-200 placeholder:text-neutral-400 transition-colors`,
                      hasError && "bg-red-50 text-red-900 placeholder:text-red-300"
                    )}
                  />
                  {hasError && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" title={rowConditionValidation.conditionError || ""}>
                      <AlertCircle className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <ArrowRight className="w-3.5 h-3.5 text-neutral-300 shrink-0" />

                {/* Target Select */}
                <div className="min-w-0 flex-[1_1_0]">
                  <select
                    value={baseEdge.targetNodeId}
                    onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                      onUpdateOutgoingEdgeTarget(flowEdge.id, event.target.value)
                    }
                    title={targetNodeLabelMap[baseEdge.targetNodeId] ?? baseEdge.targetNodeId}
                    className={clsx(
                      `w-full min-w-0 ${OUTGOING_EDGE_CONFIGURATION_UI_POLICY.rowControlHeightClassName} ${OUTGOING_EDGE_CONFIGURATION_UI_POLICY.rowControlHorizontalPaddingClassName} ${OUTGOING_EDGE_CONFIGURATION_UI_POLICY.rowControlTextSizeClassName} pr-5 rounded border-0 bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-neutral-200 text-neutral-700 cursor-pointer transition-colors appearance-none truncate whitespace-nowrap overflow-hidden text-ellipsis`
                    )}
                  >
                    <option value="" disabled>Select target...</option>
                    {targetNodeOptions.map((opt) => (
                      <option key={opt.optionValue} value={opt.optionValue}>
                        {opt.optionLabel}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delete Button */}
                <button
                  type="button"
                  onClick={() => onRemoveOutgoingEdge(flowEdge.id)}
                  className={clsx(
                    `shrink-0 ${OUTGOING_EDGE_CONFIGURATION_UI_POLICY.rowDeleteButtonPaddingClassName} text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors`
                  )}
                  title={OUTGOING_EDGE_CONFIGURATION_TEXT.removeEdgeButton}
                >
                  <Trash2 className={OUTGOING_EDGE_CONFIGURATION_UI_POLICY.rowDeleteIconSizeClassName} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Edge Button (if edges exist and form not visible) */}
      {outgoingFlowEdges.length > 0 && !isAddEdgeFormVisible && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={onOpenAddEdgeForm}
          disabled={validTargetNodes.length === 0}
          className="self-start text-neutral-500 hover:text-neutral-800 h-8 px-2"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          {OUTGOING_EDGE_CONFIGURATION_TEXT.addEdgeButton}
        </Button>
      )}

      {/* Add Edge Form */}
      {isAddEdgeFormVisible && (
        <div className="flex flex-col gap-3 p-3 rounded-lg border border-neutral-200 bg-neutral-50/50 mt-1 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between">
            <Typography variant="caption" weight="semibold" className="text-neutral-700">
              New Flow
            </Typography>
            <button onClick={onCloseAndResetAddEdgeForm} className="text-neutral-400 hover:text-neutral-600">
              <span className="sr-only">Close</span>
              {/* Could use an X icon here if needed, but text buttons below handle it */}
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <ConfigurationField
              labelText={OUTGOING_EDGE_CONFIGURATION_TEXT.conditionLabel}
              errorMessage={addFormErrors.conditionError}
              errorElementId={OUTGOING_EDGE_CONFIGURATION_IDS.addConditionError}
            >
              <ConfigurationTextInput
                value={draftConditionText}
                onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                  onDraftConditionChange(event.target.value)
                }
                placeholderText="e.g., status == 'approved'"
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
                onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
                  onDraftTargetChange(event.target.value)
                }
                options={targetNodeOptions}
                errorMessage={addFormErrors.targetError}
                errorElementId={OUTGOING_EDGE_CONFIGURATION_IDS.addTargetError}
                placeholderOptionLabel={OUTGOING_EDGE_CONFIGURATION_TEXT.noTargetOption}
              />
            </ConfigurationField>
          </div>

          <div className="flex gap-2 justify-end mt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCloseAndResetAddEdgeForm}
              className="text-neutral-500"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={onSubmitAddEdgeForm}
            >
              Add Flow
            </Button>
          </div>
        </div>
      )}
    </div>
  );
});

export default OutgoingEdgesConfiguration;
