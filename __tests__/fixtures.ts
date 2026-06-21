import {
  type KarabinerAction,
  type KarabinerAssignment,
  type KarabinerWorkspace,
  keyAction,
  layerAction,
  transparentAction,
} from "../src/karabiner/workspace";
import { macbookKeys } from "../src/karabiner/virtual-device";

export const action = {
  key: keyAction,
  layer: layerAction,
  shortcut: (keyCode: string, modifiers: string[]): KarabinerAction => ({
    kind: "shortcut",
    keyCode,
    modifiers,
  }),
  transparent: transparentAction,
};

export const assignment = (
  tap: KarabinerAction,
  hold: KarabinerAction = transparentAction(),
): KarabinerAssignment => ({ tap, hold });

export const oldOpinionatedWorkspace = (): KarabinerWorkspace => ({
  version: 1,
  layers: [
    {
      id: "base",
      name: "Base",
      assignments: {
        KC_CAPS: assignment(keyAction("escape"), layerAction("nav")),
        KC_SPC: assignment(keyAction("spacebar"), layerAction("numbers")),
      },
    },
    { id: "nav", name: "Nav", assignments: {} },
    { id: "numbers", name: "Numbers", assignments: {} },
    { id: "symbols", name: "Symbols", assignments: {} },
  ],
});

export const keyCodes = () => macbookKeys.map((key) => key.code);
