import type { ChangeEventHandler } from "react";
import { TextArea } from "@/ui";

interface ConfigurationTextAreaProps {
  value: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement>;
  placeholderText?: string;
  errorMessage?: string | null;
  errorElementId?: string;
}

export default function ConfigurationTextArea({
  value,
  onChange,
  placeholderText,
  errorMessage,
  errorElementId,
}: ConfigurationTextAreaProps) {
  const errorStateClassName = errorMessage
    ? "border-error-500 focus:ring-error-500 focus:border-error-500"
    : "";

  return (
    <TextArea
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
