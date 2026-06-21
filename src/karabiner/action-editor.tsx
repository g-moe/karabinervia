import { useEffect, useState } from "react";
import styled from "styled-components";
import { AccentButton } from "../components/inputs/accent-button";
import { inputSurface, selectSurface } from "../components/inputs/control-styles";
import { ControlRow, Detail, Label, SpanOverflowCell } from "../components/panes/grid";
import { PanelPane } from "../components/panes/pane";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  getSelectedKey,
  getSelectedLayerIndex,
  saveKeymapSuccess,
  setNumberOfLayers,
} from "../store/keymapSlice";
import { KARABINER_VIA_DEVICE_PATH, macbookLayoutKeys } from "./virtual-device";
import {
  KarabinerAction,
  KarabinerActionKind,
  assignmentFor,
  keyAction,
  keyOptions,
  layerAction,
  loadWorkspace,
  modifierAction,
  modifierOptions,
  noneAction,
  qmkToKarabiner,
  saveWorkspace,
  setAssignment,
  transparentAction,
  workspaceToViaLayers,
} from "./workspace";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 12px;
`;

const Select = styled.select`
  ${selectSurface}
`;

const TextInput = styled.input`
  ${inputSurface}
`;

const CheckboxGroup = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(160px, 1fr));
  gap: 6px 14px;
  padding: 8px 0;
`;

const Checkbox = styled.label`
  color: var(--color_text-secondary);
  font-size: 16px;
  line-height: 24px;
`;

const SelectedKeyValue = styled.span`
  color: var(--color_control-text);
  margin-left: 8px;
`;

function defaultAction(kind: KarabinerActionKind, fallbackLayerId: string) {
  switch (kind) {
    case "transparent":
      return transparentAction();
    case "none":
      return noneAction();
    case "modifier":
      return modifierAction("left_control");
    case "layer":
      return layerAction(fallbackLayerId);
    case "shortcut":
      return {
        kind: "shortcut" as const,
        keyCode: "c",
        modifiers: ["left_command"],
      };
    case "key":
    default:
      return keyAction("escape");
  }
}

function ActionRows(props: {
  action: KarabinerAction;
  allowLayer: boolean;
  allowTransparent: boolean;
  layerOptions: { value: string; label: string }[];
  onChange: (action: KarabinerAction) => void;
  scope: "tap" | "hold";
}) {
  const { action, allowLayer, allowTransparent, layerOptions, onChange, scope } = props;
  const fallbackLayer = layerOptions[0]?.value ?? "nav";
  const kindOptions: { value: KarabinerActionKind; label: string }[] = [
    ...(allowTransparent ? [{ value: "transparent" as const, label: "Transparent" }] : []),
    { value: "none", label: "Disabled" },
    { value: "key", label: "Key" },
    { value: "shortcut", label: "Shortcut" },
    { value: "modifier", label: "Modifier" },
    ...(allowLayer ? [{ value: "layer" as const, label: "Layer Hold" }] : []),
  ];

  return (
    <>
      <ControlRow>
        <Label>Type</Label>
        <Detail>
          <Select
            data-testid={`${scope}-type`}
            value={action.kind}
            onChange={(event) =>
              onChange(defaultAction(event.target.value as KarabinerActionKind, fallbackLayer))
            }
          >
            {kindOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        </Detail>
      </ControlRow>
      {action.kind === "key" && (
        <ControlRow>
          <Label>Key</Label>
          <Detail>
            <Select
              data-testid={`${scope}-key`}
              value={action.keyCode ?? "escape"}
              onChange={(event) => onChange(keyAction(event.target.value))}
            >
              {keyOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Detail>
        </ControlRow>
      )}
      {action.kind === "modifier" && (
        <ControlRow>
          <Label>Modifier</Label>
          <Detail>
            <Select
              data-testid={`${scope}-modifier`}
              value={action.keyCode ?? "left_control"}
              onChange={(event) => onChange(modifierAction(event.target.value))}
            >
              {modifierOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Detail>
        </ControlRow>
      )}
      {action.kind === "layer" && (
        <ControlRow>
          <Label>Layer</Label>
          <Detail>
            <Select
              data-testid={`${scope}-layer`}
              value={action.layerId ?? fallbackLayer}
              onChange={(event) => onChange(layerAction(event.target.value))}
            >
              {layerOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </Detail>
        </ControlRow>
      )}
      {action.kind === "shortcut" && (
        <>
          <ControlRow>
            <Label>Main Key</Label>
            <Detail>
              <Select
                data-testid={`${scope}-main-key`}
                value={action.keyCode ?? "c"}
                onChange={(event) => onChange({ ...action, keyCode: event.target.value })}
              >
                {keyOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </Detail>
          </ControlRow>
          <ControlRow>
            <Label>Modifiers</Label>
            <Detail>
              <CheckboxGroup>
                {modifierOptions.map((option) => {
                  const modifiers = action.modifiers ?? [];
                  const checked = modifiers.includes(option.value);
                  return (
                    <Checkbox key={option.value}>
                      <input
                        data-testid={`${scope}-modifier-${option.value}`}
                        type="checkbox"
                        checked={checked}
                        onChange={(event) => {
                          const next = new Set(modifiers);
                          if (event.target.checked) next.add(option.value);
                          else next.delete(option.value);
                          onChange({ ...action, modifiers: [...next] });
                        }}
                      />{" "}
                      {option.label}
                    </Checkbox>
                  );
                })}
              </CheckboxGroup>
            </Detail>
          </ControlRow>
        </>
      )}
    </>
  );
}

export function KarabinerActionEditor() {
  const dispatch = useAppDispatch();
  const selectedKey = useAppSelector(getSelectedKey);
  const selectedLayerIndex = useAppSelector(getSelectedLayerIndex);
  const [workspace, setWorkspaceState] = useState(() => loadWorkspace());
  const macKey = selectedKey === null ? null : macbookLayoutKeys[selectedKey];

  const setWorkspace = (next: ReturnType<typeof loadWorkspace>) => {
    setWorkspaceState(next);
    saveWorkspace(next);
    const layers = workspaceToViaLayers(next);
    dispatch(setNumberOfLayers(layers.length));
    dispatch(saveKeymapSuccess({ devicePath: KARABINER_VIA_DEVICE_PATH, layers }));
  };

  useEffect(() => {
    const next = loadWorkspace();
    setWorkspaceState(next);
    const layers = workspaceToViaLayers(next);
    dispatch(setNumberOfLayers(layers.length));
    dispatch(saveKeymapSuccess({ devicePath: KARABINER_VIA_DEVICE_PATH, layers }));
  }, [dispatch]);

  if (!macKey || macKey.displayOnly) {
    return (
      <SpanOverflowCell>
        <PanelPane>
          <Container>
            <ControlRow>
              <Label>{macKey?.displayOnly ? "Display Only" : "Select a key"}</Label>
              <Detail>
                {macKey?.displayOnly
                  ? "This key is shown for physical context and cannot be edited."
                  : "Click a key above to edit tap and hold actions."}
              </Detail>
            </ControlRow>
          </Container>
        </PanelPane>
      </SpanOverflowCell>
    );
  }

  const current = assignmentFor(workspace, selectedLayerIndex, macKey.code);
  const selectedLayer = workspace.layers[selectedLayerIndex];
  const layerOptions = workspace.layers
    .filter((layer) => layer.id !== "base")
    .map((layer) => ({ value: layer.id, label: layer.name }));

  return (
    <SpanOverflowCell>
      <PanelPane>
        <Container>
          <ControlRow>
            <Label>
              Selected Key
              <SelectedKeyValue data-testid="selected-key-label">
                {macKey.code.replace(/^KC_/, "")}
              </SelectedKeyValue>
            </Label>
          </ControlRow>
          <ControlRow>
            <Label>Layer Name</Label>
            <Detail>
              <TextInput
                data-testid="layer-name-input"
                value={selectedLayer?.name ?? ""}
                onChange={(event) =>
                  setWorkspace({
                    ...workspace,
                    layers: workspace.layers.map((layer, index) =>
                      index === selectedLayerIndex ? { ...layer, name: event.target.value } : layer,
                    ),
                  })
                }
              />
            </Detail>
          </ControlRow>
          <ControlRow>
            <Label>Add Layer</Label>
            <Detail>
              <AccentButton
                data-testid="add-layer"
                onClick={() => {
                  const nextIndex = workspace.layers.length;
                  setWorkspace({
                    ...workspace,
                    layers: [
                      ...workspace.layers,
                      {
                        id: `layer_${Date.now()}`,
                        name: `Layer ${nextIndex}`,
                        assignments: {},
                      },
                    ],
                  });
                }}
              >
                Add
              </AccentButton>
            </Detail>
          </ControlRow>
          <ActionRows
            action={current.tap}
            allowLayer={false}
            allowTransparent={selectedLayerIndex !== 0}
            layerOptions={layerOptions}
            onChange={(tap) =>
              setWorkspace(
                setAssignment(workspace, selectedLayerIndex, macKey.code, {
                  ...current,
                  tap,
                }),
              )
            }
            scope="tap"
          />
          <ActionRows
            action={current.hold}
            allowLayer
            allowTransparent
            layerOptions={layerOptions}
            onChange={(hold) =>
              setWorkspace(
                setAssignment(workspace, selectedLayerIndex, macKey.code, {
                  ...current,
                  hold,
                }),
              )
            }
            scope="hold"
          />
          <ControlRow>
            <Label>Reset Key</Label>
            <Detail>
              <AccentButton
                data-testid="reset-key"
                onClick={() =>
                  setWorkspace(
                    setAssignment(workspace, selectedLayerIndex, macKey.code, {
                      tap:
                        selectedLayerIndex === 0
                          ? keyAction(qmkToKarabiner[macKey.code] ?? "vk_none")
                          : transparentAction(),
                      hold: transparentAction(),
                    }),
                  )
                }
              >
                Reset
              </AccentButton>
            </Detail>
          </ControlRow>
        </Container>
      </PanelPane>
    </SpanOverflowCell>
  );
}
