export interface PaletteNodeMetadata {
  displayTitle: string;
  infoMessage: string;
}

export const paletteNodeMetadata: Record<string, PaletteNodeMetadata> = {
  start: {
    displayTitle: "Start",
    infoMessage:
      "Entry point of your workflow. Drag onto canvas to begin. Only one start node allowed.",
  },
  task: {
    displayTitle: "Task",
    infoMessage:
      "A unit of work. Add name and description after placing on the canvas.",
  },
  end: {
    displayTitle: "End",
    infoMessage:
      "Exit point. Workflow completes when this node is reached. Drag onto canvas.",
  },
};
