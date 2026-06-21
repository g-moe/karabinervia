import {getMacbookKeyLabel, macbookLayoutKeys} from './virtual-device';
import {
  actionLabel,
  assignmentFor,
  loadWorkspace,
  qmkToKarabiner,
} from './workspace';

const keycapLabelMap: Record<string, string> = {
  grave_accent_and_tilde: '`',
  hyphen: '-',
  equal_sign: '=',
  delete_or_backspace: 'Bspc',
  delete_forward: 'Del',
  open_bracket: '[',
  close_bracket: ']',
  backslash: '\\',
  semicolon: ';',
  quote: "'",
  comma: ',',
  period: '.',
  slash: '/',
  caps_lock: 'Caps',
  fn: 'fn',
  return_or_enter: 'Enter',
  left_shift: 'LShift',
  right_shift: 'RShift',
  left_control: '⌃',
  right_control: '⌃',
  left_option: '⌥',
  right_option: '⌥',
  left_command: '⌘',
  right_command: '⌘',
  spacebar: 'Space',
  left_arrow: 'Left',
  right_arrow: 'Right',
  up_arrow: 'Up',
  down_arrow: 'Down',
  escape: 'Esc',
  vk_none: '',
};

const shortKarabinerLabel = (label: string) =>
  keycapLabelMap[label] ??
  label
    .replace(/^left_/, 'L')
    .replace(/^right_/, 'R')
    .replace(/_/g, ' ')
    .replace('command', 'Cmd')
    .replace('control', 'Ctl')
    .replace('option', 'Opt')
    .trim();

const centerLabel = (label: string) => ({
  label,
  centerLabel: label,
  tooltipLabel: label,
  key: label,
  size: label.length > 4 ? 0.7 : 1,
  offset: [0, 0],
});

const twoLineLabel = (topLabel: string, bottomLabel: string) => ({
  topLabel,
  bottomLabel,
  key: `${topLabel}:${bottomLabel}`,
  size: 0.75,
  offset: [0, 0],
});

export const getKarabinerLabels = (layerIndex: number) => {
  const workspace = loadWorkspace();
  return macbookLayoutKeys.map((macKey) => {
    if (macKey.displayTopLabel && macKey.displayBottomLabel) {
      return twoLineLabel(macKey.displayTopLabel, macKey.displayBottomLabel);
    }

    const displayLabel = getMacbookKeyLabel(macKey);
    if (macKey.displayOnly && displayLabel) {
      return centerLabel(displayLabel);
    }

    const assignment = assignmentFor(workspace, layerIndex, macKey.code);
    const defaultTap = qmkToKarabiner[macKey.code] ?? '';
    if (
      displayLabel &&
      assignment.tap.kind === 'key' &&
      assignment.tap.keyCode === defaultTap &&
      assignment.hold.kind === 'transparent'
    ) {
      return centerLabel(displayLabel);
    }

    const tap =
      assignment.tap.kind === 'transparent'
        ? defaultTap
        : actionLabel(assignment.tap, workspace);
    const hold = actionLabel(assignment.hold, workspace);
    const bottomLabel = shortKarabinerLabel(tap);
    const topLabel =
      assignment.hold.kind === 'transparent' ? '' : shortKarabinerLabel(hold);

    if (topLabel) {
      return {
        topLabel,
        bottomLabel,
        key: `${topLabel}:${bottomLabel}`,
        size: 0.8,
        offset: [0, 0],
      };
    }
    return centerLabel(bottomLabel);
  });
};
