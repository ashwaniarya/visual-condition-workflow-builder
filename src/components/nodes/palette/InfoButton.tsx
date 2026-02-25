import { Tooltip, IconButton } from "@/ui";

interface InfoButtonProps {
  message: string;
}

export default function InfoButton({ message }: InfoButtonProps) {
  return (
    <Tooltip contentText={message} position="right">
      <IconButton
        icon={<span className="text-xs font-bold">i</span>}
        variant="neutral"
        iconButtonSize="sm"
        aria-label="Info"
      />
    </Tooltip>
  );
}
