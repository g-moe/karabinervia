import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { KeyboardDictionary, VIAKey } from "@the-via/reader";
import type { RootState } from "./index";
import { getSelectedConnectedDevice, getSelectedDevicePath } from "./devicesSlice";
import { getBasicKeyDict } from "../utils/key-to-byte/dictionary-store";
import { getByteToKey } from "../utils/key";

type DefinitionsState = {
  definitions: KeyboardDictionary;
};

const EMPTY_LAYOUT_OPTIONS: number[] = [];
const EMPTY_KEYS: VIAKey[] = [];

const initialState: DefinitionsState = {
  definitions: {},
};

const definitionsSlice = createSlice({
  name: "definitions",
  initialState,
  reducers: {
    updateDefinitions: (state, action: PayloadAction<KeyboardDictionary>) => {
      state.definitions = { ...state.definitions, ...action.payload };
    },
  },
});

export const { updateDefinitions } = definitionsSlice.actions;

export default definitionsSlice.reducer;

export const getDefinitions = (state: RootState) => state.definitions.definitions;

export const getSelectedDefinition = createSelector(
  getDefinitions,
  getSelectedConnectedDevice,
  (definitions, connectedDevice) =>
    connectedDevice &&
    definitions[connectedDevice.vendorProductId]?.[connectedDevice.requiredDefinitionVersion],
);

export const getBasicKeyToByte = createSelector(getSelectedConnectedDevice, (connectedDevice) => {
  const basicKeyToByte = getBasicKeyDict(connectedDevice ? connectedDevice.protocol : 0);
  return { basicKeyToByte, byteToKey: getByteToKey(basicKeyToByte) };
});

export const getSelectedLayoutOptions = createSelector(
  getSelectedDefinition,
  getSelectedDevicePath,
  (definition, path) =>
    (path &&
      definition &&
      typeof definition !== "string" &&
      definition?.layouts.labels &&
      definition.layouts.labels.map(() => 0)) ||
    EMPTY_LAYOUT_OPTIONS,
);

export const getSelectedOptionKeys = createSelector(
  getSelectedLayoutOptions,
  getSelectedDefinition,
  (layoutOptions, definition) =>
    (definition && typeof definition !== "string"
      ? layoutOptions.flatMap(
          (option: number, idx: number) =>
            (definition.layouts.optionKeys[idx] && definition.layouts.optionKeys[idx][option]) ||
            EMPTY_KEYS,
        )
      : EMPTY_KEYS) as VIAKey[],
);

export const getSelectedKeyDefinitions = createSelector(
  getSelectedDefinition,
  getSelectedOptionKeys,
  (definition, optionKeys) => {
    if (definition && typeof definition !== "string" && optionKeys) {
      return definition.layouts.keys.concat(optionKeys);
    }
    return EMPTY_KEYS;
  },
);
