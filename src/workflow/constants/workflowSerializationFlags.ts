export const WORKFLOW_SERIALIZATION_FLAGS = {
  jsonIndentSpaces: 2,
  defaultExportFileNamePrefix: "workflow",
  downloadMimeType: "application/json",
  acceptedFileExtensions: [".json"],
  acceptedFileMimeTypes: ["application/json", "text/json"],
  maxImportFileSizeBytes: 2 * 1024 * 1024,
  jsonPasteRows: 10,
  maxValidationErrorsToDisplay: 5,
} as const;

