import { useSelector } from "react-redux";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  CircleDot,
  GitCommitHorizontal,
} from "lucide-react";
import { clsx } from "clsx";
import {
  useCanvasFocusSelection,
  useValidationIssueList,
} from "@/interaction/canvas/hooks";
import { VALIDATION_ISSUES_VIEWER } from "@/shared/constants/validationIssues";
import type { ValidationIssue } from "@/domain/model/validationIssue";
import type { RootState } from "@/state/store";
import { Typography } from "@/design-system/ui";

function getStatusIcon(workflowState: RootState["canvas"]["workflowState"]) {
  switch (workflowState) {
    case "VALID":
      return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    case "BROKEN":
      return <AlertTriangle className="h-5 w-5 text-rose-500" />;
    case "EMPTY":
    default:
      return <AlertCircle className="h-5 w-5 text-neutral-400" />;
  }
}

function getStatusColor(workflowState: RootState["canvas"]["workflowState"]) {
  switch (workflowState) {
    case "VALID":
      return "bg-emerald-50 border-emerald-200";
    case "BROKEN":
      return "bg-rose-50 border-rose-200";
    case "EMPTY":
    default:
      return "bg-neutral-50 border-neutral-200";
  }
}

export default function WorkFlowValidation() {
  const workflowState = useSelector((state: RootState) => state.canvas.workflowState);
  const workflowStateMessage = useSelector((state: RootState) => state.canvas.workflowStateMessage);
  const selected = useSelector((state: RootState) => state.canvas.selected);
  const { nodeIssues, edgeIssues, totalIssueCount } = useValidationIssueList();
  const { focusValidationIssue } = useCanvasFocusSelection();

  const isIssueSelected = (validationIssue: ValidationIssue): boolean => {
    if (!selected) {
      return false;
    }

    if (validationIssue.issueType === "node") {
      return selected.selectionType === "node" && selected.selectionId === validationIssue.nodeId;
    }

    return selected.selectionType === "edge" && selected.selectionId === validationIssue.edgeId;
  };

  return (
    <div className="w-[320px] min-w-[280px] border-r border-neutral-200 bg-white flex flex-col">
      <div className="flex items-center gap-1.5 px-3 py-2 border-b border-neutral-100 bg-neutral-50/50">
        <CheckCircle2 className="h-3.5 w-3.5 text-neutral-500" />
        <Typography variant="caption" weight="bold" className="text-neutral-500 uppercase tracking-wider text-[9px] md:text-[9px]">
          {VALIDATION_ISSUES_VIEWER.sectionTitle}
        </Typography>
      </div>

      <div className="p-3 overflow-y-auto custom-scrollbar">
        <div className={clsx("rounded-md border p-2.5 flex items-start gap-2", getStatusColor(workflowState))}>
          <div className="shrink-0 mt-0.5">{getStatusIcon(workflowState)}</div>
          <div className="space-y-0.5 min-w-0">
            <Typography variant="caption" weight="semibold" className="text-[11px] md:text-[11px] text-neutral-800">
              {workflowState === "VALID" ? "All checks passed" : "Validation Issues"}
            </Typography>
            <Typography variant="caption" className="text-[11px] md:text-[11px] text-neutral-600 leading-snug block">
              {workflowStateMessage}
            </Typography>
          </div>
        </div>

        <div className="mt-3 rounded-md border border-neutral-200 bg-white">
          <div className="flex items-center justify-between border-b border-neutral-100 px-2.5 py-1.5">
            <Typography variant="caption" weight="bold" className="text-neutral-500 uppercase tracking-wider text-[9px] md:text-[9px]">
              Invalid Graph Items
            </Typography>
            <Typography variant="caption" className="text-[10px] md:text-[10px] text-neutral-500">
              {totalIssueCount} {VALIDATION_ISSUES_VIEWER.issueCountLabel}
            </Typography>
          </div>

          <div className="p-2.5 space-y-2.5">
            <div className="space-y-1.5">
              <Typography variant="caption" weight="semibold" className="text-[10px] md:text-[10px] uppercase tracking-wide text-neutral-600">
                {VALIDATION_ISSUES_VIEWER.invalidNodesTitle}
              </Typography>
              {nodeIssues.length === 0 ? (
                <Typography variant="caption" className="text-[10px] md:text-[10px] text-neutral-400">
                  {VALIDATION_ISSUES_VIEWER.noInvalidNodesMessage}
                </Typography>
              ) : (
                <div className="space-y-1.5">
                  {nodeIssues.map((nodeIssue) => (
                    <button
                      key={nodeIssue.issueId}
                      type="button"
                      onClick={() => focusValidationIssue(nodeIssue)}
                      className={clsx(
                        "w-full text-left rounded-md border px-2 py-1.5 transition-colors",
                        isIssueSelected(nodeIssue)
                          ? "border-rose-300 bg-rose-50"
                          : "border-rose-200 bg-rose-50/40 hover:bg-rose-50"
                      )}
                    >
                      <div className="flex items-start gap-1.5">
                        <CircleDot className="h-3 w-3 text-rose-500 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <Typography variant="caption" weight="semibold" className="text-[11px] md:text-[11px] text-neutral-800 block truncate">
                            {nodeIssue.nodeDisplayName}
                          </Typography>
                          <Typography variant="caption" className="text-[10px] md:text-[10px] text-rose-700 block leading-snug">
                            {nodeIssue.reason}
                          </Typography>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-1.5">
              <Typography variant="caption" weight="semibold" className="text-[10px] md:text-[10px] uppercase tracking-wide text-neutral-600">
                {VALIDATION_ISSUES_VIEWER.invalidEdgesTitle}
              </Typography>
              {edgeIssues.length === 0 ? (
                <Typography variant="caption" className="text-[10px] md:text-[10px] text-neutral-400">
                  {VALIDATION_ISSUES_VIEWER.noInvalidEdgesMessage}
                </Typography>
              ) : (
                <div className="space-y-1.5">
                  {edgeIssues.map((edgeIssue) => (
                    <button
                      key={edgeIssue.issueId}
                      type="button"
                      onClick={() => focusValidationIssue(edgeIssue)}
                      className={clsx(
                        "w-full text-left rounded-md border px-2 py-1.5 transition-colors",
                        isIssueSelected(edgeIssue)
                          ? "border-rose-300 bg-rose-50"
                          : "border-rose-200 bg-rose-50/40 hover:bg-rose-50"
                      )}
                    >
                      <div className="flex items-start gap-1.5">
                        <GitCommitHorizontal className="h-3 w-3 text-rose-500 mt-0.5 shrink-0" />
                        <div className="min-w-0">
                          <Typography variant="caption" weight="semibold" className="text-[11px] md:text-[11px] text-neutral-800 block truncate">
                            {VALIDATION_ISSUES_VIEWER.edgeRoutePrefix}: {edgeIssue.sourceDisplayName} {"->"} {edgeIssue.targetDisplayName}
                          </Typography>
                          <Typography variant="caption" className="text-[10px] md:text-[10px] text-rose-700 block leading-snug">
                            {edgeIssue.reason}
                          </Typography>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
