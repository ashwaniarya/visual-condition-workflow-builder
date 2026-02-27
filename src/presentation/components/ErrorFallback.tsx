import Button from "@/design-system/ui/components/Button";
import Typography from "@/design-system/ui/components/Typography";

export type ErrorFallbackVariant = "fullscreen" | "panel" | "inline";

const ERROR_FALLBACK_COPY = {
  heading: "Something went wrong",
  message: "An unexpected error occurred in this section. You can retry without losing your current session.",
  actionLabel: "Try again",
  reloadLabel: "Reload page",
} as const;

const ERROR_FALLBACK_LAYOUT_CLASSNAME: Record<ErrorFallbackVariant, string> = {
  fullscreen: "min-h-screen w-full flex items-center justify-center bg-background p-6",
  panel: "h-full w-full flex items-center justify-center bg-card p-4",
  inline: "h-full w-full flex items-center justify-center bg-background/40 p-4",
};

const ERROR_FALLBACK_CARD_CLASSNAME: Record<ErrorFallbackVariant, string> = {
  fullscreen: "w-full max-w-lg rounded-lg border border-border bg-card p-6 shadow-sm",
  panel: "w-full max-w-md rounded-lg border border-border bg-card p-4",
  inline: "w-full max-w-md rounded-lg border border-border bg-card p-4",
};

interface ErrorFallbackProps {
  error?: Error | null;
  variant?: ErrorFallbackVariant;
  onRetry: () => void;
}

export default function ErrorFallback({
  error,
  onRetry,
  variant = "inline",
}: ErrorFallbackProps) {
  const isFullscreenVariant = variant === "fullscreen";
  const actionLabel = isFullscreenVariant
    ? ERROR_FALLBACK_COPY.reloadLabel
    : ERROR_FALLBACK_COPY.actionLabel;

  const handleActionClick = () => {
    if (isFullscreenVariant) {
      window.location.reload();
      return;
    }

    onRetry();
  };

  return (
    <div className={ERROR_FALLBACK_LAYOUT_CLASSNAME[variant]} role="alert">
      <div className={ERROR_FALLBACK_CARD_CLASSNAME[variant]}>
        <Typography variant="h4" className="text-destructive">
          {ERROR_FALLBACK_COPY.heading}
        </Typography>
        <Typography variant="body" className="mt-2">
          {ERROR_FALLBACK_COPY.message}
        </Typography>
        {error?.message ? (
          <Typography variant="caption" className="mt-2 block text-muted-foreground">
            {error.message}
          </Typography>
        ) : null}
        <div className="mt-4">
          <Button variant="outline" onClick={handleActionClick}>
            {actionLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
