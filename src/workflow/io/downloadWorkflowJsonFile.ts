import { WORKFLOW_SERIALIZATION_FLAGS } from "@/workflow/constants/workflowSerializationFlags";

function buildExportFileName(): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  return `${WORKFLOW_SERIALIZATION_FLAGS.defaultExportFileNamePrefix}-${timestamp}.json`;
}

export function downloadWorkflowJsonFile(workflowJsonText: string): void {
  const exportBlob = new Blob([workflowJsonText], {
    type: WORKFLOW_SERIALIZATION_FLAGS.downloadMimeType,
  });
  const downloadObjectUrl = URL.createObjectURL(exportBlob);
  const downloadAnchorElement = document.createElement("a");

  downloadAnchorElement.href = downloadObjectUrl;
  downloadAnchorElement.download = buildExportFileName();
  downloadAnchorElement.click();

  URL.revokeObjectURL(downloadObjectUrl);
}

