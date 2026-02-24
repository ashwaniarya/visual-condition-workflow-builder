import type { ChangeEventHandler } from "react";
import {
  configFormInputErrorStyle,
  configFormInputStyle,
} from "@/constants/formStyles";

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
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      placeholder={placeholderText}
      style={errorMessage ? configFormInputErrorStyle : configFormInputStyle}
      aria-invalid={!!errorMessage}
      aria-describedby={errorMessage ? errorElementId : undefined}
    />
  );
}
