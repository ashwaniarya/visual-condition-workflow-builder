import { ReactFlowProvider } from "reactflow";
import CanvasContainer from "@/canvas/CanvasContainer";
import CanvasHeader from "@/components/CanvasHeader";
import ConfigurationPanel from "@/components/ConfigurationPanel";
import NodePalette from "@/components/NodePalette";
import WorkflowViewer from "@/components/WorkflowViewer";
import { LAYOUT, WORKFLOW_VIEWER } from "@/constants/layout";

export default function WorkflowScreen() {
  return (
    <ReactFlowProvider>
      <div className="flex h-screen overflow-hidden">
        <aside
          className="shrink-0 overflow-y-auto border-r border-neutral-200"
          style={{ width: LAYOUT.nodePaletteWidth }}
        >
          <NodePalette />
        </aside>
        <main className="min-w-0 flex-1">
          <div className="flex h-full flex-col">
            <CanvasHeader />
            <div className="flex-1">
              <CanvasContainer />
            </div>
            <div
              className="overflow-hidden"
              style={{ height: WORKFLOW_VIEWER.height }}
            >
              <WorkflowViewer />
            </div>
          </div>
        </main>
        <aside
          className="flex shrink-0 flex-col overflow-hidden border-l border-neutral-200"
          style={{ width: LAYOUT.configurationPanelWidth }}
        >
          <ConfigurationPanel />
        </aside>
      </div>
    </ReactFlowProvider>
  );
}
