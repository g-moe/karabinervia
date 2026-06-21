import {
  BASE_LAYER_ID,
  KarabinerAction,
  KarabinerWorkspace,
  loadWorkspace,
  qmkToKarabiner,
} from "./workspace";
import { macbookKeys } from "./virtual-device";

function downloadJson(name: string, value: unknown) {
  const blob = new Blob([JSON.stringify(value, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  anchor.click();
  URL.revokeObjectURL(url);
}

function toEvent(action: KarabinerAction) {
  if (action.kind === "none") return undefined;
  if (action.kind === "transparent") return undefined;
  if (action.kind === "layer") return undefined;
  if (action.kind === "shortcut") {
    return {
      key_code: action.keyCode,
      modifiers: action.modifiers ?? [],
    };
  }
  return {
    key_code: action.keyCode,
  };
}

function layerVariable(layerId: string) {
  return `karabinervia_layer_${layerId}`;
}

function layerCondition(layerId: string) {
  return {
    type: "variable_if",
    name: layerVariable(layerId),
    value: 1,
  };
}

function baseManipulator(from: string, tap: KarabinerAction, hold: KarabinerAction) {
  const tapEvent = toEvent(tap);
  const holdEvent = toEvent(hold);

  if (hold.kind === "layer" && hold.layerId) {
    return {
      type: "basic",
      from: { key_code: from, modifiers: { optional: ["any"] } },
      to_if_alone: tapEvent ? [tapEvent] : [],
      to_if_held_down: [
        {
          set_variable: {
            name: layerVariable(hold.layerId),
            value: 1,
          },
        },
      ],
      to_after_key_up: [
        {
          set_variable: {
            name: layerVariable(hold.layerId),
            value: 0,
          },
        },
      ],
      parameters: {
        "basic.to_if_alone_timeout_milliseconds": 180,
        "basic.to_if_held_down_threshold_milliseconds": 180,
      },
    };
  }

  if (holdEvent) {
    return {
      type: "basic",
      from: { key_code: from, modifiers: { optional: ["any"] } },
      to_if_alone: tapEvent ? [tapEvent] : [],
      to_if_held_down: [holdEvent],
      parameters: {
        "basic.to_if_alone_timeout_milliseconds": 180,
        "basic.to_if_held_down_threshold_milliseconds": 180,
      },
    };
  }

  if (!tapEvent || (tap.kind === "key" && tap.keyCode === from)) return null;
  return {
    type: "basic",
    from: { key_code: from, modifiers: { optional: ["any"] } },
    to: [tapEvent],
  };
}

export function karabinerJson(workspace: KarabinerWorkspace) {
  const keyByQmk = new Map(macbookKeys.map((key) => [key.code, key]));
  const baseLayer = workspace.layers.find((layer) => layer.id === BASE_LAYER_ID);
  const manipulators: any[] = [];

  workspace.layers
    .filter((layer) => layer.id !== BASE_LAYER_ID)
    .forEach((layer) => {
      Object.entries(layer.assignments).forEach(([qmkCode, assignment]) => {
        if (assignment.tap.kind === "transparent") return;
        const from = qmkToKarabiner[qmkCode];
        const event = toEvent(assignment.tap);
        if (!from || !event) return;
        if (assignment.tap.kind === "key" && assignment.tap.keyCode === from) {
          return;
        }
        manipulators.push({
          type: "basic",
          from: { key_code: from, modifiers: { optional: ["any"] } },
          to: [event],
          conditions: [layerCondition(layer.id)],
        });
      });
    });

  if (baseLayer) {
    Object.entries(baseLayer.assignments).forEach(([qmkCode, assignment]) => {
      const from = qmkToKarabiner[qmkCode];
      if (!from || !keyByQmk.has(qmkCode)) return;
      const manipulator = baseManipulator(from, assignment.tap, assignment.hold);
      if (manipulator) manipulators.push(manipulator);
    });
  }

  return {
    title: "KarabinerVIA generated MacBook layers",
    rules: [
      {
        description: "KarabinerVIA generated MacBook layers",
        manipulators,
      },
    ],
  };
}

export function downloadProject() {
  downloadJson("karabinervia-project.json", loadWorkspace());
}

export function downloadKarabiner() {
  downloadJson("karabinervia-karabiner.json", karabinerJson(loadWorkspace()));
}
