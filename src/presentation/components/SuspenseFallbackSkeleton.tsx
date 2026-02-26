type SkeletonVariant = "canvas" | "panel" | "jsonViewer";

interface SuspenseFallbackSkeletonProps {
  variant: SkeletonVariant;
}

function DefaultSkeleton({ className }: { className: string }) {
  return (
    <div className={`h-full w-full flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-6 w-6 rounded-full border-2 border-neutral-400 border-t-transparent animate-spin" />
        <div className="h-2 w-24 rounded-full bg-neutral-300/40 animate-pulse" />
      </div>
    </div>
  );
}

function JsonViewerSkeleton() {
  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
      <div className="flex shrink-0 items-center justify-between px-3 py-1.5 border-b border-[#30363d] bg-[#010409]">
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-3.5 rounded bg-neutral-700 animate-pulse" />
          <div className="h-2 w-20 rounded bg-neutral-700 animate-pulse" />
        </div>
        <div className="h-2 w-12 rounded bg-neutral-800 animate-pulse" />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-6 w-6 rounded-full border-2 border-neutral-600 border-t-transparent animate-spin" />
          <div className="h-2 w-24 rounded-full bg-neutral-700/40 animate-pulse" />
        </div>
      </div>
    </div>
  );
}

const VARIANT_MAP: Record<SkeletonVariant, () => React.JSX.Element> = {
  canvas: () => <DefaultSkeleton className="bg-background" />,
  panel: () => <DefaultSkeleton className="bg-sidebar" />,
  jsonViewer: () => <JsonViewerSkeleton />,
};

export default function SuspenseFallbackSkeleton({
  variant,
}: SuspenseFallbackSkeletonProps) {
  return VARIANT_MAP[variant]();
}
