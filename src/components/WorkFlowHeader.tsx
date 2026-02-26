import { useCallback, useMemo, useRef } from "react";
import { useReactFlow } from "reactflow";
import { Download, Upload, FileJson, Network, Trash2 } from "lucide-react";
import { Button, Typography } from "@/ui";
import { setSelection } from "@/store/canvasSlice";
import { useAppDispatch } from "@/store/hooks";
import { openGlobalModal, showGlobalToast } from "@/store/globalUiActionsSlice";
import { GLOBAL_TOAST_VARIANTS, GLOBAL_UI_MODAL_TYPES } from "@/constants/globalUi";
import { CLEAR_WORKSPACE_CONFIG } from "@/constants/clearWorkspaceConfig";
import {
  WORKFLOW_SERIALIZATION_FLAGS,
  downloadWorkflowJsonFile,
  flowToWorkflowPayload,
  parseWorkflowJson,
  readWorkflowFileText,
  serializeWorkflowJson,
  workflowPayloadToFlow,
} from "@/workflow";

export default function WorkFlowHeader() {
  const dispatch = useAppDispatch();
  const { getNodes, getEdges, setNodes, setEdges } = useReactFlow();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const acceptedFileInputValue = useMemo(
    () => [
      ...WORKFLOW_SERIALIZATION_FLAGS.acceptedFileExtensions,
      ...WORKFLOW_SERIALIZATION_FLAGS.acceptedFileMimeTypes,
    ].join(","),
    []
  );

  const applyWorkflowFromJsonText = useCallback(
    (workflowJsonText: string): boolean => {
      const parseResult = parseWorkflowJson(workflowJsonText);

      if (!parseResult.isValid) {
        dispatch(
          showGlobalToast({
            variant: GLOBAL_TOAST_VARIANTS.error,
            title: "Import failed",
            description: `JSON validation errors: ${parseResult.errorMessages.length}.`,
          })
        );
        return false;
      }

      const { nodes, edges } = workflowPayloadToFlow(parseResult.workflowPayload);
      setNodes(nodes);
      setEdges(edges);
      dispatch(setSelection(null));
      dispatch(
        showGlobalToast({
          variant: GLOBAL_TOAST_VARIANTS.success,
          title: "Import completed",
          description: "Workflow loaded successfully.",
        })
      );
      return true;
    },
    [dispatch, setEdges, setNodes]
  );

  const handleExportClick = useCallback(() => {
    const workflowPayload = flowToWorkflowPayload(getNodes(), getEdges());
    const workflowJsonText = serializeWorkflowJson(workflowPayload);
    downloadWorkflowJsonFile(workflowJsonText);
    dispatch(
      showGlobalToast({
        variant: GLOBAL_TOAST_VARIANTS.success,
        title: "Export completed",
        description: "Workflow JSON file downloaded.",
      })
    );
  }, [dispatch, getEdges, getNodes]);

  const handleFileImportClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleClearWorkspaceClick = useCallback(() => {
    dispatch(
      openGlobalModal({
        modalType: GLOBAL_UI_MODAL_TYPES.clearWorkspaceConfirm,
        payload: {},
      })
    );
  }, [dispatch]);

  const handleFileInputChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = event.target.files?.[0];
      if (!selectedFile) {
        return;
      }

      const fileReadResult = await readWorkflowFileText(selectedFile);
      event.target.value = "";

      if (!fileReadResult.isValid) {
        dispatch(
          showGlobalToast({
            variant: GLOBAL_TOAST_VARIANTS.error,
            title: "Import failed",
            description: fileReadResult.errorMessage,
          })
        );
        return;
      }

      applyWorkflowFromJsonText(fileReadResult.fileText);
    },
    [applyWorkflowFromJsonText]
  );

  return (
    <div className="shrink-0 border-b border-neutral-200 bg-white">
      <header className="flex items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-2">
          <Network className="h-4 w-4 text-neutral-500" />
          <Typography variant="body" weight="medium" className="text-sm text-neutral-900">
            Workflow Editor
          </Typography>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFileInputValue}
            className="hidden"
            onChange={handleFileInputChange}
          />
          <Button variant="outline" size="sm" onClick={handleExportClick}>
            <Download className="mr-1 h-3.5 w-3.5" />
            Export
          </Button>
          <Button variant="outline" size="sm" onClick={handleFileImportClick}>
            <Upload className="mr-1 h-3.5 w-3.5" />
            Import File
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              dispatch(
                openGlobalModal({
                  modalType: GLOBAL_UI_MODAL_TYPES.workflowImport,
                  payload: {},
                })
              )
            }
          >
            <FileJson className="mr-1 h-3.5 w-3.5" />
            Import JSON
          </Button>
          <Button variant="outline" size="sm" onClick={handleClearWorkspaceClick}>
            <Trash2 className="mr-1 h-3.5 w-3.5" />
            {CLEAR_WORKSPACE_CONFIG.headerActionButtonLabel}
          </Button>
        </div>
      </header>
    </div>
  );
}

