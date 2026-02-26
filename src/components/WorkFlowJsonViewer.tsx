import { useEffect, useMemo, useState } from "react";
import { useStore } from "reactflow";
import hljs from "highlight.js/lib/core";
import json from "highlight.js/lib/languages/json";
import "highlight.js/styles/github-dark.css";
import { FileJson } from "lucide-react";
import { WORKFLOW_VIEWER } from "@/constants/layout";
import { debounce } from "@/utils/debounce";
import { Typography } from "@/ui";

hljs.registerLanguage("json", json);

export default function WorkFlowJsonViewer() {
  const flowNodes = useStore((state) => Array.from(state.nodeInternals.values()));
  const flowEdges = useStore((state) => state.edges);

  const nodes = flowNodes.map((flowNode) => flowNode.data?.baseNode).filter(Boolean);
  const edges = flowEdges
    .map((flowEdge) => flowEdge.data?.baseEdge)
    .filter((baseEdge): baseEdge is NonNullable<typeof baseEdge> => Boolean(baseEdge));

  const workflowJson = useMemo(
    () =>
      JSON.stringify(
        { nodes, edges },
        null,
        WORKFLOW_VIEWER.jsonIndentSpaces
      ),
    [nodes, edges]
  );

  const [highlightedHtml, setHighlightedHtml] = useState(() =>
    hljs.highlight(workflowJson, { language: "json" }).value
  );

  const debouncedJsonHighlighter = useMemo(
    () =>
      debounce((jsonString: string) => {
        setHighlightedHtml(hljs.highlight(jsonString, { language: "json" }).value);
      }, WORKFLOW_VIEWER.jsonUpdateDebounceMs),
    []
  );

  useEffect(() => {
    debouncedJsonHighlighter(workflowJson);

    return () => {
      debouncedJsonHighlighter.cancel();
    };
  }, [workflowJson, debouncedJsonHighlighter]);

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-[#0d1117]">
      <div className="flex shrink-0 items-center justify-between px-3 py-1.5 border-b border-[#30363d] bg-[#010409]">
        <div className="flex items-center gap-2">
          <FileJson className="h-3.5 w-3.5 text-neutral-400" />
          <Typography variant="caption" weight="bold" className="text-neutral-400 uppercase tracking-wider text-[9px] md:text-[9px]">
            Workflow JSON
          </Typography>
        </div>
        <div className="text-[9px] text-neutral-500 font-mono">Read-only</div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        <pre className="m-0 p-3 font-mono text-[11px] leading-snug">
          <code
            className="hljs language-json !bg-transparent !p-0"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        </pre>
      </div>
    </div>
  );
}
