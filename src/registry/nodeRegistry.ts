import { BaseEdge, BaseNode } from "@/model/interface";

interface NodeRegistry {
  [key: string]: BaseNode;
}

interface EdgeRegistry {
  [key: string]: BaseEdge;
}

const nodeRegistry: NodeRegistry = {
  start: {
    _type: "start",
    id: "start",
    config: { name: "Start", description: "Start node", prompt: "" },
    _nodeConfigState: "VALID_CONFIGURATION",
    _uiconfig: {
      position: { x: 0, y: 0 },
      portPolicy: [{ direction: "out" }],
    },
  },
  task: {
    _type: "task",
    id: "task",
    config: { name: "", description: "", prompt: "" },
    _nodeConfigState: "INVALID_CONFIGURATION",
    _uiconfig: {
      position: { x: 0, y: 0 },
      portPolicy: [{ direction: "out" }],
    },
  },
  end: {
    _type: "end",
    id: "end",
    config: { name: "End", description: "End node", prompt: "" },
    _nodeConfigState: "VALID_CONFIGURATION",
    _uiconfig: {
      position: { x: 0, y: 0 },
      portPolicy: [{ direction: "in" }],
    },
  },
};

const edgeRegistry: EdgeRegistry = {
  default: {
    _type: "default",
    id: "default",
    sourceNodeId: "",
    targetNodeId: "",
    parameters: {},
    config: {
      name: "Default",
      description: "Default edge",
    },
    condition: "",
  },
};

export { nodeRegistry, edgeRegistry };
