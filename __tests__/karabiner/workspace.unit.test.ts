import { describe, expect, it, vi } from "vitest";
import {
  BASE_LAYER_ID,
  KARABINER_WORKSPACE_STORAGE_KEY,
  assignmentFor,
  createDefaultWorkspace,
  keyAction,
  layerAction,
  loadWorkspace,
  normalizeWorkspace,
  saveWorkspace,
  setAssignment,
  transparentAction,
  workspaceToViaLayers,
} from "../../src/karabiner/workspace";
import { oldOpinionatedWorkspace, assignment, keyCodes } from "../fixtures";
import { macbookDefinition, macbookKeys } from "../../src/karabiner/virtual-device";
import { getByteForCode } from "../../src/utils/key";
import { getBasicKeyDict } from "../../src/utils/key-to-byte/dictionary-store";

describe("Karabiner workspace model", () => {
  it("creates a QWERTY MacBook workspace with no opinionated holds", () => {
    const workspace = createDefaultWorkspace();
    const base = workspace.layers[0];

    expect(workspace.layers.map((layer) => layer.name)).toEqual([
      "Base",
      "Layer 1",
      "Layer 2",
      "Layer 3",
    ]);
    expect(base.id).toBe(BASE_LAYER_ID);
    expect(Object.keys(base.assignments).sort()).toEqual(keyCodes().sort());

    expect(base.assignments.KC_CAPS).toEqual(
      assignment(keyAction("caps_lock"), transparentAction()),
    );
    expect(base.assignments.KC_SPC).toEqual(assignment(keyAction("spacebar"), transparentAction()));
    expect(workspace.layers[1].assignments).toEqual({});
  });

  it("updates one key assignment immutably and leaves other layers alone", () => {
    const workspace = createDefaultWorkspace();
    const next = setAssignment(workspace, 1, "KC_A", assignment(keyAction("escape")));

    expect(next).not.toBe(workspace);
    expect(assignmentFor(next, 1, "KC_A").tap).toEqual(keyAction("escape"));
    expect(assignmentFor(workspace, 1, "KC_A").tap).toEqual(transparentAction());
    expect(assignmentFor(next, 1, "KC_B").tap).toEqual(transparentAction());
    expect(assignmentFor(next, 0, "KC_A").tap).toEqual(keyAction("a"));
  });

  it("serializes tap actions into VIA keymap bytes", () => {
    const dictionary = getBasicKeyDict(11);
    const workspace = setAssignment(
      createDefaultWorkspace(),
      0,
      "KC_A",
      assignment(keyAction("escape")),
    );
    const layers = workspaceToViaLayers(workspace);
    const a = macbookKeys.find((key) => key.code === "KC_A");

    expect(a).toBeDefined();
    expect(layers).toHaveLength(4);
    expect(layers[0].keymap[a!.row * macbookDefinition.matrix.cols + a!.col]).toBe(
      getByteForCode("KC_ESC", dictionary),
    );
    expect(layers[1].keymap[a!.row * macbookDefinition.matrix.cols + a!.col]).toBe(
      getByteForCode("KC_TRNS", dictionary),
    );
  });

  it("migrates old nav/numbers/symbols defaults back to blank planning layers", () => {
    localStorage.setItem(
      KARABINER_WORKSPACE_STORAGE_KEY,
      JSON.stringify(oldOpinionatedWorkspace()),
    );

    const workspace = loadWorkspace();

    expect(workspace.layers.map((layer) => layer.id)).toEqual([
      "base",
      "layer_1",
      "layer_2",
      "layer_3",
    ]);
    expect(workspace.layers[0].assignments.KC_CAPS).toEqual(
      assignment(keyAction("caps_lock"), transparentAction()),
    );
    expect(workspace.layers[0].assignments.KC_SPC).toEqual(
      assignment(keyAction("spacebar"), transparentAction()),
    );
  });

  it("preserves customized legacy assignments while removing only old defaults", () => {
    const oldWorkspace = oldOpinionatedWorkspace();
    oldWorkspace.layers[0].assignments.KC_CAPS = assignment(
      keyAction("delete_or_backspace"),
      layerAction("nav"),
    );

    localStorage.setItem(KARABINER_WORKSPACE_STORAGE_KEY, JSON.stringify(oldWorkspace));

    const workspace = loadWorkspace();

    expect(workspace.layers[0].assignments.KC_CAPS).toEqual(
      assignment(keyAction("delete_or_backspace"), layerAction("nav")),
    );
    expect(workspace.layers[0].assignments.KC_SPC).toEqual(
      assignment(keyAction("spacebar"), transparentAction()),
    );
    expect(workspace.layers.map((layer) => layer.id)).not.toContain("nav");
  });

  it("falls back to a complete default workspace for malformed saved data", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    localStorage.setItem(KARABINER_WORKSPACE_STORAGE_KEY, '{"version":1');

    const workspace = loadWorkspace();

    expect(warn).toHaveBeenCalled();
    expect(workspace).toEqual(createDefaultWorkspace());
  });

  it("rejects empty or invalid imported workspace shapes", () => {
    expect(() => normalizeWorkspace({ version: 1, layers: [] })).toThrow("Invalid workspace shape");
    expect(() =>
      normalizeWorkspace({
        version: 1,
        layers: [
          {
            id: "base",
            name: "Base",
            assignments: { KC_A: { tap: { kind: "key", keyCode: "a" } } },
          },
        ],
      }),
    ).toThrow("Invalid assignment");
  });

  it("round-trips saved workspaces from localStorage", () => {
    const workspace = setAssignment(
      createDefaultWorkspace(),
      2,
      "KC_H",
      assignment(keyAction("left_arrow")),
    );

    saveWorkspace(workspace);

    expect(loadWorkspace().layers[2].assignments.KC_H.tap).toEqual(keyAction("left_arrow"));
  });
});
