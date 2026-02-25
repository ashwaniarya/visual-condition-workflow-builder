import { useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { useReactFlow, useStore } from "reactflow";
import type { BaseEdge } from "@/model/interface";
import { setSelection } from "@/store/canvasSlice";
import { getNodeDisplayName } from "@/utils/nodeDisplay";
import { validateEdgeCondition } from "@/utils/formValidation";
import ConfigurationField from "@/components/nodes/configuration/primitives/ConfigurationField";
import ConfigurationTextInput from "@/components/nodes/configuration/primitives/ConfigurationTextInput";
import NodeSelectionButton from "@/components/nodes/configuration/primitives/NodeSelectionButton";
import { Typography } from "@/ui";

interface EdgeConfigurationProps {
  selectedEdge: BaseEdge;
}

const EDGE_CONFIGURATION_TEXT = {
  title: "Edge Configuration",
  sourceLabel: "Source",
  sourceSelectionActionLabel: "Select source node",
  conditionLabel: "Condition",
  conditionErrorElementId: "condition-error",
  conditionPlaceholder: "e.g. status === 'approved'",
  targetLabel: "Target",
  targetSelectionActionLabel: "Select target node",
} as const;

export default function EdgeConfiguration({
  selectedEdge,
}: EdgeConfigurationProps) {
  const dispatch = useDispatch();
  const { setEdges } = useReactFlow();
  const nodes = useStore((state) => Array.from(state.nodeInternals.values()));
  const { condition, sourceNodeId, targetNodeId } = selectedEdge;
  const validation = useMemo(
    () => validateEdgeCondition(condition ?? ""),
    [condition],
  );

  const sourceNode = nodes.find((n) => n.data?.baseNode?.id === sourceNodeId)
    ?.data?.baseNode;
  const targetNode = nodes.find((n) => n.data?.baseNode?.id === targetNodeId)
    ?.data?.baseNode;

  const handleConditionChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const newCondition = event.target.value;
      setEdges((eds) =>
        eds.map((e) => {
          if (e.id !== selectedEdge.id) return e;
          const currentBaseEdge = e.data?.baseEdge ?? selectedEdge;
          return {
            ...e,
            data: { baseEdge: { ...currentBaseEdge, condition: newCondition } },
          };
        }),
      );
    },
    [selectedEdge, setEdges],
  );

  const handleSelectSourceNode = () => {
    dispatch(
      setSelection({ selectionType: "node", selectionId: sourceNodeId }),
    );
  };

  const handleSelectTargetNode = () => {
    dispatch(
      setSelection({ selectionType: "node", selectionId: targetNodeId }),
    );
  };

  return (
    <div className="p-4">
      <Typography variant="body" weight="semibold" className="mb-4 text-sm">
        {EDGE_CONFIGURATION_TEXT.title}
      </Typography>
      <div className="flex flex-col gap-3">
        <ConfigurationField labelText={EDGE_CONFIGURATION_TEXT.sourceLabel}>
          <NodeSelectionButton
            directionIndicator="left"
            onClick={handleSelectSourceNode}
            ariaActionLabel={EDGE_CONFIGURATION_TEXT.sourceSelectionActionLabel}
            nodeDisplayName={getNodeDisplayName(sourceNode, sourceNodeId)}
          />
        </ConfigurationField>
        <ConfigurationField
          labelText={EDGE_CONFIGURATION_TEXT.conditionLabel}
          errorMessage={validation.conditionError}
          errorElementId={EDGE_CONFIGURATION_TEXT.conditionErrorElementId}
        >
          <ConfigurationTextInput
            value={condition}
            onChange={handleConditionChange}
            placeholderText={EDGE_CONFIGURATION_TEXT.conditionPlaceholder}
            errorMessage={validation.conditionError}
            errorElementId={EDGE_CONFIGURATION_TEXT.conditionErrorElementId}
          />
        </ConfigurationField>
        <ConfigurationField labelText={EDGE_CONFIGURATION_TEXT.targetLabel}>
          <NodeSelectionButton
            directionIndicator="right"
            onClick={handleSelectTargetNode}
            ariaActionLabel={EDGE_CONFIGURATION_TEXT.targetSelectionActionLabel}
            nodeDisplayName={getNodeDisplayName(targetNode, targetNodeId)}
          />
        </ConfigurationField>
      </div>
    </div>
  );
}
