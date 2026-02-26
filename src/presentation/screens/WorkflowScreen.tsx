import { lazy, Suspense } from "react";
import Split from "react-split";
import { ReactFlowProvider } from "reactflow";
import WorkFlowHeader from "@/presentation/components/WorkFlowHeader";
import NodePalette from "@/presentation/components/NodePalette";
import GlobalToastHost from "@/presentation/components/toast/GlobalToastHost";
import WorkflowViewer from "@/presentation/components/WorkflowViewer";
import SuspenseFallbackSkeleton from "@/presentation/components/SuspenseFallbackSkeleton";
import { SPLIT_LAYOUT } from "@/shared/constants/layout";

const CanvasContainer = lazy(
  () => import("@/interaction/canvas/CanvasContainer")
);
const ConfigurationPanel = lazy(
  () => import("@/presentation/components/ConfigurationPanel")
);
const GlobalModalHost = lazy(
  () => import("@/presentation/components/modals/GlobalModalHost")
);

export default function WorkflowScreen() {
  return (
    <ReactFlowProvider>
      <div className="h-screen w-screen overflow-hidden bg-background">
        <Split
          className="flex h-full w-full"
          sizes={[...SPLIT_LAYOUT.initialSizes.horizontal]}
          minSize={[
            SPLIT_LAYOUT.minSizes.center,
            SPLIT_LAYOUT.minSizes.configurationPanel,
          ]}
          gutterSize={SPLIT_LAYOUT.gutterSize}
          snapOffset={SPLIT_LAYOUT.snapOffset}
          direction="horizontal"
          cursor="col-resize"
        >
          <main className="flex h-full min-w-0 flex-col bg-background/50">
            <WorkFlowHeader />
            <div className="flex-1 overflow-hidden relative">
              <Split
                className="h-full w-full"
                direction="vertical"
                sizes={[...SPLIT_LAYOUT.initialSizes.vertical]}
                minSize={[
                  SPLIT_LAYOUT.minSizes.canvas,
                  SPLIT_LAYOUT.minSizes.workflowViewer,
                ]}
                gutterSize={SPLIT_LAYOUT.gutterSize}
                snapOffset={SPLIT_LAYOUT.snapOffset}
                cursor="row-resize"
              >
                <div className="h-full w-full overflow-hidden relative">
                  <div className="absolute top-4 left-4 z-50 max-h-[calc(100%-2rem)] overflow-y-auto custom-scrollbar">
                    <NodePalette />
                  </div>
                  <Suspense
                    fallback={<SuspenseFallbackSkeleton variant="canvas" />}
                  >
                    <CanvasContainer />
                  </Suspense>
                </div>
                <div className="h-full w-full overflow-hidden bg-card border-t border-border">
                  <WorkflowViewer />
                </div>
              </Split>
            </div>
          </main>

          <aside className="h-full overflow-hidden bg-sidebar border-l border-border">
            <div className="h-full overflow-y-auto">
              <Suspense
                fallback={<SuspenseFallbackSkeleton variant="panel" />}
              >
                <ConfigurationPanel />
              </Suspense>
            </div>
          </aside>
        </Split>
        <Suspense fallback={null}>
          <GlobalModalHost />
        </Suspense>
        <GlobalToastHost />
      </div>
    </ReactFlowProvider>
  );
}
