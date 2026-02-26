import { Button } from "@/design-system/ui";

const NODE_SELECTION_BUTTON_STYLE_CLASS = {
  root: "w-full justify-between",
  icon: "ml-sm text-neutral-500",
} as const;

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
    <Button
      onClick={onClick}
      variant="outline"
      size="sm"
      className={NODE_SELECTION_BUTTON_STYLE_CLASS.root}
      aria-label={`${ariaActionLabel}: ${nodeDisplayName}`}
    >
      <span>{nodeDisplayName}</span>
      <span aria-hidden className={NODE_SELECTION_BUTTON_STYLE_CLASS.icon}>
        {DIRECTION_ICON[directionIndicator]}
      </span>
    </Button>
  );
}
