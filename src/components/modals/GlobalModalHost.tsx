import type { ReactNode } from "react";
import { GLOBAL_UI_MODAL_TYPES } from "@/constants/globalUi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeGlobalModal } from "@/store/globalUiActionsSlice";
import WorkflowImportModal from "@/components/modals/WorkflowImportModal";
import ClearWorkspaceConfirmModal from "@/components/modals/ClearWorkspaceConfirmModal";
import SimpleMessageModal from "@/components/modals/SimpleMessageModal";

export default function GlobalModalHost() {
  const dispatch = useAppDispatch();
  const activeModal = useAppSelector((state) => state.globalUiActions.activeModal);

  if (!activeModal) {
    return null;
  }

  let modalContent: ReactNode = null;
  if (activeModal.modalType === GLOBAL_UI_MODAL_TYPES.workflowImport) {
    modalContent = <WorkflowImportModal payload={activeModal.payload} />;
  }
  if (activeModal.modalType === GLOBAL_UI_MODAL_TYPES.clearWorkspaceConfirm) {
    modalContent = <ClearWorkspaceConfirmModal payload={activeModal.payload} />;
  }
  if (activeModal.modalType === GLOBAL_UI_MODAL_TYPES.simpleMessage) {
    modalContent = <SimpleMessageModal payload={activeModal.payload} />;
  }

  if (!modalContent) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/35 px-md py-lg md:px-lg md:py-xl"
      onClick={() => dispatch(closeGlobalModal())}
    >
      <div
        className="mx-auto my-auto flex min-h-full w-full items-center justify-center"
        onClick={(event) => event.stopPropagation()}
      >
        {modalContent}
      </div>
    </div>
  );
}
