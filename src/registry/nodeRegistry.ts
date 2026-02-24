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
    config: { name: "Start", description: "Start node" },
    _nodeConfigState: "VALID_CONFIGURATION",
    _uiconfig: {
      width: 100,
      height: 100,
      position: { x: 0, y: 0 },
      portPolicy: [{ direction: "out" }],
    },
  },
  task: {
    _type: "task",
    id: "task",
    config: { name: "", description: "" },
    _nodeConfigState: "INVALID_CONFIGURATION",
    _uiconfig: {
      width: 100,
      height: 100,
      position: { x: 0, y: 0 },
      portPolicy: [{ direction: "out" }],
    },
  },
  end: {
    _type: "end",
    id: "end",
    config: { name: "End", description: "End node" },
    _nodeConfigState: "VALID_CONFIGURATION",
    _uiconfig: {
      width: 100,
      height: 100,
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
