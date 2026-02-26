import type { ChangeEventHandler } from "react";
import { SelectInput } from "@/design-system/ui";

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
  const errorStateClassName = errorMessage
    ? "border-error-500 focus:ring-error-500 focus:border-error-500"
    : "";

  return (
    <SelectInput
      value={selectedValue}
      onChange={onChange}
      options={options}
      placeholderOptionLabel={placeholderOptionLabel}
      className={errorStateClassName}
      fullWidth
      aria-invalid={!!errorMessage}
      aria-describedby={errorMessage ? errorElementId : undefined}
    />
  );
}
