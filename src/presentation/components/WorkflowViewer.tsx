import { Suspense } from "react";
import WorkFlowValidation from "@/presentation/components/WorkFlowValidation";
import SuspenseFallbackSkeleton from "@/presentation/components/SuspenseFallbackSkeleton";
import { useDeferredLazyImport } from "@/interaction/hooks/useDeferredLazyImport";

export default function WorkflowViewer() {
  const WorkFlowJsonViewer = useDeferredLazyImport(
    () => import("@/presentation/components/WorkFlowJsonViewer")
  );

  return (
    <div className="flex h-full w-full bg-neutral-50/50">
      <WorkFlowValidation />
      <Suspense fallback={<SuspenseFallbackSkeleton variant="jsonViewer" />}>
        <WorkFlowJsonViewer />
      </Suspense>
    </div>
  );
}
