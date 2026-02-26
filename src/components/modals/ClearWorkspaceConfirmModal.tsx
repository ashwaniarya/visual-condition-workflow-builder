import { useCallback } from "react";
import { useReactFlow } from "reactflow";
import { GLOBAL_TOAST_VARIANTS } from "@/constants/globalUi";
import type { ClearWorkspaceConfirmModalPayload } from "@/constants/globalUi";
import { setSelection } from "@/store/canvasSlice";
import { useAppDispatch } from "@/store/hooks";
import { closeGlobalModal, showGlobalToast } from "@/store/globalUiActionsSlice";
import { Button, Typography } from "@/ui";
import { CLEAR_WORKSPACE_CONFIG } from "@/constants/clearWorkspaceConfig";
import { createInitialWorkflowNodes } from "@/constants/initialWorkflowNodes";

interface ClearWorkspaceConfirmModalProps {
  payload: ClearWorkspaceConfirmModalPayload;
}

export default function ClearWorkspaceConfirmModal({ payload }: ClearWorkspaceConfirmModalProps) {
  void payload;
  const dispatch = useAppDispatch();
  const { setNodes, setEdges } = useReactFlow();

  const handleCancelClick = useCallback(() => {
    dispatch(closeGlobalModal());
  }, [dispatch]);

  const handleConfirmClick = useCallback(() => {
    setNodes(createInitialWorkflowNodes());
    setEdges([]);
    dispatch(setSelection(null));
    dispatch(closeGlobalModal());
    dispatch(
      showGlobalToast({
        variant: GLOBAL_TOAST_VARIANTS.success,
        title: CLEAR_WORKSPACE_CONFIG.successToastTitle,
        description: CLEAR_WORKSPACE_CONFIG.successToastDescription,
      })
    );
  }, [dispatch, setEdges, setNodes]);

  return (
    <div className="w-[min(92vw,32rem)] rounded-xl border border-neutral-200 bg-white p-md md:p-lg shadow-2xl">
      <div className="space-y-4">
        <div className="space-y-2">
          <Typography variant="body" weight="semibold" className="text-neutral-900">
            {CLEAR_WORKSPACE_CONFIG.modalTitle}
          </Typography>
          <Typography variant="caption" className="text-neutral-600">
            {CLEAR_WORKSPACE_CONFIG.modalDescription}
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleCancelClick}>
            {CLEAR_WORKSPACE_CONFIG.cancelButtonLabel}
          </Button>
          <Button variant="secondary" size="sm" onClick={handleConfirmClick}>
            {CLEAR_WORKSPACE_CONFIG.confirmButtonLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
