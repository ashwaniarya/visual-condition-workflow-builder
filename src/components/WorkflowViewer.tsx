import { useMemo } from 'react'
import { useStore } from 'reactflow'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/github-dark.css'
import { WORKFLOW_VIEWER } from '@/constants/layout'

hljs.registerLanguage('json', json)

export default function WorkflowViewer() {
  const flowNodes = useStore((state) => Array.from(state.nodeInternals.values()))
  const flowEdges = useStore((state) => state.edges)

  const nodes = flowNodes.map((n) => n.data?.baseNode).filter(Boolean)
  const edges = flowEdges
    .map((e) => e.data?.baseEdge)
    .filter((b): b is NonNullable<typeof b> => Boolean(b))

  const highlightedHtml = useMemo(() => {
    const jsonString = JSON.stringify(
      { nodes, edges },
      null,
      WORKFLOW_VIEWER.jsonIndentSpaces,
    )
    return hljs.highlight(jsonString, { language: 'json' }).value
  }, [nodes, edges])

  return (
    <div className="h-full overflow-auto p-3 font-mono text-xs">
      <pre className="m-0 p-0">
        <code
          className="hljs language-json"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </pre>
    </div>
  )
}
