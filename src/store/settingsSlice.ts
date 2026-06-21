import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { Settings, TestKeyboardSoundsSettings } from "../types/types";
import type { PropertiesOfType } from "../types/generic-types";
import { getSettings, setSettings } from "../utils/device-store";
import type { RootState } from ".";
import { APPLE_KEYCAP_THEME_BY_MODE } from "../utils/themes";

// TODO: why are these settings mixed? Is it because we only want some of them cached? SHould we rename to "CachedSettings"?
type SettingsState = Settings & {
  restartRequired: boolean;
  allowGlobalHotKeys: boolean;
};

const initialState: SettingsState = {
  ...getSettings(),
  restartRequired: false,
  allowGlobalHotKeys: false,
};

const toggleBool = (state: SettingsState, key: keyof PropertiesOfType<SettingsState, boolean>) => {
  state[key] = !state[key];
  setSettings(state);
};

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleFastRemap: (state) => {
      toggleBool(state, "disableFastRemap");
    },
    toggleThemeMode: (state) => {
      const newThemeMode = state.themeMode === "light" ? "dark" : "light";
      document.documentElement.dataset.themeMode = newThemeMode;
      state.themeMode = newThemeMode;
      setSettings(state);
    },
    setTestKeyboardSoundsSettings: (
      state,
      action: PayloadAction<Partial<TestKeyboardSoundsSettings>>,
    ) => {
      const testKeyboardSoundsSettings = {
        ...state.testKeyboardSoundsSettings,
        ...action.payload,
      };
      state.testKeyboardSoundsSettings = testKeyboardSoundsSettings;
      setSettings(state);
    },
    disableGlobalHotKeys: (state) => {
      state.allowGlobalHotKeys = false;
    },
    enableGlobalHotKeys: (state) => {
      state.allowGlobalHotKeys = true;
    },
  },
});

export const {
  toggleFastRemap,
  setTestKeyboardSoundsSettings,
  toggleThemeMode,
  disableGlobalHotKeys,
  enableGlobalHotKeys,
} = settingsSlice.actions;

export default settingsSlice.reducer;

export const getAllowGlobalHotKeys = (state: RootState) => state.settings.allowGlobalHotKeys;
export const getDisableFastRemap = (state: RootState) => state.settings.disableFastRemap;
export const getRestartRequired = (state: RootState) => state.settings.restartRequired;
export const getTestKeyboardSoundsSettings = (state: RootState) =>
  state.settings.testKeyboardSoundsSettings;
export const getThemeMode = (state: RootState) => state.settings.themeMode;
export const getSelectedTheme = (state: RootState) =>
  APPLE_KEYCAP_THEME_BY_MODE[state.settings.themeMode];
