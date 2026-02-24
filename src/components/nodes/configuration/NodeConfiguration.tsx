import { useCallback, useMemo } from "react";
import { useReactFlow } from "reactflow";
import type { BaseNode } from "@/model/interface";
import {
  DEFAULT_BORDER_COLOR,
  INVALID_BORDER_COLOR,
  NODE_TYPE_BACKGROUNDS,
} from "@/constants/nodeStyles";
import {
  configFormInputStyle,
  configFormInputErrorStyle,
  configFormLabelStyle,
  configFormErrorTextStyle,
} from "@/constants/formStyles";
import { validateNodeConfig } from "@/utils/formValidation";
import OutgoingEdgesConfiguration from "@/components/nodes/configuration/OutgoingEdgesConfiguration";

interface NodeConfigurationProps {
  selectedNode: BaseNode;
  nodeId: string;
}

export default function NodeConfiguration({ selectedNode, nodeId }: NodeConfigurationProps) {
  const { setNodes } = useReactFlow();
  const { name, description } = selectedNode.config;
  const validation = useMemo(
    () => validateNodeConfig(name ?? "", description ?? ""),
    [name, description]
  );
  const isInvalid = !validation.isValid;
  const backgroundColor =
    NODE_TYPE_BACKGROUNDS[selectedNode._type] ?? NODE_TYPE_BACKGROUNDS.task;
  const borderColor = isInvalid ? INVALID_BORDER_COLOR : DEFAULT_BORDER_COLOR;

  const updateNodeConfig = useCallback(
    (configUpdates: Partial<BaseNode["config"]>) => {
      setNodes((nds) =>
        nds.map((n) => {
          if (n.id !== nodeId) return n;
          const baseNode = n.data.baseNode;
          const newConfig = { ...baseNode.config, ...configUpdates };
          const { isValid } = validateNodeConfig(
            newConfig.name ?? "",
            newConfig.description ?? ""
          );
          return {
            ...n,
            data: {
              baseNode: {
                ...baseNode,
                config: newConfig,
                _nodeConfigState: isValid
                  ? "VALID_CONFIGURATION"
                  : "INVALID_CONFIGURATION",
              },
            },
          };
        })
      );
    },
    [nodeId, setNodes]
  );

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeConfig({ name: event.target.value });
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeConfig({ description: event.target.value });
  };

  return (
    <div
      style={{
        padding: 16,
        backgroundColor,
        border: `2px solid ${borderColor}`,
        borderRadius: 8,
      }}
    >
      <div style={{ margin: "0 0 16px", fontSize: 13, fontWeight: 600 }}>
        {name || "Node Configuration"}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        <div>
          <label style={configFormLabelStyle}>Name</label>
          <input
            type="text"
            value={name}
            onChange={handleNameChange}
            style={validation.nameError ? configFormInputErrorStyle : configFormInputStyle}
            aria-invalid={!!validation.nameError}
            aria-describedby={validation.nameError ? "name-error" : undefined}
          />
          {validation.nameError && (
            <span id="name-error" role="alert" style={configFormErrorTextStyle}>
              {validation.nameError}
            </span>
          )}
        </div>
        <div>
          <label style={configFormLabelStyle}>Description</label>
          <input
            type="text"
            value={description}
            onChange={handleDescriptionChange}
            style={validation.descriptionError ? configFormInputErrorStyle : configFormInputStyle}
            aria-invalid={!!validation.descriptionError}
            aria-describedby={
              validation.descriptionError ? "description-error" : undefined
            }
          />
          {validation.descriptionError && (
            <span id="description-error" role="alert" style={configFormErrorTextStyle}>
              {validation.descriptionError}
            </span>
          )}
        </div>
        <OutgoingEdgesConfiguration sourceNodeId={nodeId} />
      </div>
    </div>
  );
}
