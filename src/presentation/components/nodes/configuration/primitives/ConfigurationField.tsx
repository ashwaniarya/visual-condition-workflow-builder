import type { ReactNode } from "react";
import { Typography } from "@/design-system/ui";

const CONFIGURATION_FIELD_LAYOUT_CLASS = {
  wrapper: "flex flex-col gap-xs",
  label: "text-neutral-700",
  errorText: "text-error-600",
} as const;

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
    <div className={CONFIGURATION_FIELD_LAYOUT_CLASS.wrapper}>
      <Typography variant="caption" className={CONFIGURATION_FIELD_LAYOUT_CLASS.label}>
        {labelText}
      </Typography>
      {children}
      {errorMessage && (
        <Typography
          variant="caption"
          id={errorElementId}
          role="alert"
          className={CONFIGURATION_FIELD_LAYOUT_CLASS.errorText}
        >
          {errorMessage}
        </Typography>
      )}
    </div>
  );
}
