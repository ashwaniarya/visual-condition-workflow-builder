import WorkFlowJsonViewer from "@/components/WorkFlowJsonViewer";
import WorkFlowValidation from "@/components/WorkFlowValidation";

export default function WorkflowViewer() {
  return (
    <div className="flex h-full w-full bg-neutral-50/50">
      <WorkFlowValidation />
      <WorkFlowJsonViewer />
    </div>
  );
}
