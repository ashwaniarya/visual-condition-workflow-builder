import { WORKFLOW_SERIALIZATION_FLAGS } from "@/workflow/constants/workflowSerializationFlags";

export type ReadWorkflowFileTextResult =
  | { isValid: true; fileText: string }
  | { isValid: false; errorMessage: string };

function isAcceptedFileName(fileName: string): boolean {
  const normalizedFileName = fileName.toLowerCase();
  return WORKFLOW_SERIALIZATION_FLAGS.acceptedFileExtensions.some((fileExtension) =>
    normalizedFileName.endsWith(fileExtension)
  );
}

function isAcceptedMimeType(fileMimeType: string): boolean {
  if (!fileMimeType) {
    return true;
  }

  return (WORKFLOW_SERIALIZATION_FLAGS.acceptedFileMimeTypes as readonly string[]).includes(fileMimeType);
}

function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onload = () => {
      resolve(String(fileReader.result ?? ""));
    };
    fileReader.onerror = () => {
      reject(new Error("Failed to read file content."));
    };
    fileReader.readAsText(file);
  });
}

export async function readWorkflowFileText(file: File): Promise<ReadWorkflowFileTextResult> {
  if (file.size > WORKFLOW_SERIALIZATION_FLAGS.maxImportFileSizeBytes) {
    return {
      isValid: false,
      errorMessage: `File is too large. Max allowed size is ${WORKFLOW_SERIALIZATION_FLAGS.maxImportFileSizeBytes} bytes.`,
    };
  }

  if (!isAcceptedFileName(file.name)) {
    return {
      isValid: false,
      errorMessage: "Only .json files are accepted.",
    };
  }

  if (!isAcceptedMimeType(file.type)) {
    return {
      isValid: false,
      errorMessage: `Unsupported file type: '${file.type}'.`,
    };
  }

  try {
    const fileText = await readFileAsText(file);
    return {
      isValid: true,
      fileText,
    };
  } catch (error) {
    const fallbackMessage = "Failed to read import file.";
    return {
      isValid: false,
      errorMessage: error instanceof Error ? error.message : fallbackMessage,
    };
  }
}

