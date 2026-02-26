export const GLOBAL_UI_MODAL_TYPES = {
  workflowImport: "workflowImport",
  clearWorkspaceConfirm: "clearWorkspaceConfirm",
  simpleMessage: "simpleMessage",
} as const;

export type GlobalUiModalType = (typeof GLOBAL_UI_MODAL_TYPES)[keyof typeof GLOBAL_UI_MODAL_TYPES];

export const GLOBAL_TOAST_VARIANTS = {
  success: "success",
  error: "error",
  info: "info",
  warning: "warning",
} as const;

export type GlobalToastVariant =
  (typeof GLOBAL_TOAST_VARIANTS)[keyof typeof GLOBAL_TOAST_VARIANTS];

export interface GlobalToastPayload {
  variant: GlobalToastVariant;
  title: string;
  description?: string;
  durationMs?: number;
}

export interface GlobalToastEvent extends GlobalToastPayload {
  eventId: string;
}

export interface WorkflowImportModalPayload {
  initialJsonText?: string;
}

export type ClearWorkspaceConfirmModalPayload = Record<string, never>;

export interface SimpleMessageModalPayload {
  title: string;
  message: string;
  actionLabel?: string;
}

export interface GlobalUiModalPayloadMap {
  workflowImport: WorkflowImportModalPayload;
  clearWorkspaceConfirm: ClearWorkspaceConfirmModalPayload;
  simpleMessage: SimpleMessageModalPayload;
}

export type GlobalUiModalState = {
  [ModalTypeKey in GlobalUiModalType]: {
    modalType: ModalTypeKey;
    payload: GlobalUiModalPayloadMap[ModalTypeKey];
  };
}[GlobalUiModalType];
