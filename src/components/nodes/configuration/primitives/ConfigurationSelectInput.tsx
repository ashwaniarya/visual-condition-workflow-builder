import type { ChangeEventHandler } from "react";
import {
  configFormInputErrorStyle,
  configFormInputStyle,
} from "@/constants/formStyles";

interface SelectOption {
  optionValue: string;
  optionLabel: string;
}

interface ConfigurationSelectInputProps {
  selectedValue: string;
  onChange: ChangeEventHandler<HTMLSelectElement>;
  options: SelectOption[];
  errorMessage?: string | null;
  errorElementId?: string;
  placeholderOptionLabel?: string;
}

export default function ConfigurationSelectInput({
  selectedValue,
  onChange,
  options,
  errorMessage,
  errorElementId,
  placeholderOptionLabel,
}: ConfigurationSelectInputProps) {
  return (
    <select
      value={selectedValue}
      onChange={onChange}
      style={errorMessage ? configFormInputErrorStyle : configFormInputStyle}
      aria-invalid={!!errorMessage}
      aria-describedby={errorMessage ? errorElementId : undefined}
    >
      {placeholderOptionLabel && <option value="">{placeholderOptionLabel}</option>}
      {options.map((option) => (
        <option key={option.optionValue} value={option.optionValue}>
          {option.optionLabel}
        </option>
      ))}
    </select>
  );
}
