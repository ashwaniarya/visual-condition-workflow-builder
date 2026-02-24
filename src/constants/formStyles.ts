/**
 * Shared styles for configuration form inputs (NodeConfiguration, EdgeConfiguration)
 */
export const configFormInputStyle = {
  width: "100%",
  padding: 8,
  border: "1px solid #e0e0e0",
  borderRadius: 4,
} as const;

export const configFormInputErrorStyle = {
  ...configFormInputStyle,
  borderColor: "#dc2626",
  borderWidth: "1px",
  borderStyle: "solid",
} as const;

export const configFormLabelStyle = {
  display: "block" as const,
  fontSize: 12,
  marginBottom: 4,
};

export const configFormErrorTextStyle: React.CSSProperties = {
  fontSize: 11,
  color: "#dc2626",
  marginTop: 4,
};

export const configFormNodeButtonStyle: React.CSSProperties = {
  width: "100%",
  padding: "4px 8px",
  border: "1px solid #e0e0e0",
  borderRadius: 4,
  background: "#fff",
  cursor: "pointer",
  fontSize: 12,
  textAlign: "left",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};
