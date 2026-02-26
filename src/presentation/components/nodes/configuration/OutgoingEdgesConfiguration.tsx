import { memo, useMemo } from "react";
import type { BaseNode } from "@/domain/model/interface";
import type { Edge } from "reactflow";
import {
  OUTGOING_EDGE_CONFIGURATION_IDS,
  OUTGOING_EDGE_CONFIGURATION_TEXT,
} from "@/shared/constants/outgoingEdgeConfiguration";
import { getNodeDisplayName } from "@/shared/utils/nodeDisplay";
import { validateEdgeCondition } from "@/shared/utils/formValidation";
import ConfigurationField from "@/presentation/components/nodes/configuration/primitives/ConfigurationField";
import ConfigurationTextInput from "@/presentation/components/nodes/configuration/primitives/ConfigurationTextInput";
import ConfigurationSelectInput from "@/presentation/components/nodes/configuration/primitives/ConfigurationSelectInput";
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
                  "group flex items-center gap-2 p-1.5 rounded-md border bg-white transition-all duration-200",
                  hasError ? "border-red-200 shadow-sm" : "border-neutral-200 hover:border-neutral-300"
                )}
              >
                {/* Condition Input */}
                <div className="flex-1 relative min-w-[100px]">
                  <input
                    type="text"
                    value={baseEdge.condition ?? ""}
                    onChange={(e) => onUpdateOutgoingEdgeCondition(flowEdge.id, e.target.value)}
                    placeholder="Condition..."
                    className={clsx(
                      "w-full h-8 px-2 text-sm rounded border-0 bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-neutral-200 placeholder:text-neutral-400 transition-colors",
                      hasError && "bg-red-50 text-red-900 placeholder:text-red-300"
                    )}
                  />
                  {hasError && (
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 text-red-500" title={rowConditionValidation.conditionError || ""}>
                      <AlertCircle className="w-3.5 h-3.5" />
                    </div>
                  )}
                </div>

                <ArrowRight className="w-4 h-4 text-neutral-300 shrink-0" />

                {/* Target Select */}
                <div className="flex-1 min-w-[120px]">
                  <select
                    value={baseEdge.targetNodeId}
                    onChange={(e) => onUpdateOutgoingEdgeTarget(flowEdge.id, e.target.value)}
                    className="w-full h-8 px-2 text-sm rounded border-0 bg-neutral-50 focus:bg-white focus:ring-1 focus:ring-neutral-200 text-neutral-700 cursor-pointer transition-colors appearance-none"
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
                  className="p-1.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title={OUTGOING_EDGE_CONFIGURATION_TEXT.removeEdgeButton}
                >
                  <Trash2 className="w-4 h-4" />
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
                onChange={(event) => onDraftConditionChange(event.target.value)}
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
                onChange={(event) => onDraftTargetChange(event.target.value)}
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
