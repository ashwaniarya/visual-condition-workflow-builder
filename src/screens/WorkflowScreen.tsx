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
      <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <aside
        style={{
          width: LAYOUT.nodePaletteWidth,
          flexShrink: 0,
          borderRight: "1px solid #e0e0e0",
          overflowY: "auto",
        }}
      >
        <NodePalette />
      </aside>
      <main style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{ display: "flex", flexDirection: "column", height: "100%" }}
        >
          <CanvasHeader />
          <div style={{ flex: 1 }}>
            <CanvasContainer />
          </div>
          <div style={{ height: WORKFLOW_VIEWER.height }}>
            <WorkflowViewer />
          </div>
        </div>
      </main>
      <aside
        style={{
          width: LAYOUT.configurationPanelWidth,
          flexShrink: 0,
          borderLeft: "1px solid #e0e0e0",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <ConfigurationPanel />
      </aside>
    </div>
    </ReactFlowProvider>
  );
}
