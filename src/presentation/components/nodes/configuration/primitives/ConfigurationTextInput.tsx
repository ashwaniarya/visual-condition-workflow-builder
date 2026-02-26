import type { ChangeEventHandler } from "react";
import { TextInput } from "@/design-system/ui";

interface ConfigurationTextInputProps {
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  placeholderText?: string;
  errorMessage?: string | null;
  errorElementId?: string;
}

export default function ConfigurationTextInput({
  value,
  onChange,
  placeholderText,
  errorMessage,
  errorElementId,
}: ConfigurationTextInputProps) {
  const errorStateClassName = errorMessage
    ? "border-error-500 focus:ring-error-500 focus:border-error-500"
    : "";

  return (
    <TextInput
      value={value}
      onChange={onChange}
      placeholder={placeholderText}
      className={errorStateClassName}
      fullWidth
      aria-invalid={!!errorMessage}
      aria-describedby={errorMessage ? errorElementId : undefined}
    />
  );
}
