import {useMemo} from 'react';
import {getBasicKeyToByte} from 'src/store/definitionsSlice';
import {useAppDispatch, useAppSelector} from 'src/store/hooks';
import {getSelectedKey, getSelectedLayerIndex} from 'src/store/keymapSlice';
import {getExpressions} from 'src/store/macrosSlice';
import {getSelectedTheme} from 'src/store/settingsSlice';
import {KeyGroupProps, KeysKeys} from 'src/types/keyboard-rendering';
import {getRGB} from 'src/utils/color-math';
import {
  calculateKeyboardFrameDimensions,
  CSSVarObject,
  getComboKeyProps,
} from 'src/utils/keyboard-rendering';
import {useSkipFontCheck} from 'src/utils/use-skip-font-check';
import styled from 'styled-components';
import {Color} from 'three';
import {
  getKeycapSharedProps,
  getKeysKeys,
  getLabels,
} from '../n-links/key-group';
import {CaseInsideBorder} from './case';
import {Keycap} from './unit-key/keycap';
import {KARABINER_VIA_VENDOR_PRODUCT_ID, macbookKeys} from 'src/karabiner/virtual-device';
import {
  actionLabel,
  assignmentFor,
  loadWorkspace,
  qmkToKarabiner,
} from 'src/karabiner/workspace';

const KeyGroupContainer = styled.div<{height: number; width: number}>`
  position: absolute;
  top: ${(p) => CaseInsideBorder * 1.5}px;
  left: ${(p) => CaseInsideBorder * 1.5}px;
`;

const getPosition = (x: number, y: number): [number, number, number] => [
  x - CSSVarObject.keyWidth / 2,
  y - CSSVarObject.keyHeight / 2,
  0,
];
const getRGBArray = (keyColors: number[][]) => {
  return keyColors.map(([hue, sat]) => {
    const rgbStr = getRGB({
      hue: Math.round((255 * hue) / 360),
      sat: Math.round(255 * sat),
    });
    const srgbStr = `#${new Color(rgbStr).getHexString()}`;
    const keyColor = {c: srgbStr, t: srgbStr};
    return keyColor;
  });
};

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
  return_or_enter: 'Enter',
  left_shift: 'LShift',
  right_shift: 'RShift',
  left_control: 'LCtl',
  right_control: 'RCtl',
  left_option: 'LOpt',
  right_option: 'ROpt',
  left_command: 'LCmd',
  right_command: 'RCmd',
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

const getKarabinerLabels = (layerIndex: number) => {
  const workspace = loadWorkspace();
  return macbookKeys.map((macKey) => {
    const assignment = assignmentFor(workspace, layerIndex, macKey.code);
    const tap =
      assignment.tap.kind === 'transparent'
        ? qmkToKarabiner[macKey.code] ?? ''
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
    return {
      label: bottomLabel,
      centerLabel: bottomLabel,
      tooltipLabel: `${tap}${topLabel ? ` / ${hold}` : ''}`,
      key: bottomLabel,
      size: 1,
      offset: [0, 0],
    };
  });
};

export const KeyGroup: React.FC<KeyGroupProps<React.MouseEvent>> = (props) => {
  const dispatch = useAppDispatch();
  const selectedKey = useAppSelector(getSelectedKey);
  const selectedLayerIndex = useAppSelector(getSelectedLayerIndex);
  const selectedTheme = useAppSelector(getSelectedTheme);
  const macroExpressions = useAppSelector(getExpressions);
  const skipFontCheck = useSkipFontCheck();
  const keyColorPalette = props.keyColors
    ? getRGBArray(props.keyColors)
    : selectedTheme;
  const {basicKeyToByte, byteToKey} = useAppSelector(getBasicKeyToByte);
  const macros = useAppSelector((state) => state.macros);
  const {keys, selectedKey: externalSelectedKey} = props;
  const selectedKeyIndex =
    externalSelectedKey === undefined ? selectedKey : externalSelectedKey;
  const keysKeys: KeysKeys<React.MouseEvent> = useMemo(() => {
    return getKeysKeys(props, keyColorPalette, dispatch, getPosition);
  }, [
    keys,
    keyColorPalette,
    props.onKeycapPointerDown,
    props.onKeycapPointerOver,
  ]);
  const labels = useMemo(() => {
    if (props.definition.vendorProductId === KARABINER_VIA_VENDOR_PRODUCT_ID) {
      return getKarabinerLabels(selectedLayerIndex);
    }
    return getLabels(props, macroExpressions, basicKeyToByte, byteToKey);
  }, [keys, props.matrixKeycodes, macros, props.definition, selectedLayerIndex]);
  const {width, height} = calculateKeyboardFrameDimensions(keys);
  const elems = useMemo(() => {
    return props.keys.map((k, i) => {
      return k.d ? null : (
        <Keycap
          {...getComboKeyProps(k)}
          {...getKeycapSharedProps(
            k,
            i,
            props,
            keysKeys,
            selectedKeyIndex,
            labels,
            skipFontCheck,
          )}
        />
      );
    });
  }, [
    keys,
    selectedKeyIndex,
    labels,
    props.pressedKeys,
    props.selectable,
    keyColorPalette,
    props.definition.vendorProductId,
    skipFontCheck,
  ]);
  return (
    <KeyGroupContainer
      height={height}
      width={width}
      style={{pointerEvents: props.selectable ? 'all' : 'none'}}
    >
      {elems}
    </KeyGroupContainer>
  );
};
