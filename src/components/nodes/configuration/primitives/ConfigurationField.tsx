import type { ReactNode } from "react";
import {
  configFormErrorTextStyle,
  configFormLabelStyle,
} from "@/constants/formStyles";

interface ConfigurationFieldProps {
  labelText: string;
  children: ReactNode;
  errorMessage?: string | null;
  errorElementId?: string;
}

export default function ConfigurationField({
  labelText,
  children,
  errorMessage,
  errorElementId,
}: ConfigurationFieldProps) {
  return (
    <div>
      <label style={configFormLabelStyle}>{labelText}</label>
      {children}
      {errorMessage && (
        <span
          id={errorElementId}
          role="alert"
          style={configFormErrorTextStyle}
        >
          {errorMessage}
        </span>
      )}
    </div>
  );
}
