import { describe, expect, it } from "vitest";
import { karabinerJson } from "../../src/karabiner/export";
import {
  createDefaultWorkspace,
  keyAction,
  layerAction,
  setAssignment,
} from "../../src/karabiner/workspace";
import { action, assignment } from "../fixtures";

describe("Karabiner export", () => {
  it("does not emit default no-op manipulators", () => {
    expect(karabinerJson(createDefaultWorkspace()).rules[0].manipulators).toEqual([]);
  });

  it("emits layer-hold manipulators with key-up cleanup", () => {
    const workspace = setAssignment(
      createDefaultWorkspace(),
      0,
      "KC_CAPS",
      assignment(keyAction("escape"), layerAction("layer_1")),
    );

    const json = karabinerJson(workspace);
    const capsManipulators = json.rules[0].manipulators.filter(
      (manipulator) => manipulator.from.key_code === "caps_lock",
    );
    const [caps] = capsManipulators;

    expect(capsManipulators).toHaveLength(1);
    expect(caps).toMatchObject({
      type: "basic",
      from: { key_code: "caps_lock", modifiers: { optional: ["any"] } },
      to_if_alone: [{ key_code: "escape" }],
      to_if_held_down: [
        {
          set_variable: {
            name: "karabinervia_layer_layer_1",
            value: 1,
          },
        },
      ],
      to_after_key_up: [
        {
          set_variable: {
            name: "karabinervia_layer_layer_1",
            value: 0,
          },
        },
      ],
    });
  });

  it("emits conditioned layer remaps before unconditioned base remaps", () => {
    let workspace = setAssignment(createDefaultWorkspace(), 0, "KC_H", assignment(keyAction("j")));
    workspace = setAssignment(workspace, 1, "KC_H", assignment(keyAction("left_arrow")));
    workspace = setAssignment(
      workspace,
      1,
      "KC_C",
      assignment(action.shortcut("c", ["left_command", "left_shift"])),
    );

    const json = karabinerJson(workspace);
    const hManipulators = json.rules[0].manipulators.filter(
      (manipulator) => manipulator.from.key_code === "h",
    );
    const layerC = json.rules[0].manipulators.find(
      (manipulator) => manipulator.from.key_code === "c" && manipulator.conditions?.length,
    );

    expect(hManipulators).toHaveLength(2);
    expect(hManipulators[0]).toMatchObject({
      to: [{ key_code: "left_arrow" }],
      conditions: [{ type: "variable_if", name: "karabinervia_layer_layer_1", value: 1 }],
    });
    expect(hManipulators[1]).toMatchObject({
      from: { key_code: "h", modifiers: { optional: ["any"] } },
      to: [{ key_code: "j" }],
    });
    expect(layerC).toMatchObject({
      to: [{ key_code: "c", modifiers: ["left_command", "left_shift"] }],
    });
  });
});
