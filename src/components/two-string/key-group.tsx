import {useEffect, useMemo, useState} from 'react';
import {useAppDispatch, useAppSelector} from 'src/store/hooks';
import {getSelectedKey, getSelectedLayerIndex} from 'src/store/keymapSlice';
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
import {
  getKeycapSharedProps,
  getKeysKeys,
} from '../n-links/key-group';
import {CaseInsideBorder} from './case';
import {Keycap} from './unit-key/keycap';
import {KARABINER_VIA_VENDOR_PRODUCT_ID} from 'src/karabiner/virtual-device';
import {getKarabinerLabels} from 'src/karabiner/labels';

const KeyGroupContainer = styled.div<{
  height: number;
  width: number;
  $selectable: boolean;
}>`
  position: absolute;
  top: ${(p) => CaseInsideBorder * 1.5}px;
  left: ${(p) => CaseInsideBorder * 1.5}px;
  pointer-events: ${(p) => (p.$selectable ? 'all' : 'none')};
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
    const keyColor = {c: rgbStr, t: rgbStr};
    return keyColor;
  });
};

export const KeyGroup: React.FC<KeyGroupProps<React.MouseEvent>> = (props) => {
  const dispatch = useAppDispatch();
  const selectedKey = useAppSelector(getSelectedKey);
  const selectedLayerIndex = useAppSelector(getSelectedLayerIndex);
  const selectedTheme = useAppSelector(getSelectedTheme);
  const skipFontCheck = useSkipFontCheck();
  const keyColorPalette = props.keyColors
    ? getRGBArray(props.keyColors)
    : selectedTheme;
  const {keys, selectedKey: externalSelectedKey} = props;
  const isKarabinerDevice =
    props.definition.vendorProductId === KARABINER_VIA_VENDOR_PRODUCT_ID;
  const [isShiftPreviewActive, setIsShiftPreviewActive] = useState(false);
  const selectedKeyIndex =
    externalSelectedKey === undefined ? selectedKey : externalSelectedKey;
  const keysKeys: KeysKeys<React.MouseEvent> = useMemo(() => {
    return getKeysKeys(props, keyColorPalette, dispatch, getPosition);
  }, [
    keys,
    keyColorPalette,
    props.onKeycapPointerDown,
    props.onKeycapPointerOver,
    props.onKeycapClick,
  ]);
  const previewKeysKeys = useMemo(() => {
    if (!isKarabinerDevice) {
      return keysKeys;
    }
    return {
      ...keysKeys,
      coords: keysKeys.coords.map((coords, index) => {
        const key = keys[index];
        const isShiftKey =
          key.row === 4 && (key.col === 0 || key.col === 11);
        if (!isShiftKey) {
          return coords;
        }
        return {
          ...coords,
          onPointerDown: (event: React.MouseEvent, idx: number) => {
            setIsShiftPreviewActive(true);
            coords.onPointerDown?.(event, idx);
          },
          onClick: (event: React.MouseEvent, idx: number) => {
            setIsShiftPreviewActive(true);
            coords.onClick(event, idx);
          },
        };
      }),
    };
  }, [isKarabinerDevice, keysKeys, keys]);
  useEffect(() => {
    if (!isShiftPreviewActive) {
      return undefined;
    }
    const releaseShiftPreview = () => setIsShiftPreviewActive(false);
    window.addEventListener('pointerup', releaseShiftPreview);
    window.addEventListener('mouseup', releaseShiftPreview);
    window.addEventListener('blur', releaseShiftPreview);
    return () => {
      window.removeEventListener('pointerup', releaseShiftPreview);
      window.removeEventListener('mouseup', releaseShiftPreview);
      window.removeEventListener('blur', releaseShiftPreview);
    };
  }, [isShiftPreviewActive]);
  const labels = useMemo(() => {
    return getKarabinerLabels(selectedLayerIndex, isShiftPreviewActive);
  }, [
    keys,
    props.matrixKeycodes,
    props.definition,
    selectedLayerIndex,
    isShiftPreviewActive,
  ]);
  const {width, height} = calculateKeyboardFrameDimensions(keys);
  const elems = useMemo(() => {
    return props.keys.map((k, i) => {
      const {key, ...sharedProps} = getKeycapSharedProps(
        k,
        i,
        props,
        previewKeysKeys,
        selectedKeyIndex,
        labels,
        skipFontCheck,
      );
      return k.d ? null : (
        <Keycap
          key={key}
          {...getComboKeyProps(k)}
          {...sharedProps}
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
    previewKeysKeys,
    skipFontCheck,
  ]);
  return (
    <KeyGroupContainer
      height={height}
      width={width}
      $selectable={Boolean(props.selectable)}
    >
      {elems}
    </KeyGroupContainer>
  );
};
