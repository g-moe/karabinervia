import { current } from "@reduxjs/toolkit";
import { TestKeyboardSoundsMode } from "../components/void/test-keyboard-sounds";
import { APPLE_KEYCAP_THEME_BY_MODE } from "./themes";
import { Store } from "../shims/via-app-store";
import type { Settings, StoreData } from "../types/types";

let deviceStore: Store;

const defaultStoreData: StoreData = {
  settings: {
    disableFastRemap: false,
    themeMode: "dark",
    testKeyboardSoundsSettings: {
      isEnabled: true,
      volume: 100,
      waveform: "sine",
      mode: TestKeyboardSoundsMode.WickiHayden,
      transpose: 0,
    },
  },
};

function initDeviceStore() {
  deviceStore = new Store(defaultStoreData);
}

initDeviceStore();

export const getThemeFromStore = () =>
  APPLE_KEYCAP_THEME_BY_MODE[getThemeModeFromStore() || "dark"];

export const getThemeModeFromStore = (): "dark" | "light" => {
  return deviceStore.get("settings")?.themeMode;
};

export const getSettings = (): Settings => deviceStore.get("settings");

export const setSettings = (settings: Settings) => {
  deviceStore.set("settings", current(settings));
};
