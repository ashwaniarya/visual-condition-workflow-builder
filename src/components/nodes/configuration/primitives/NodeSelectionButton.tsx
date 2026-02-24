import { configFormNodeButtonStyle } from "@/constants/formStyles";

interface NodeSelectionButtonProps {
  nodeDisplayName: string;
  directionIndicator: "left" | "right";
  onClick: () => void;
  ariaActionLabel: string;
}

const DIRECTION_ICON = {
  left: "←",
  right: "→",
} as const;

export default function NodeSelectionButton({
  nodeDisplayName,
  directionIndicator,
  onClick,
  ariaActionLabel,
}: NodeSelectionButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={configFormNodeButtonStyle}
      aria-label={`${ariaActionLabel}: ${nodeDisplayName}`}
    >
      <span>{nodeDisplayName}</span>
      <span aria-hidden>{DIRECTION_ICON[directionIndicator]}</span>
    </button>
  );
}
