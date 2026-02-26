/** Centralised validation rules and messages for node/edge configuration forms */

export const NODE_CONFIG_VALIDATION = {
  name: {
    minLength: 1,
    maxLength: 128,
    required: true,
  },
  description: {
    minLength: 1,
    maxLength: 512,
    required: true,
  },
} as const;

export const EDGE_CONFIG_VALIDATION = {
  condition: {
    minLength: 1,
    maxLength: 256,
    required: true,
  },
} as const;

export const VALIDATION_ERROR_MESSAGES = {
  node: {
    nameRequired: "Name is required.",
    nameTooShort: `Name must be at least ${NODE_CONFIG_VALIDATION.name.minLength} character(s).`,
    nameTooLong: `Name must not exceed ${NODE_CONFIG_VALIDATION.name.maxLength} characters.`,
    descriptionRequired: "Description is required.",
    descriptionTooShort: `Description must be at least ${NODE_CONFIG_VALIDATION.description.minLength} character(s).`,
    descriptionTooLong: `Description must not exceed ${NODE_CONFIG_VALIDATION.description.maxLength} characters.`,
  },
  edge: {
    conditionRequired: "Condition is required.",
    conditionTooShort: `Condition must be at least ${EDGE_CONFIG_VALIDATION.condition.minLength} character(s).`,
    conditionTooLong: `Condition must not exceed ${EDGE_CONFIG_VALIDATION.condition.maxLength} characters.`,
  },
} as const;
