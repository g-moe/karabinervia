import { getMacbookKeyLabel, macbookLayoutKeys } from "./virtual-device";
import { actionLabel, assignmentFor, loadWorkspace, qmkToKarabiner } from "./workspace";

const keycapLabelMap: Record<string, string> = {
  grave_accent_and_tilde: "`",
  hyphen: "-",
  equal_sign: "=",
  delete_or_backspace: "delete",
  delete_forward: "Del",
  open_bracket: "[",
  close_bracket: "]",
  backslash: "\\",
  semicolon: ";",
  quote: "'",
  comma: ",",
  period: ".",
  slash: "/",
  caps_lock: "caps lock",
  fn: "fn",
  return_or_enter: "return",
  left_shift: "shift",
  right_shift: "shift",
  left_control: "⌃",
  right_control: "⌃",
  left_option: "⌥",
  right_option: "⌥",
  left_command: "⌘",
  right_command: "⌘",
  spacebar: "Space",
  left_arrow: "←",
  right_arrow: "→",
  up_arrow: "↑",
  down_arrow: "↓",
  escape: "esc",
  vk_none: "",
};

const shiftedKeycapLabelMap: Record<string, string> = {
  grave_accent_and_tilde: "~",
  "1": "!",
  "2": "@",
  "3": "#",
  "4": "$",
  "5": "%",
  "6": "^",
  "7": "&",
  "8": "*",
  "9": "(",
  "0": ")",
  hyphen: "_",
  equal_sign: "+",
  open_bracket: "{",
  close_bracket: "}",
  backslash: "|",
  semicolon: ":",
  quote: '"',
  comma: "<",
  period: ">",
  slash: "?",
};

const shortKarabinerLabel = (label: string) =>
  keycapLabelMap[label] ??
  label
    .replace(/^left_/, "L")
    .replace(/^right_/, "R")
    .replace(/_/g, " ")
    .replace("command", "Cmd")
    .replace("control", "Ctl")
    .replace("option", "Opt")
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

const shiftedPairLabel = (topLabel: string, bottomLabel: string) => ({
  ...twoLineLabel(topLabel, bottomLabel),
  key: `shifted:${topLabel}:${bottomLabel}`,
});

const physicalDefaultLabel = (defaultTap: string, shifted: boolean) => {
  const bottomLabel = shortKarabinerLabel(defaultTap);
  const shiftedLabel = shiftedKeycapLabelMap[defaultTap];

  if (shifted) {
    if (shiftedLabel) {
      return centerLabel(shiftedLabel);
    }
    return centerLabel(bottomLabel.length === 1 ? bottomLabel.toUpperCase() : bottomLabel);
  }

  if (shiftedLabel) {
    return shiftedPairLabel(shiftedLabel, bottomLabel);
  }
  return centerLabel(bottomLabel);
};

export const getKarabinerLabels = (layerIndex: number, shifted = false) => {
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
    const defaultTap = qmkToKarabiner[macKey.code] ?? "";
    if (
      displayLabel &&
      assignment.tap.kind === "key" &&
      assignment.tap.keyCode === defaultTap &&
      assignment.hold.kind === "transparent"
    ) {
      return centerLabel(displayLabel);
    }
    if (
      assignment.tap.kind === "key" &&
      assignment.tap.keyCode === defaultTap &&
      assignment.hold.kind === "transparent"
    ) {
      return physicalDefaultLabel(defaultTap, shifted);
    }

    const tap =
      assignment.tap.kind === "transparent" ? defaultTap : actionLabel(assignment.tap, workspace);
    const hold = actionLabel(assignment.hold, workspace);
    const bottomLabel = shortKarabinerLabel(tap);
    const topLabel = assignment.hold.kind === "transparent" ? "" : shortKarabinerLabel(hold);

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
