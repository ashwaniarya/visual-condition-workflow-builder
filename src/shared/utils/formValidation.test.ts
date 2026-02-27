import { describe, expect, it } from "vitest";
import {
  EDGE_CONFIG_VALIDATION,
  NODE_CONFIG_VALIDATION,
  VALIDATION_ERROR_MESSAGES,
} from "@/shared/constants/validationConfig";
import { validateEdgeCondition, validateNodeConfig } from "@/shared/utils/formValidation";

describe("formValidation", () => {
  describe("validateNodeConfig", () => {
    it("returns valid for inputs within bounds", () => {
      const result = validateNodeConfig("Task name", "Task description");

      expect(result).toEqual({
        nameError: null,
        descriptionError: null,
        isValid: true,
      });
    });

    it("returns required error when name is empty", () => {
      const result = validateNodeConfig("", "Task description");

      expect(result.nameError).toBe(VALIDATION_ERROR_MESSAGES.node.nameRequired);
      expect(result.isValid).toBe(false);
    });

    it("returns required error when description is empty", () => {
      const result = validateNodeConfig("Task name", "");

      expect(result.descriptionError).toBe(VALIDATION_ERROR_MESSAGES.node.descriptionRequired);
      expect(result.isValid).toBe(false);
    });

    it("returns too long error when name exceeds max length", () => {
      const tooLongName = "n".repeat(NODE_CONFIG_VALIDATION.name.maxLength + 1);
      const result = validateNodeConfig(tooLongName, "Task description");

      expect(result.nameError).toBe(VALIDATION_ERROR_MESSAGES.node.nameTooLong);
      expect(result.isValid).toBe(false);
    });

    it("sanitizes control characters before validating", () => {
      const dirtyName = "\u0007\u0008";
      const result = validateNodeConfig(dirtyName, "Task description");

      expect(result.nameError).toBe(VALIDATION_ERROR_MESSAGES.node.nameRequired);
      expect(result.isValid).toBe(false);
    });

    it("treats whitespace-only name as empty", () => {
      const result = validateNodeConfig("    ", "Task description");

      expect(result.nameError).toBe(VALIDATION_ERROR_MESSAGES.node.nameRequired);
      expect(result.isValid).toBe(false);
    });
  });

  describe("validateEdgeCondition", () => {
    it("returns valid for condition within bounds", () => {
      const result = validateEdgeCondition("If user exists");

      expect(result).toEqual({
        conditionError: null,
        isValid: true,
      });
    });

    it("returns required error when condition is empty", () => {
      const result = validateEdgeCondition("");

      expect(result.conditionError).toBe(VALIDATION_ERROR_MESSAGES.edge.conditionRequired);
      expect(result.isValid).toBe(false);
    });

    it("returns too long error when condition exceeds max length", () => {
      const tooLongCondition = "c".repeat(EDGE_CONFIG_VALIDATION.condition.maxLength + 1);
      const result = validateEdgeCondition(tooLongCondition);

      expect(result.conditionError).toBe(VALIDATION_ERROR_MESSAGES.edge.conditionTooLong);
      expect(result.isValid).toBe(false);
    });

    it("treats control characters as empty after sanitize", () => {
      const dirtyCondition = "\u0000".repeat(EDGE_CONFIG_VALIDATION.condition.minLength);
      const result = validateEdgeCondition(dirtyCondition);

      expect(result.conditionError).toBe(VALIDATION_ERROR_MESSAGES.edge.conditionRequired);
      expect(result.isValid).toBe(false);
    });
  });
});
