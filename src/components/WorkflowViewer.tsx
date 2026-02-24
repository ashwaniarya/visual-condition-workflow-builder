import { useMemo } from 'react'
import { useStore } from 'reactflow'
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/json'
import 'highlight.js/styles/github-dark.css'
import { WORKFLOW_VIEWER } from '@/constants/layout'

hljs.registerLanguage('json', json)

const containerStyle: React.CSSProperties = {
  padding: 12,
  overflow: 'auto',
  height: '100%',
  fontSize: 12,
  fontFamily: 'monospace',
}

const preStyle: React.CSSProperties = {
  margin: 0,
  padding: 0,
}

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
    <div style={containerStyle}>
      <pre style={preStyle}>
        <code
          className="hljs language-json"
          dangerouslySetInnerHTML={{ __html: highlightedHtml }}
        />
      </pre>
    </div>
  )
}
