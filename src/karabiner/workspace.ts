import type {Layer} from 'src/types/types';
import {getByteForCode} from 'src/utils/key';
import {getBasicKeyDict} from 'src/utils/key-to-byte/dictionary-store';
import {
  KARABINER_VIA_PROTOCOL,
  macbookDefinition,
  macbookKeys,
} from './virtual-device';

export type KarabinerActionKind =
  | 'transparent'
  | 'none'
  | 'key'
  | 'shortcut'
  | 'modifier'
  | 'layer';

export type KarabinerAction = {
  kind: KarabinerActionKind;
  keyCode?: string;
  modifiers?: string[];
  layerId?: string;
};

export type KarabinerAssignment = {
  tap: KarabinerAction;
  hold: KarabinerAction;
};

export type KarabinerLayer = {
  id: string;
  name: string;
  assignments: Record<string, KarabinerAssignment>;
};

export type KarabinerWorkspace = {
  version: 1;
  layers: KarabinerLayer[];
};

export const KARABINER_WORKSPACE_STORAGE_KEY = 'karabinervia.workspace.v1';
export const BASE_LAYER_ID = 'base';

export const transparentAction = (): KarabinerAction => ({kind: 'transparent'});
export const noneAction = (): KarabinerAction => ({kind: 'none'});
export const keyAction = (keyCode: string): KarabinerAction => ({
  kind: 'key',
  keyCode,
});
export const modifierAction = (keyCode: string): KarabinerAction => ({
  kind: 'modifier',
  keyCode,
});
export const layerAction = (layerId: string): KarabinerAction => ({
  kind: 'layer',
  layerId,
});

export const qmkToKarabiner: Record<string, string> = {
  KC_A: 'a',
  KC_B: 'b',
  KC_C: 'c',
  KC_D: 'd',
  KC_E: 'e',
  KC_F: 'f',
  KC_G: 'g',
  KC_H: 'h',
  KC_I: 'i',
  KC_J: 'j',
  KC_K: 'k',
  KC_L: 'l',
  KC_M: 'm',
  KC_N: 'n',
  KC_O: 'o',
  KC_P: 'p',
  KC_Q: 'q',
  KC_R: 'r',
  KC_S: 's',
  KC_T: 't',
  KC_U: 'u',
  KC_V: 'v',
  KC_W: 'w',
  KC_X: 'x',
  KC_Y: 'y',
  KC_Z: 'z',
  KC_1: '1',
  KC_2: '2',
  KC_3: '3',
  KC_4: '4',
  KC_5: '5',
  KC_6: '6',
  KC_7: '7',
  KC_8: '8',
  KC_9: '9',
  KC_0: '0',
  KC_ESC: 'escape',
  KC_GRV: 'grave_accent_and_tilde',
  KC_MINS: 'hyphen',
  KC_EQL: 'equal_sign',
  KC_BSPC: 'delete_or_backspace',
  KC_TAB: 'tab',
  KC_LBRC: 'open_bracket',
  KC_RBRC: 'close_bracket',
  KC_BSLS: 'backslash',
  KC_CAPS: 'caps_lock',
  KC_SCLN: 'semicolon',
  KC_QUOT: 'quote',
  KC_ENT: 'return_or_enter',
  KC_LSFT: 'left_shift',
  KC_RSFT: 'right_shift',
  KC_COMM: 'comma',
  KC_DOT: 'period',
  KC_SLSH: 'slash',
  KC_LCTL: 'left_control',
  KC_RCTL: 'right_control',
  KC_LALT: 'left_option',
  KC_RALT: 'right_option',
  KC_LGUI: 'left_command',
  KC_RGUI: 'right_command',
  KC_SPC: 'spacebar',
  KC_LEFT: 'left_arrow',
  KC_RGHT: 'right_arrow',
  KC_UP: 'up_arrow',
  KC_DOWN: 'down_arrow',
  KC_DEL: 'delete_forward',
  KC_HOME: 'home',
  KC_END: 'end',
  KC_PGUP: 'page_up',
  KC_PGDN: 'page_down',
};

export const karabinerToQmk = Object.fromEntries(
  Object.entries(qmkToKarabiner).map(([qmk, karabiner]) => [karabiner, qmk]),
);

export const keyOptions = Object.entries(qmkToKarabiner).map(
  ([qmkCode, karabinerCode]) => ({
    value: karabinerCode,
    label: qmkCode.replace(/^KC_/, ''),
  }),
);

export const modifierOptions = [
  {value: 'left_command', label: 'Left Command'},
  {value: 'right_command', label: 'Right Command'},
  {value: 'left_option', label: 'Left Option'},
  {value: 'right_option', label: 'Right Option'},
  {value: 'left_control', label: 'Left Control'},
  {value: 'right_control', label: 'Right Control'},
  {value: 'left_shift', label: 'Left Shift'},
  {value: 'right_shift', label: 'Right Shift'},
];

const assignment = (
  tap: KarabinerAction,
  hold: KarabinerAction = transparentAction(),
): KarabinerAssignment => ({tap, hold});

export function createDefaultWorkspace(): KarabinerWorkspace {
  const baseAssignments = Object.fromEntries(
    macbookKeys.map((key) => [
      key.code,
      assignment(keyAction(qmkToKarabiner[key.code] ?? 'vk_none')),
    ]),
  );

  baseAssignments.KC_CAPS = assignment(keyAction('escape'), layerAction('nav'));
  baseAssignments.KC_SPC = assignment(keyAction('spacebar'), layerAction('numbers'));

  return {
    version: 1,
    layers: [
      {
        id: BASE_LAYER_ID,
        name: 'Base',
        assignments: baseAssignments,
      },
      {
        id: 'nav',
        name: 'Nav',
        assignments: {
          KC_H: assignment(keyAction('left_arrow')),
          KC_J: assignment(keyAction('down_arrow')),
          KC_K: assignment(keyAction('up_arrow')),
          KC_L: assignment(keyAction('right_arrow')),
          KC_U: assignment(keyAction('home')),
          KC_I: assignment(keyAction('page_up')),
          KC_O: assignment(keyAction('end')),
          KC_N: assignment(keyAction('delete_or_backspace')),
          KC_M: assignment(keyAction('delete_forward')),
        },
      },
      {
        id: 'numbers',
        name: 'Numbers',
        assignments: {
          KC_U: assignment(keyAction('7')),
          KC_I: assignment(keyAction('8')),
          KC_O: assignment(keyAction('9')),
          KC_J: assignment(keyAction('4')),
          KC_K: assignment(keyAction('5')),
          KC_L: assignment(keyAction('6')),
          KC_M: assignment(keyAction('1')),
          KC_COMM: assignment(keyAction('2')),
          KC_DOT: assignment(keyAction('3')),
          KC_SPC: assignment(keyAction('0')),
        },
      },
      {
        id: 'symbols',
        name: 'Symbols',
        assignments: {},
      },
    ],
  };
}

export function loadWorkspace(): KarabinerWorkspace {
  try {
    const saved = localStorage.getItem(KARABINER_WORKSPACE_STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch (error) {
    console.warn('Unable to load KarabinerVIA workspace', error);
  }
  return createDefaultWorkspace();
}

export function saveWorkspace(workspace: KarabinerWorkspace) {
  localStorage.setItem(KARABINER_WORKSPACE_STORAGE_KEY, JSON.stringify(workspace));
}

export function assignmentFor(
  workspace: KarabinerWorkspace,
  layerIndex: number,
  keyCode: string,
) {
  return (
    workspace.layers[layerIndex]?.assignments[keyCode] ??
    assignment(transparentAction())
  );
}

export function setAssignment(
  workspace: KarabinerWorkspace,
  layerIndex: number,
  keyCode: string,
  next: KarabinerAssignment,
): KarabinerWorkspace {
  return {
    ...workspace,
    layers: workspace.layers.map((layer, index) =>
      index === layerIndex
        ? {
            ...layer,
            assignments: {
              ...layer.assignments,
              [keyCode]: next,
            },
          }
        : layer,
    ),
  };
}

export function actionLabel(action: KarabinerAction, workspace: KarabinerWorkspace) {
  if (action.kind === 'transparent') return '▽';
  if (action.kind === 'none') return '∅';
  if (action.kind === 'layer') {
    return (
      workspace.layers.find((layer) => layer.id === action.layerId)?.name ??
      'Layer'
    );
  }
  if (action.kind === 'shortcut') {
    return [...(action.modifiers ?? []), action.keyCode].filter(Boolean).join('+');
  }
  return action.keyCode ?? '';
}

function qmkForAction(action: KarabinerAction) {
  if (action.kind === 'transparent') return 'KC_TRNS';
  if (action.kind === 'none') return 'KC_NO';
  if (action.kind === 'key') return karabinerToQmk[action.keyCode ?? ''] ?? 'KC_NO';
  if (action.kind === 'modifier') {
    return karabinerToQmk[action.keyCode ?? ''] ?? 'KC_NO';
  }
  if (action.kind === 'layer') return 'KC_NO';
  return karabinerToQmk[action.keyCode ?? ''] ?? 'KC_NO';
}

export function workspaceToViaLayers(workspace: KarabinerWorkspace): Layer[] {
  const basicKeyToByte = getBasicKeyDict(KARABINER_VIA_PROTOCOL);
  const layerSize = macbookDefinition.matrix.rows * macbookDefinition.matrix.cols;
  return workspace.layers.map((layer) => {
    const keymap = Array(layerSize).fill(getByteForCode('KC_TRNS', basicKeyToByte));
    macbookKeys.forEach((key) => {
      const action = layer.assignments[key.code]?.tap ?? transparentAction();
      keymap[key.row * macbookDefinition.matrix.cols + key.col] = getByteForCode(
        qmkForAction(action),
        basicKeyToByte,
      );
    });
    return {keymap, isLoaded: true};
  });
}
