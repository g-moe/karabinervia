import {KeyColorType, type VIADefinitionV3, type VIAKey} from '@the-via/reader';
import type {ConnectedDevice, Layer} from 'src/types/types';
import {getByteForCode} from 'src/utils/key';
import {getBasicKeyDict} from 'src/utils/key-to-byte/dictionary-store';

export const KARABINER_VIA_DEVICE_PATH = 'karabinervia://macbook-pro-touch-id';
export const KARABINER_VIA_VENDOR_PRODUCT_ID = 0x4b560001;
export const KARABINER_VIA_PROTOCOL = 11;

type MacKey = VIAKey & {
  code: string;
};

const key = (
  row: number,
  col: number,
  x: number,
  y: number,
  w: number,
  code: string,
  color: VIAKey['color'] = KeyColorType.Alpha,
  h = 1,
): MacKey => ({
  row,
  col,
  x,
  y,
  r: 0,
  rx: 0,
  ry: 0,
  d: false,
  h,
  w,
  color,
  code,
});

export const macbookKeys: MacKey[] = [
  key(0, 0, 0, 0, 1.25, 'KC_ESC', KeyColorType.Accent),

  key(1, 0, 0, 1, 1, 'KC_GRV'),
  key(1, 1, 1, 1, 1, 'KC_1'),
  key(1, 2, 2, 1, 1, 'KC_2'),
  key(1, 3, 3, 1, 1, 'KC_3'),
  key(1, 4, 4, 1, 1, 'KC_4'),
  key(1, 5, 5, 1, 1, 'KC_5'),
  key(1, 6, 6, 1, 1, 'KC_6'),
  key(1, 7, 7, 1, 1, 'KC_7'),
  key(1, 8, 8, 1, 1, 'KC_8'),
  key(1, 9, 9, 1, 1, 'KC_9'),
  key(1, 10, 10, 1, 1, 'KC_0'),
  key(1, 11, 11, 1, 1, 'KC_MINS'),
  key(1, 12, 12, 1, 1, 'KC_EQL'),
  key(1, 13, 13, 1, 1.85, 'KC_BSPC', KeyColorType.Mod),

  key(2, 0, 0, 2, 1.45, 'KC_TAB', KeyColorType.Mod),
  key(2, 1, 1.45, 2, 1, 'KC_Q'),
  key(2, 2, 2.45, 2, 1, 'KC_W'),
  key(2, 3, 3.45, 2, 1, 'KC_E'),
  key(2, 4, 4.45, 2, 1, 'KC_R'),
  key(2, 5, 5.45, 2, 1, 'KC_T'),
  key(2, 6, 6.45, 2, 1, 'KC_Y'),
  key(2, 7, 7.45, 2, 1, 'KC_U'),
  key(2, 8, 8.45, 2, 1, 'KC_I'),
  key(2, 9, 9.45, 2, 1, 'KC_O'),
  key(2, 10, 10.45, 2, 1, 'KC_P'),
  key(2, 11, 11.45, 2, 1, 'KC_LBRC'),
  key(2, 12, 12.45, 2, 1, 'KC_RBRC'),
  key(2, 13, 13.45, 2, 1.4, 'KC_BSLS'),

  key(3, 0, 0, 3, 1.7, 'KC_CAPS', KeyColorType.Mod),
  key(3, 1, 1.7, 3, 1, 'KC_A'),
  key(3, 2, 2.7, 3, 1, 'KC_S'),
  key(3, 3, 3.7, 3, 1, 'KC_D'),
  key(3, 4, 4.7, 3, 1, 'KC_F'),
  key(3, 5, 5.7, 3, 1, 'KC_G'),
  key(3, 6, 6.7, 3, 1, 'KC_H'),
  key(3, 7, 7.7, 3, 1, 'KC_J'),
  key(3, 8, 8.7, 3, 1, 'KC_K'),
  key(3, 9, 9.7, 3, 1, 'KC_L'),
  key(3, 10, 10.7, 3, 1, 'KC_SCLN'),
  key(3, 11, 11.7, 3, 1, 'KC_QUOT'),
  key(3, 12, 12.7, 3, 2.15, 'KC_ENT', KeyColorType.Accent),

  key(4, 0, 0, 4, 2.2, 'KC_LSFT', KeyColorType.Mod),
  key(4, 1, 2.2, 4, 1, 'KC_Z'),
  key(4, 2, 3.2, 4, 1, 'KC_X'),
  key(4, 3, 4.2, 4, 1, 'KC_C'),
  key(4, 4, 5.2, 4, 1, 'KC_V'),
  key(4, 5, 6.2, 4, 1, 'KC_B'),
  key(4, 6, 7.2, 4, 1, 'KC_N'),
  key(4, 7, 8.2, 4, 1, 'KC_M'),
  key(4, 8, 9.2, 4, 1, 'KC_COMM'),
  key(4, 9, 10.2, 4, 1, 'KC_DOT'),
  key(4, 10, 11.2, 4, 1, 'KC_SLSH'),
  key(4, 11, 12.2, 4, 2.65, 'KC_RSFT', KeyColorType.Mod),

  key(5, 0, 0, 5, 1, 'KC_FN', KeyColorType.Mod),
  key(5, 1, 1, 5, 1.2, 'KC_LCTL', KeyColorType.Mod),
  key(5, 2, 2.2, 5, 1.2, 'KC_LALT', KeyColorType.Mod),
  key(5, 3, 3.4, 5, 1.45, 'KC_LGUI', KeyColorType.Mod),
  key(5, 4, 4.85, 5, 5.45, 'KC_SPC'),
  key(5, 5, 10.3, 5, 1.45, 'KC_RGUI', KeyColorType.Mod),
  key(5, 6, 11.75, 5, 1.2, 'KC_RALT', KeyColorType.Mod),
  key(5, 7, 13.05, 5.5, 1, 'KC_LEFT', KeyColorType.Mod, 0.5),
  key(5, 8, 14.05, 5, 1, 'KC_UP', KeyColorType.Mod, 0.5),
  key(5, 9, 14.05, 5.5, 1, 'KC_DOWN', KeyColorType.Mod, 0.5),
  key(5, 10, 15.05, 5.5, 1, 'KC_RGHT', KeyColorType.Mod, 0.5),
];

export const macbookDefinition: VIADefinitionV3 = {
  name: 'MacBook Pro Touch ID',
  vendorProductId: KARABINER_VIA_VENDOR_PRODUCT_ID,
  firmwareVersion: 0,
  menus: [],
  keycodes: [],
  matrix: {
    rows: 6,
    cols: 14,
  },
  layouts: {
    width: 16.05,
    height: 6.45,
    optionKeys: {},
    keys: macbookKeys.map(({code, ...viaKey}) => viaKey),
  },
};

export const macbookConnectedDevice: ConnectedDevice = {
  path: KARABINER_VIA_DEVICE_PATH,
  vendorId: 0x4b56,
  productId: 0x0001,
  productName: 'MacBook Pro Touch ID',
  vendorProductId: KARABINER_VIA_VENDOR_PRODUCT_ID,
  protocol: KARABINER_VIA_PROTOCOL,
  requiredDefinitionVersion: 'v3',
  hasResolvedDefinition: true,
};

export function createDefaultLayers(): Layer[] {
  const basicKeyToByte = getBasicKeyDict(KARABINER_VIA_PROTOCOL);
  const blank = Array(macbookDefinition.matrix.rows * macbookDefinition.matrix.cols).fill(
    getByteForCode('KC_TRNS', basicKeyToByte),
  );
  const base = [...blank];
  macbookKeys.forEach((macKey) => {
    base[macKey.row * macbookDefinition.matrix.cols + macKey.col] = getByteForCode(
      macKey.code,
      basicKeyToByte,
    );
  });
  return [
    {keymap: base, isLoaded: true},
    {keymap: [...blank], isLoaded: true},
    {keymap: [...blank], isLoaded: true},
    {keymap: [...blank], isLoaded: true},
  ];
}
