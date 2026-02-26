import validator from "validator";
import {
  NODE_CONFIG_VALIDATION,
  EDGE_CONFIG_VALIDATION,
  VALIDATION_ERROR_MESSAGES,
} from "@/shared/constants/validationConfig";

export interface NodeConfigValidationResult {
  nameError: string | null;
  descriptionError: string | null;
  isValid: boolean;
}

export interface EdgeConfigValidationResult {
  conditionError: string | null;
  isValid: boolean;
}

/**
 * Sanitizes user input for validation: trims whitespace and removes control characters.
 * Use before validation. Store raw input; escape on display if needed (React escapes by default).
 */
function sanitizeInput(value: string | undefined | null): string {
  const str = String(value ?? "");
  return validator.stripLow(validator.trim(str), true);
}

function resolveLengthError(
  length: number,
  minLength: number,
  maxLength: number,
  requiredMessage: string,
  tooShortMessage: string,
  tooLongMessage: string
): string {
  if (length === 0) return requiredMessage;
  if (length < minLength) return tooShortMessage;
  if (length > maxLength) return tooLongMessage;
  return "";
}

export function validateNodeConfig(
  name: string,
  description: string
): NodeConfigValidationResult {
  const sanitizedName = sanitizeInput(name);
  const sanitizedDescription = sanitizeInput(description);

  const nameError = resolveLengthError(
    sanitizedName.length,
    NODE_CONFIG_VALIDATION.name.minLength,
    NODE_CONFIG_VALIDATION.name.maxLength,
    VALIDATION_ERROR_MESSAGES.node.nameRequired,
    VALIDATION_ERROR_MESSAGES.node.nameTooShort,
    VALIDATION_ERROR_MESSAGES.node.nameTooLong
  );

  const descriptionError = resolveLengthError(
    sanitizedDescription.length,
    NODE_CONFIG_VALIDATION.description.minLength,
    NODE_CONFIG_VALIDATION.description.maxLength,
    VALIDATION_ERROR_MESSAGES.node.descriptionRequired,
    VALIDATION_ERROR_MESSAGES.node.descriptionTooShort,
    VALIDATION_ERROR_MESSAGES.node.descriptionTooLong
  );

  return {
    nameError: nameError || null,
    descriptionError: descriptionError || null,
    isValid: !nameError && !descriptionError,
  };
}

export function validateEdgeCondition(
  condition: string
): EdgeConfigValidationResult {
  const sanitizedCondition = sanitizeInput(condition);

  const conditionError = resolveLengthError(
    sanitizedCondition.length,
    EDGE_CONFIG_VALIDATION.condition.minLength,
    EDGE_CONFIG_VALIDATION.condition.maxLength,
    VALIDATION_ERROR_MESSAGES.edge.conditionRequired,
    VALIDATION_ERROR_MESSAGES.edge.conditionTooShort,
    VALIDATION_ERROR_MESSAGES.edge.conditionTooLong
  );

  return {
    conditionError: conditionError || null,
    isValid: !conditionError,
  };
}
