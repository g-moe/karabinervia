import type { DefinitionVersion, KeyboardDefinitionIndex, VIAMenu } from "@the-via/reader";
import { TestKeyboardSoundsMode } from "src/components/void/test-keyboard-sounds";

export enum TestKeyState {
  Initial,
  KeyDown,
  KeyUp,
}

export type HIDColor = {
  hue: number;
  sat: number;
};

export type DeviceInfo = {
  vendorId: number;
  productId: number;
  productName: string;
  protocol?: number;
};

export type Device = DeviceInfo & {
  path: string;
  productName: string;
  interface: number;
};

export type Keymap = number[];
export type Layer = {
  keymap: Keymap;
  isLoaded: boolean;
};

export type DeviceLayerMap = { [devicePath: string]: Layer[] };

export type ConnectedDevice = DeviceInfo & {
  path: string;
  vendorProductId: number;
  protocol: number;
  requiredDefinitionVersion: DefinitionVersion;
  hasResolvedDefinition: true;
};

export type ConnectedDevices = Record<string, ConnectedDevice>;

export type TestKeyboardSoundsSettings = {
  isEnabled: boolean;
  volume: number;
  waveform: OscillatorType;
  mode: TestKeyboardSoundsMode;
  transpose: number;
};

export type Settings = {
  disableFastRemap: boolean;
  themeMode: "light" | "dark";
  testKeyboardSoundsSettings: TestKeyboardSoundsSettings;
};

export type CommonMenusMap = {
  [menu: string]: VIAMenu[];
};

export type StoreData = {
  settings: Settings;
};

export type VendorProductIdMap = Record<number, { v2: boolean; v3: boolean }>;

export type DefinitionIndex = Pick<KeyboardDefinitionIndex, "generatedAt" | "version"> & {
  supportedVendorProductIdMap: VendorProductIdMap;
  hash: string;
};

export type EncoderBehavior = [number, number, number];
