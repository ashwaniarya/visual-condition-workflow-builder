import { useCallback, useMemo, useState } from "react";
import { useReactFlow } from "reactflow";
import { Button, TextArea, Typography } from "@/ui";
import { setSelection } from "@/store/canvasSlice";
import { useAppDispatch } from "@/store/hooks";
import { closeGlobalModal } from "@/store/globalUiActionsSlice";
import type { WorkflowImportModalPayload } from "@/constants/globalUi";
import {
  WORKFLOW_SERIALIZATION_FLAGS,
  parseWorkflowJson,
  workflowPayloadToFlow,
} from "@/workflow";

interface WorkflowImportModalProps {
  payload: WorkflowImportModalPayload;
}

export default function WorkflowImportModal({ payload }: WorkflowImportModalProps) {
  const dispatch = useAppDispatch();
  const { setNodes, setEdges } = useReactFlow();
  const [jsonTextValue, setJsonTextValue] = useState(payload.initialJsonText ?? "");
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const visibleErrorMessages = useMemo(
    () => errorMessages.slice(0, WORKFLOW_SERIALIZATION_FLAGS.maxValidationErrorsToDisplay),
    [errorMessages]
  );

  const handleImportClick = useCallback(() => {
    const parseResult = parseWorkflowJson(jsonTextValue);

    if (!parseResult.isValid) {
      setErrorMessages(parseResult.errorMessages);
      setStatusMessage("Import failed. Please fix the JSON and retry.");
      return;
    }

    const { nodes, edges } = workflowPayloadToFlow(parseResult.workflowPayload);
    setNodes(nodes);
    setEdges(edges);
    dispatch(setSelection(null));
    dispatch(closeGlobalModal());
  }, [dispatch, jsonTextValue, setEdges, setNodes]);

  const handleCancelClick = useCallback(() => {
    dispatch(closeGlobalModal());
  }, [dispatch]);

  return (
    <div className="w-[min(92vw,64rem)] rounded-xl border border-neutral-200 bg-white p-md md:p-lg shadow-2xl">
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <Typography variant="body" weight="semibold" className="text-neutral-900">
            Import Workflow JSON
          </Typography>
        </div>
        <TextArea
          value={jsonTextValue}
          onChange={(event) => setJsonTextValue(event.target.value)}
          rows={WORKFLOW_SERIALIZATION_FLAGS.jsonPasteRows}
          fullWidth
          placeholder='{"nodes": [], "edges": []}'
        />
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleImportClick}>
            Import
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCancelClick}>
            Cancel
          </Button>
        </div>
        {statusMessage && (
          <Typography variant="caption" className="text-neutral-600">
            {statusMessage}
          </Typography>
        )}
        {visibleErrorMessages.length > 0 && (
          <div className="rounded-md border border-rose-200 bg-rose-50 p-2">
            <Typography variant="caption" weight="semibold" className="mb-1 block text-rose-700">
              Import errors
            </Typography>
            <ul className="space-y-1">
              {visibleErrorMessages.map((errorMessage) => (
                <li key={errorMessage}>
                  <Typography variant="caption" className="text-rose-700">
                    - {errorMessage}
                  </Typography>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
